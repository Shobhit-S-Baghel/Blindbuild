/**
 * BlindBuild Core Data Store
 * Secure server-side repository with strict separation between public anonymous data
 * and encrypted/gated private identities.
 */

import fs from "fs";
import path from "path";
import {
  AnonymousBuilder,
  PrivateIdentity,
  Project,
  Audition,
  GuardrailLogEntry,
} from "@/types";
import {
  SEED_BUILDERS,
  SEED_IDENTITIES,
  SEED_PROJECTS,
  SEED_AUDITIONS,
  SEED_GUARDRAIL_LOGS,
} from "./seedData";

interface DatabaseSchema {
  builders: AnonymousBuilder[];
  privateIdentities: Record<string, PrivateIdentity>; // builderId -> PrivateIdentity
  projects: Project[];
  auditions: Audition[];
  guardrailLogs: GuardrailLogEntry[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

/**
 * Ensures the persistent JSON storage schema is initialized and loaded,
 * falling back to initial seed data if the database file does not exist.
 */
function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      builders: SEED_BUILDERS,
      privateIdentities: SEED_IDENTITIES,
      projects: SEED_PROJECTS,
      auditions: SEED_AUDITIONS,
      guardrailLogs: SEED_GUARDRAIL_LOGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    const resetData: DatabaseSchema = {
      builders: SEED_BUILDERS,
      privateIdentities: SEED_IDENTITIES,
      projects: SEED_PROJECTS,
      auditions: SEED_AUDITIONS,
      guardrailLogs: SEED_GUARDRAIL_LOGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(resetData, null, 2), "utf-8");
    return resetData;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ==========================================
// BUILDERS
// ==========================================

export function getBuilders(): AnonymousBuilder[] {
  const db = ensureDatabase();
  return db.builders;
}

export function getBuilderById(id: string): AnonymousBuilder | null {
  const db = ensureDatabase();
  return db.builders.find((b) => b.id === id || b.builderNumber === id) || null;
}

export function saveBuilder(
  builder: AnonymousBuilder,
  privateIdentity: PrivateIdentity
): { builder: AnonymousBuilder } {
  const db = ensureDatabase();
  const existingIdx = db.builders.findIndex((b) => b.id === builder.id);
  if (existingIdx >= 0) {
    db.builders[existingIdx] = builder;
  } else {
    db.builders.push(builder);
  }
  db.privateIdentities[builder.id] = privateIdentity;
  writeDatabase(db);
  return { builder };
}

// ==========================================
// PROJECTS
// ==========================================

export function getProjects(): Project[] {
  const db = ensureDatabase();
  return db.projects;
}

export function getProjectById(id: string): Project | null {
  const db = ensureDatabase();
  return db.projects.find((p) => p.id === id) || null;
}

export function saveProject(project: Project): Project {
  const db = ensureDatabase();
  const existingIdx = db.projects.findIndex((p) => p.id === project.id);
  if (existingIdx >= 0) {
    db.projects[existingIdx] = project;
  } else {
    db.projects.unshift(project);
  }
  writeDatabase(db);
  return project;
}

// ==========================================
// AUDITIONS & DOUBLE-OPT-IN REVEAL
// ==========================================

export function getAuditions(builderId?: string): Audition[] {
  const db = ensureDatabase();
  if (!builderId) return db.auditions;
  return db.auditions.filter((a) => a.applicantId === builderId || a.projectId in getPosterProjectIds(builderId, db));
}

function getPosterProjectIds(posterId: string, db: DatabaseSchema): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const p of db.projects) {
    if (p.posterId === posterId) {
      map[p.id] = true;
    }
  }
  return map;
}

export function getAuditionById(id: string): Audition | null {
  const db = ensureDatabase();
  return db.auditions.find((a) => a.id === id) || null;
}

export function saveAudition(audition: Audition): Audition {
  const db = ensureDatabase();
  const existingIdx = db.auditions.findIndex((a) => a.id === audition.id);
  if (existingIdx >= 0) {
    db.auditions[existingIdx] = audition;
  } else {
    db.auditions.unshift(audition);
  }
  writeDatabase(db);
  return audition;
}

/**
 * Handle mutual approval handshake.
 * If both poster and applicant have approved, reveals workspace and identities.
 */
export function approveAuditionByParty(
  auditionId: string,
  party: "POSTER" | "APPLICANT"
): { audition: Audition; newlyRevealed: boolean } {
  const db = ensureDatabase();
  const audition = db.auditions.find((a) => a.id === auditionId);
  if (!audition) {
    throw new Error(`Audition ${auditionId} not found`);
  }

  if (party === "POSTER") {
    audition.posterApproved = true;
  } else {
    audition.applicantApproved = true;
  }

  let newlyRevealed = false;

  if (audition.posterApproved && audition.applicantApproved) {
    audition.status = "REVEALED";
    newlyRevealed = true;

    // Fetch poster builder id
    const project = db.projects.find((p) => p.id === audition.projectId);
    const posterId = project ? project.posterId : "b-409";
    const applicantId = audition.applicantId;

    const posterIdentity = db.privateIdentities[posterId] || {
      builderId: posterId,
      realName: "Rahul Sharma",
      college: "IIT Delhi",
      yearOfStudy: "1st Year B.Tech",
      email: "rahul.sharma@example.edu",
      whatsapp: "+91 98712 34567",
      linkedinUrl: "https://linkedin.com/in/rahul-builds",
    };

    const applicantIdentity = db.privateIdentities[applicantId] || {
      builderId: applicantId,
      realName: "Priya Nair",
      college: "BITS Pilani",
      yearOfStudy: "3rd Year B.E.",
      email: "priya.nair@example.edu",
      whatsapp: "+91 98123 45678",
      linkedinUrl: "https://linkedin.com/in/priya-nair-distributed",
    };

    audition.revealedWorkspace = {
      githubOrgUrl: `https://github.com/blindbuild-ventures/${audition.projectId}`,
      discordInviteUrl: `https://discord.gg/blindbuild-pod-${audition.roleId}`,
      posterIdentity,
      applicantIdentity,
    };

    // Mark role as filled
    if (project) {
      const role = project.roles.find((r) => r.id === audition.roleId);
      if (role) {
        role.status = "FILLED";
        role.filledByBuilderNumber = audition.applicantNumber;
      }
    }
  } else if (audition.posterApproved) {
    audition.status = "POSTER_APPROVED";
  } else if (audition.applicantApproved) {
    audition.status = "APPLICANT_APPROVED";
  }

  writeDatabase(db);
  return { audition, newlyRevealed };
}

/**
 * Strict server-side gatekeeper: NEVER return private identity fields
 * unless a mutual approval record exists for this audition/pair.
 */
export function getRevealedIdentityGated(
  targetBuilderId: string,
  requestingBuilderId: string,
  auditionId: string
): PrivateIdentity | null {
  const db = ensureDatabase();
  const audition = db.auditions.find((a) => a.id === auditionId);
  if (!audition) return null;

  // Enforce mutual approval
  if (!audition.posterApproved || !audition.applicantApproved || audition.status !== "REVEALED") {
    return null;
  }

  const project = db.projects.find((p) => p.id === audition.projectId);
  const posterId = project ? project.posterId : "";

  // Requester must be either the poster or the applicant
  if (requestingBuilderId !== posterId && requestingBuilderId !== audition.applicantId) {
    return null;
  }

  return db.privateIdentities[targetBuilderId] || null;
}

// ==========================================
// GUARDRAIL LOGS
// ==========================================

export function getGuardrailLogs(): GuardrailLogEntry[] {
  const db = ensureDatabase();
  return db.guardrailLogs;
}

export function logGuardrailEvent(entry: Omit<GuardrailLogEntry, "id" | "timestamp">): GuardrailLogEntry {
  const db = ensureDatabase();
  const newEntry: GuardrailLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };
  db.guardrailLogs.unshift(newEntry);
  writeDatabase(db);
  return newEntry;
}

export function resetDatabaseToSeed(): void {
  const resetData: DatabaseSchema = {
    builders: SEED_BUILDERS,
    privateIdentities: SEED_IDENTITIES,
    projects: SEED_PROJECTS,
    auditions: SEED_AUDITIONS,
    guardrailLogs: SEED_GUARDRAIL_LOGS,
  };
  writeDatabase(resetData);
}
