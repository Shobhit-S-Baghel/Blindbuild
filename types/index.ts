export interface VerifiedStats {
  builderNumber: string; // e.g. "Builder #409"
  topLanguage: string; // e.g. "Python/FastAPI"
  percentileRank: number; // e.g. 4 (Top 4%)
  contributionsCount: number; // e.g. 1420
  publicReposCount: number;
  hackathonWins: {
    count: number;
    tags: string[]; // e.g. ["ETHIndia '24 Finalist", "Smart India Hackathon Winner"]
    verified: boolean;
  };
  hasVerifiedMLRepo: boolean;
  leetCodeStats?: {
    solvedCount: number;
    contestRating: number;
    ranking: string;
  };
  scholarStats?: {
    citations: number;
    hIndex: number;
    verifiedPaper: boolean;
  };
  cryptographicSignature: string; // HMAC-SHA256 signature
  identiconSeed: string;
}

export interface AnonymousBuilder {
  id: string;
  builderNumber: string;
  githubUsername: string;
  leetcodeUsername?: string;
  scholarUrl?: string;
  stats: VerifiedStats;
  createdAt: string;
}

export interface PrivateIdentity {
  builderId: string;
  realName: string;
  college: string;
  yearOfStudy: string; // e.g. "1st Year B.Tech"
  email: string;
  whatsapp: string;
  linkedinUrl: string;
  avatarPlaceholderUrl?: string;
}

export interface ProjectRole {
  id: string;
  title: string; // e.g. "FastAPI Backend & Vector DB"
  skills: string[]; // ["Python", "FastAPI", "Qdrant", "Docker"]
  minStats: string; // e.g. "Top 10% Python or 500+ commits"
  estHours: number; // e.g. 14
  status: "OPEN" | "APPLIED" | "FILLED";
  filledByBuilderNumber?: string;
  customQuestion?: string; // Question typed by project creator for applicants
}

export interface ProjectOriginalityScore {
  score: number; // 0 - 100
  originality: number; // 0 - 100
  technicalFeasibility: number; // 0 - 100
  scopeRealism: number; // 0 - 100
  summary: string;
  nearDuplicateMatch?: {
    matchedProjectId: string;
    matchedTitle: string;
    similarityPercent: number;
    reason: string;
  } | null;
}

export interface Project {
  id: string;
  posterId: string;
  posterNumber: string;
  title: string;
  oneLinePitch: string;
  techStack: string[];
  diagramMermaid: string;
  roles: ProjectRole[];
  totalEstHours: number;
  risks: string[];
  stressTestSummary: string;
  originality: ProjectOriginalityScore;
  createdAt: string;
}

export interface Audition {
  id: string;
  projectId: string;
  projectTitle: string;
  roleId: string;
  roleTitle: string;
  applicantId: string;
  applicantNumber: string;
  applicantStats: VerifiedStats;
  auditionType: "QUESTION" | "PR_LINK";
  questionText: string;
  applicantAnswer: string;
  score: number; // 0 - 100
  feedback: string;
  passed: boolean;
  posterApproved: boolean;
  applicantApproved: boolean;
  status: "IN_PROGRESS" | "AWAITING_APPROVAL" | "POSTER_APPROVED" | "APPLICANT_APPROVED" | "REVEALED" | "DECLINED";
  revealedWorkspace?: {
    githubOrgUrl: string;
    discordInviteUrl: string;
    posterIdentity: PrivateIdentity;
    applicantIdentity: PrivateIdentity;
  };
  createdAt: string;
  completedAt?: string;
}

export interface GuardrailLogEntry {
  id: string;
  timestamp: string;
  actionType: "IDEA_ORIGINALITY" | "MESSAGE_CONTACT_LEAK" | "TOXICITY_CHECK" | "AUDITION_SUBMISSION";
  builderNumber: string;
  inputSnippet: string;
  verdict: "PASS" | "WARNING" | "BLOCKED";
  reason: string;
  score?: number;
  blockedDetails?: string[];
}
