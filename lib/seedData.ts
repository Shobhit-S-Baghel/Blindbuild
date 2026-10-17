import { AnonymousBuilder, PrivateIdentity, Project, Audition, GuardrailLogEntry } from "@/types";
import { signStatsPayload } from "./crypto";

// Helper to compute HMAC
function createSignedStats(
  builderNumber: string,
  topLanguage: string,
  percentileRank: number,
  contributionsCount: number,
  hackathons: { count: number; tags: string[]; verified: boolean },
  hasVerifiedMLRepo: boolean,
  leetCode?: { solvedCount: number; contestRating: number; ranking: string },
  scholar?: { citations: number; hIndex: number; verifiedPaper: boolean }
) {
  const sig = signStatsPayload({
    builderNumber,
    topLanguage,
    percentileRank,
    contributionsCount,
    hackathonWinsCount: hackathons.count,
    hasVerifiedMLRepo,
  });

  return {
    builderNumber,
    topLanguage,
    percentileRank,
    contributionsCount,
    publicReposCount: Math.max(8, Math.round(contributionsCount / 45)),
    hackathonWins: hackathons,
    hasVerifiedMLRepo,
    leetCodeStats: leetCode,
    scholarStats: scholar,
    cryptographicSignature: sig,
    identiconSeed: builderNumber.replace(/\D/g, "") || "409",
  };
}

export const SEED_BUILDERS: AnonymousBuilder[] = [
  {
    id: "b-409",
    builderNumber: "Builder #409",
    githubUsername: "rahul-builds-systems",
    leetcodeUsername: "rahul_409",
    scholarUrl: "https://scholar.google.com/citations?user=sample409",
    createdAt: "2025-01-10T10:00:00Z",
    stats: createSignedStats(
      "Builder #409",
      "Python/FastAPI",
      4,
      1420,
      { count: 3, tags: ["ETHIndia '24 Finalist", "Smart India Hackathon 1st"], verified: true },
      true,
      { solvedCount: 480, contestRating: 1980, ranking: "Knight (Top 4.2%)" },
      { citations: 42, hIndex: 3, verifiedPaper: true }
    ),
  },
  {
    id: "b-219",
    builderNumber: "Builder #219",
    githubUsername: "priya-distributed",
    leetcodeUsername: "priya_algo",
    createdAt: "2025-01-12T11:00:00Z",
    stats: createSignedStats(
      "Builder #219",
      "Rust/Systems",
      2,
      2150,
      { count: 4, tags: ["Solana Grizzlython Winner", "HackOut '24"], verified: true },
      false,
      { solvedCount: 650, contestRating: 2140, ranking: "Guardian (Top 1.1%)" }
    ),
  },
  {
    id: "b-104",
    builderNumber: "Builder #104",
    githubUsername: "alex-edge-ai",
    leetcodeUsername: "alex_ml",
    createdAt: "2025-01-14T09:30:00Z",
    stats: createSignedStats(
      "Builder #104",
      "PyTorch/CUDA",
      3,
      1780,
      { count: 2, tags: ["Kaggle Grandmaster Track", "HackMIT '24"], verified: true },
      true,
      { solvedCount: 390, contestRating: 1890, ranking: "Knight (Top 6.1%)" },
      { citations: 89, hIndex: 5, verifiedPaper: true }
    ),
  },
  {
    id: "b-512",
    builderNumber: "Builder #512",
    githubUsername: "dev-sam-ui",
    leetcodeUsername: "sam_dev",
    createdAt: "2025-01-15T14:20:00Z",
    stats: createSignedStats(
      "Builder #512",
      "TypeScript/Next.js",
      6,
      1120,
      { count: 2, tags: ["Devfolio Build-A-Thon Winner"], verified: true },
      false,
      { solvedCount: 310, contestRating: 1720, ranking: "Knight (Top 8.9%)" }
    ),
  },
  {
    id: "b-633",
    builderNumber: "Builder #633",
    githubUsername: "kavya-cloud-native",
    leetcodeUsername: "kavya_ops",
    createdAt: "2025-01-16T16:00:00Z",
    stats: createSignedStats(
      "Builder #633",
      "Go/Kubernetes",
      5,
      1340,
      { count: 1, tags: ["KubeCon Student Fellow"], verified: true },
      false,
      { solvedCount: 420, contestRating: 1850, ranking: "Knight (Top 7.2%)" }
    ),
  },
  {
    id: "b-721",
    builderNumber: "Builder #721",
    githubUsername: "arjun-zkp",
    leetcodeUsername: "arjun_zk",
    createdAt: "2025-01-17T12:10:00Z",
    stats: createSignedStats(
      "Builder #721",
      "Solidity/Circom",
      1,
      2890,
      { count: 5, tags: ["ETHDenver Grand Prize", "ZKonnect Winner"], verified: true },
      false,
      { solvedCount: 710, contestRating: 2280, ranking: "Guardian (Top 0.5%)" }
    ),
  },
  {
    id: "b-808",
    builderNumber: "Builder #808",
    githubUsername: "neha-data-eng",
    leetcodeUsername: "neha_de",
    createdAt: "2025-01-18T18:40:00Z",
    stats: createSignedStats(
      "Builder #808",
      "Python/DuckDB",
      7,
      980,
      { count: 1, tags: ["Open Source Contributor @ Apache"], verified: true },
      true,
      { solvedCount: 290, contestRating: 1680, ranking: "Specialist" }
    ),
  },
  {
    id: "b-945",
    builderNumber: "Builder #945",
    githubUsername: "tanmay-fullstack",
    leetcodeUsername: "tanmay_ts",
    createdAt: "2025-01-19T08:15:00Z",
    stats: createSignedStats(
      "Builder #945",
      "React/WebSockets",
      8,
      890,
      { count: 2, tags: ["HackOverFlow 2024 Winner"], verified: true },
      false,
      { solvedCount: 340, contestRating: 1760, ranking: "Knight (Top 7.9%)" }
    ),
  },
];

// STRICTLY SEPARATE IDENTITIES (Held in vault, locked until mutual unlock)
export const SEED_IDENTITIES: Record<string, PrivateIdentity> = {
  "b-409": {
    builderId: "b-409",
    realName: "Rahul Sharma",
    college: "IIT Delhi",
    yearOfStudy: "1st Year B.Tech (CSE)",
    email: "rahul.sharma.iitd@gmail.com",
    whatsapp: "+91 98712 34567",
    linkedinUrl: "https://linkedin.com/in/rahulsharma-builds",
  },
  "b-219": {
    builderId: "b-219",
    realName: "Priya Nair",
    college: "BITS Pilani",
    yearOfStudy: "3rd Year B.E. (CS)",
    email: "priya.nair.bits@gmail.com",
    whatsapp: "+91 98123 45678",
    linkedinUrl: "https://linkedin.com/in/priya-nair-distributed",
  },
  "b-104": {
    builderId: "b-104",
    realName: "Alexander Vance",
    college: "Ashoka University",
    yearOfStudy: "2nd Year B.Sc (Data Science)",
    email: "alex.vance@alumni.ashoka.edu",
    whatsapp: "+91 97654 32109",
    linkedinUrl: "https://linkedin.com/in/alex-vance-ml",
  },
  "b-512": {
    builderId: "b-512",
    realName: "Sameer Saxena",
    college: "IIIT Hyderabad",
    yearOfStudy: "4th Year B.Tech",
    email: "sameer.saxena@iiit.ac.in",
    whatsapp: "+91 99887 76655",
    linkedinUrl: "https://linkedin.com/in/sameer-saxena-ui",
  },
};

export const SEED_PROJECTS: Project[] = [
  {
    id: "proj-101",
    posterId: "b-409",
    posterNumber: "Builder #409",
    title: "CampusMesh: P2P Offline Exam & Notes Sync",
    oneLinePitch: "Zero-internet local CRDT synchronizer over campus Wi-Fi & Bluetooth mesh for collaborative course builds.",
    techStack: ["Rust", "WASM", "WebRTC", "IndexedDB", "Next.js"],
    diagramMermaid: `graph TD
  StudentA[Peer Node A / Browser] <-->|WebRTC DataChannel| StudentB[Peer Node B / Browser]
  StudentB <-->|Local Mesh| StudentC[Peer Node C / Mobile]
  StudentA -->|State Merging| CRDT[Y.js / Automerge CRDT Engine]
  CRDT --> Storage[(IndexedDB Encrypted Vault)]
  StudentA -.->|Opportunistic WAN sync| Edge[Campus Relay Gateway]`,
    roles: [
      {
        id: "role-101-1",
        title: "Rust / WASM CRDT Engine Lead",
        skills: ["Rust", "WASM", "Automerge", "Distributed State"],
        minStats: "Top 5% Rust or 500+ commits",
        estHours: 16,
        status: "OPEN",
        customQuestion: "How would you guarantee causal consistency and handle split-brain partitions when 20 peers edit the same markdown document simultaneously during a Wi-Fi dropout?",
      },
      {
        id: "role-101-2",
        title: "WebRTC Mesh Networking Specialist",
        skills: ["WebRTC", "SDP Handshake", "STUN/TURN", "TypeScript"],
        minStats: "Top 8% Systems / WebSockets",
        estHours: 14,
        status: "OPEN",
        customQuestion: "How would you design the WebRTC signaling handshake and ICE restart strategy when campus NATs block direct peer-to-peer UDP traffic?",
      },
      {
        id: "role-101-3",
        title: "Local-First UI & Offline Storage Dev",
        skills: ["Next.js", "IndexedDB", "Tailwind CSS"],
        minStats: "Top 12% TypeScript or 1+ hackathon win",
        estHours: 10,
        status: "OPEN",
        customQuestion: "What is your strategy for optimistic local mutations in IndexedDB to achieve sub-16ms UI responsiveness during rapid typing?",
      },
    ],
    totalEstHours: 40,
    risks: [
      "NAT traversal failure across strict university subnet isolation",
      "Memory leak during 1,000+ peer state reconciliation in browser tab",
      "Conflict resolution ordering under high-frequency keypress events",
    ],
    stressTestSummary:
      "Stress-tested with 50 synthetic nodes simulating a lecture hall blackout. Sub-50ms convergent latency achieved via state-based Delta-CRDTs.",
    originality: {
      score: 94,
      originality: 96,
      technicalFeasibility: 91,
      scopeRealism: 93,
      summary: "Exceptional technical depth. Tackles bandwidth saturation during campus exams with proven zero-server local mesh topology.",
      nearDuplicateMatch: null,
    },
    createdAt: "2025-01-18T10:00:00Z",
  },
  {
    id: "proj-102",
    posterId: "b-219",
    posterNumber: "Builder #219",
    title: "AuraVector: Decentralized Research Vector Index",
    oneLinePitch: "Federated embedding index for student preprints with privacy-preserving cosine similarity matching.",
    techStack: ["FastAPI", "Qdrant", "PyTorch", "Next.js", "Docker"],
    diagramMermaid: `graph TD
  Upload[PDF / Paper Ingestion] --> Splitter[Semantic Chunking Engine]
  Splitter --> Embedder[ONNX Runtime / MiniLM]
  Embedder --> VectorDB[(Qdrant Cluster)]
  QueryClient[Anonymous Search UI] --> API[FastAPI Gateway]
  API --> VectorDB
  API --> Reranker[Cross-Encoder Reranker]`,
    roles: [
      {
        id: "role-102-1",
        title: "Vector Search & Retrieval Engineer",
        skills: ["Qdrant", "HNSW Indexing", "FastAPI", "Python"],
        minStats: "Top 6% Python or verified ML repo",
        estHours: 15,
        status: "OPEN",
      },
      {
        id: "role-102-2",
        title: "Quantized Embedding Pipeline Lead",
        skills: ["ONNX", "PyTorch", "Transformers", "CUDA"],
        minStats: "Verified ML Repo or Scholar Profile",
        estHours: 18,
        status: "OPEN",
      },
      {
        id: "role-102-3",
        title: "Hacker Dashboard & Visualizer Dev",
        skills: ["Next.js", "Tailwind CSS", "Framer Motion"],
        minStats: "Top 10% Frontend",
        estHours: 11,
        status: "OPEN",
      },
    ],
    totalEstHours: 44,
    risks: [
      "Vector index RAM blowup when ingesting >100,000 papers on single node",
      "Cold-start latency on CPU-only campus server instances",
    ],
    stressTestSummary:
      "Quantized int8 vectors reduce memory footprint by 75% while maintaining 98.4% retrieval accuracy.",
    originality: {
      score: 89,
      originality: 87,
      technicalFeasibility: 92,
      scopeRealism: 88,
      summary: "High utility for student researchers. Clear architectural division with ready-to-deploy Docker compose stack.",
      nearDuplicateMatch: null,
    },
    createdAt: "2025-01-17T14:30:00Z",
  },
  {
    id: "proj-103",
    posterId: "b-104",
    posterNumber: "Builder #104",
    title: "SubZero: Dorm GPU Cluster Scheduler",
    oneLinePitch: "Slurm alternative pooling idle student RTX 4090s into a distributed batch training cluster.",
    techStack: ["Go", "gRPC", "Docker", "PyTorch", "Prometheus"],
    diagramMermaid: `graph TD
  HostMaster[Master Scheduler / Go] --> Worker1[Dorm Node 1 / RTX 4090]
  HostMaster --> Worker2[Dorm Node 2 / RTX 3080]
  HostMaster --> Worker3[Lab Node 3 / A5000]
  Worker1 <-->|gRPC Heartbeat & Health| HostMaster
  JobsQueue[Redis BullMQ] --> HostMaster
  HostMaster --> Telemetry[Prometheus / Grafana]`,
    roles: [
      {
        id: "role-103-1",
        title: "Distributed Scheduling Architect",
        skills: ["Go", "gRPC", "Concurrency", "Linux Cgroups"],
        minStats: "Top 4% Go or Systems",
        estHours: 18,
        status: "OPEN",
      },
      {
        id: "role-103-2",
        title: "GPU Containerization Engineer",
        skills: ["Docker", "NVIDIA Container Toolkit", "Bash"],
        minStats: "Top 10% DevOps / Linux",
        estHours: 12,
        status: "OPEN",
      },
      {
        id: "role-103-3",
        title: "Cluster Telemetry & Web Dashboard",
        skills: ["Next.js", "Prometheus API", "WebSockets"],
        minStats: "Top 15% Frontend",
        estHours: 10,
        status: "OPEN",
      },
    ],
    totalEstHours: 40,
    risks: [
      "Student nodes dropping offline mid-epoch without checkpointing",
      "Thermal throttling in unventilated dorm room setups",
    ],
    stressTestSummary:
      "Implements proactive 10-minute snapshotting to MinIO S3 object storage; lost nodes automatically requeue jobs.",
    originality: {
      score: 96,
      originality: 98,
      technicalFeasibility: 92,
      scopeRealism: 95,
      summary: "Iconic campus venture concept. Directly unlocks hundreds of teraflops of idle hardware.",
      nearDuplicateMatch: null,
    },
    createdAt: "2025-01-16T18:00:00Z",
  },
  {
    id: "proj-104",
    posterId: "b-633",
    posterNumber: "Builder #633",
    title: "UniPulse: High-Throughput Campus Food Queue Protocol",
    oneLinePitch: "Concurrent ticket reservation engine handling 5,000 orders/sec at campus dining hall rush hours.",
    techStack: ["Go", "Redis Pub/Sub", "Kafka", "PostgreSQL", "React"],
    diagramMermaid: `graph TD
  App[Student Mobile App] --> RateLimiter[Redis Token Bucket]
  RateLimiter --> Queue[Kafka Order Event Stream]
  Queue --> Engine[Go Order Settlement Service]
  Engine --> Lock[(Redis Distributed Redlock)]
  Engine --> DB[(PostgreSQL Ledger)]
  Engine --> MessScreen[Kitchen Display Terminal]`,
    roles: [
      {
        id: "role-104-1",
        title: "High-Concurrency Backend Lead",
        skills: ["Go", "Redis", "Kafka", "PostgreSQL"],
        minStats: "Top 5% Go or 800+ contributions",
        estHours: 16,
        status: "OPEN",
      },
      {
        id: "role-104-2",
        title: "Realtime Ticket UI Engineer",
        skills: ["React", "WebSockets", "Tailwind CSS"],
        minStats: "Top 12% React",
        estHours: 12,
        status: "OPEN",
      },
      {
        id: "role-104-3",
        title: "Load Testing & Reliability SRE",
        skills: ["k6", "Grafana", "Chaos Engineering"],
        minStats: "Top 15% DevOps",
        estHours: 8,
        status: "OPEN",
      },
    ],
    totalEstHours: 36,
    risks: ["Race condition double-booking hot food inventory on duplicate clicks"],
    stressTestSummary:
      "Demonstrated with k6 bench at 8,200 RPS: zero oversells under Redis atomics and strict transaction isolation.",
    originality: {
      score: 83,
      originality: 78,
      technicalFeasibility: 95,
      scopeRealism: 92,
      summary: "Everyday campus problem tackled with serious banking-grade distributed systems rigor.",
      nearDuplicateMatch: null,
    },
    createdAt: "2025-01-15T12:00:00Z",
  },
  {
    id: "proj-105",
    posterId: "b-721",
    posterNumber: "Builder #721",
    title: "ProofOfHustle: Zero-Knowledge Student Credential Escrow",
    oneLinePitch: "Prove you are in the top 5% of your class or an ICPC finalist without revealing your name, GPA, or college roll number.",
    techStack: ["Circom", "SnarkJS", "Solidity", "Node.js", "Next.js"],
    diagramMermaid: `graph TD
  UniversityTranscript[Signed Digitized Transcript] --> Prover[Browser Circom ZK-Prover]
  Prover --> Proof[zk-SNARK Groth16 Proof]
  Proof --> VerifierContract[Onchain / Serverless Verifier]
  VerifierContract --> ValidBadge[Verified Anonymous Credential]`,
    roles: [
      {
        id: "role-105-1",
        title: "Zero-Knowledge Circuit Engineer",
        skills: ["Circom", "Groth16", "Cryptography", "SnarkJS"],
        minStats: "Top 2% Cryptography / Math",
        estHours: 20,
        status: "OPEN",
      },
      {
        id: "role-105-2",
        title: "Smart Contract & Security Lead",
        skills: ["Solidity", "Hardhat", "EVM Security"],
        minStats: "Top 5% Solidity or hackathon winner",
        estHours: 14,
        status: "OPEN",
      },
      {
        id: "role-105-3",
        title: "ZK Client & UI Integrator",
        skills: ["Next.js", "WebAssembly", "Wagmi"],
        minStats: "Top 10% Web3 Frontend",
        estHours: 12,
        status: "OPEN",
      },
    ],
    totalEstHours: 46,
    risks: ["High client-side proof generation time in low-spec mobile browsers"],
    stressTestSummary: "Optimized Circom constraints down to 8,400 gates; browser proof generates in 1.4 seconds.",
    originality: {
      score: 97,
      originality: 98,
      technicalFeasibility: 94,
      scopeRealism: 96,
      summary: "Groundbreaking application of cryptographic zero-knowledge primitives directly aligned with BlindBuild.",
      nearDuplicateMatch: null,
    },
    createdAt: "2025-01-14T15:00:00Z",
  },
];

export const SEED_AUDITIONS: Audition[] = [
  {
    id: "aud-001",
    projectId: "proj-101",
    projectTitle: "CampusMesh: P2P Offline Exam & Notes Sync",
    roleId: "role-101-1",
    roleTitle: "Rust / WASM CRDT Engine Lead",
    applicantId: "b-219",
    applicantNumber: "Builder #219",
    applicantStats: SEED_BUILDERS[1].stats,
    auditionType: "QUESTION",
    questionText:
      "How would you guarantee causal consistency and handle split-brain partitions when 20 peers edit the same markdown document simultaneously during a Wi-Fi dropout?",
    applicantAnswer:
      "I would utilize state-based Delta-State CRDTs with Lamport timestamps and a vector clock per peer. During network partition, each peer writes mutations to local IndexedDB with monotonic sequence numbers. Upon reconnection, peers exchange compact vector clock states; only the missing deltas are transmitted over WebRTC DataChannels and merged deterministically using Automerge's B-tree diff algorithm without central arbitration.",
    score: 94,
    feedback:
      "Flawless understanding of distributed state reconciliation, Delta-CRDT vector clocks, and memory-conscious B-tree diffing.",
    passed: true,
    posterApproved: true,
    applicantApproved: false, // Ready for the applicant to click approve in demo!
    status: "POSTER_APPROVED",
    createdAt: "2025-01-18T14:00:00Z",
  },
];

export const SEED_GUARDRAIL_LOGS: GuardrailLogEntry[] = [
  {
    id: "log-1",
    timestamp: "2025-01-18T10:01:12Z",
    actionType: "IDEA_ORIGINALITY",
    builderNumber: "Builder #409",
    inputSnippet: "CampusMesh: P2P Offline Exam & Notes Sync over WebRTC mesh...",
    verdict: "PASS",
    reason: "Original concept. High technical depth (94/100). No collision with existing campus ventures.",
    score: 94,
  },
  {
    id: "log-2",
    timestamp: "2025-01-18T12:30:45Z",
    actionType: "MESSAGE_CONTACT_LEAK",
    builderNumber: "Builder #512",
    inputSnippet: "Hey check out my portfolio at linkedin.com/in/sam-dev or ping me at 9812345678",
    verdict: "BLOCKED",
    reason: "Blocked by Guardrail: contact info is locked until mutual match. Personal identifiers are strictly concealed.",
    blockedDetails: ["Phone number (9812345678)", "LinkedIn URL"],
  },
  {
    id: "log-3",
    timestamp: "2025-01-18T13:45:00Z",
    actionType: "AUDITION_SUBMISSION",
    builderNumber: "Builder #219",
    inputSnippet: "I would utilize state-based Delta-State CRDTs with Lamport timestamps...",
    verdict: "PASS",
    reason: "Score 94/100. High-signal architectural tradeoffs validated.",
    score: 94,
  },
];
