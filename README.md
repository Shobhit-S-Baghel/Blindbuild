# BlindBuild ⚡
> **Double-Blind, Skill-Verified Venture Incubator for College Campuses**  
> *"Ideas and code speak first. Identities unlock only after mutual technical validation."*

BlindBuild eliminates campus networking bias—batch year, social clout, pedigree, and LinkedIn presence—by hiding names, photos, and years. Instead, it surfaces verified GitHub commits, algorithmic ratings, and AI-scoped architecture blueprints.

---

## 🚀 Quick Start Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env.local`:
```env
# Optional: Google Gemini API Key from https://aistudio.google.com/
# (If omitted, BlindBuild uses built-in high-fidelity typed mock fallbacks so the app never crashes)
GEMINI_API_KEY=your_gemini_api_key_here

# Cryptographic HMAC Salt
BLINDBUILD_HMAC_SECRET=blindbuild_campus_venture_incubator_2025_secret_salt_99
```

### 3. Start the Next.js Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⏱️ 2-Minute Judge Demo Script

| Step | Time | What to Click / Demonstrate | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **1. Landing & Problem** | 0:00 - 0:20 | Open `http://localhost:3000`. Scroll to the **"Campus Network Problem vs. BlindBuild Fix"** comparison card. | Highlights why 1st-year prodigies get rejected on campus ("Rahul, 1st Year") vs. accepted on BlindBuild ("Builder #409 \| Top 4% Python/FastAPI"). |
| **2. Cryptographic Stats Card** | 0:20 - 0:40 | Go to **"Get Verified"** (`/onboarding`). Click Demo Fast-Fill: *"1st-Year Systems Prodigy"*. Click **"Verify Code & Generate"**. Click **"Cryptographically Verified"** badge. | Shows live GitHub public fetch, percentile rank, and opens the **HMAC-SHA256 signature verification modal**. Click *"Simulate Tamper"* to prove tampering fails! |
| **3. Direct Idea & Custom Questions** | 0:40 - 1:05 | Click **"Post an Idea"** (`/post-idea`). Fill your project title & pitch, type custom audition questions for roles (or click *"AI Suggest Question"* to adopt one), or click *"AI Suggest Architecture & Roles"*. Click **"Publish Project to Feed"**. | Directly publishes your venture idea with live Mermaid diagram and custom questions without tedious multi-question chat hurdles. |
| **4. Autonomous Guardrail Shield** | 1:05 - 1:25 | In the bottom-left **Demo Controller**, click **"Test Contact Leak"** and **"Test Duplicate Copy"**. Open **"Guardrail Log"** in the top navbar. | Dual-tier guardrail (Regex + LLM) immediately blocks leaked WhatsApp phone numbers and email addresses with a friendly toast, and flags near-duplicate clones. Shows real-time log drawer. |
| **5. Micro-Audition & Double-Opt-In Reveal** | 1:25 - 2:00 | Go to **"My Dashboard"** (`/dashboard`). Under *My Applications*, see pre-seeded Audition `aud-001`. Click **"Approve as Applicant"**. | Confetti explosion! Anonymous masks dissolve, unlocking real identities (Rahul Sharma & Priya Nair), verified WhatsApp direct links, and auto-generated GitHub repo + Discord pod invite links! |

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom Hacker Dark Theme (`#08090d`, `#00f2fe` electric cyan, `#8b5cf6` electric violet)
- **Visuals**: Deterministic Geometric Identicons (SVG), Framer Motion, Canvas Confetti
- **Diagrams**: Mermaid.js live client-side AST rendering with zoom/pan
- **AI Engine**: Google Gemini API (`@google/generative-ai`), model `gemini-1.5-flash` with structured JSON output and typed fallbacks
- **Cryptographic Security**: HMAC-SHA256 signature generation & tamper validation over canonical stats payloads
- **Persistence**: Server-side JSON/SQLite database repository (`lib/db.ts`) with strict separation of anonymous public data vs. isolated private identity vault

---

## 📋 What is Real vs. What is Mocked

| Feature | Real Implementation | Mocked / Simulated | Notes |
| :--- | :--- | :--- | :--- |
| **GitHub Verification** | ✅ **REAL**: Calls public `api.github.com/users/{user}` and `/repos` for public repos, languages, and followers. | Automatic deterministic fallback if unauthenticated rate limit is reached. | Real public GitHub API endpoint with live calculations. |
| **Cryptographic Proofs** | ✅ **REAL**: Node.js `crypto.createHmac("sha256")` computes exact cryptographic hash over canonical payload strings. | None | Interactive modal recomputes hash and proves tamper-evidence bit-for-bit. |
| **AI Venture Scoper** | ✅ **REAL**: Uses Google Gemini API (`@google/generative-ai`) to ask 4-5 follow-up questions and generate structured blueprints. | High-fidelity typed fallback if `GEMINI_API_KEY` is omitted so the app never crashes. | Robust JSON schema outputs. |
| **Mermaid Diagram Engine** | ✅ **REAL**: Live in-browser `mermaid.render()` compiling Mermaid AST into responsive SVG charts. | None | Dynamic theme matching dark hacker theme. |
| **Autonomous Guardrail** | ✅ **REAL**: Dual-pass pipeline: Regex pre-filter (phone numbers, emails, handles) + LLM semantic leak & originality checker. | None | Recorded into live inspectable Guardrail Log. |
| **LeetCode Service** | Clean service interface (`lib/services/leetcode.ts`). | 🟡 **MOCKED**: Deterministic solved count and Knight/Guardian ratings. | Ready to be connected to official GraphQL endpoint. |
| **Google Scholar Service** | Clean service interface (`lib/services/scholar.ts`). | 🟡 **MOCKED**: Deterministic citation counts, h-index, and verified paper chip. | Ready for SerpAPI / Google Scholar parser. |
| **Project Workspace Pod** | Simulates provisioned GitHub Org repo & Discord channel invite links. | 🟡 **SIMULATED**: Generates realistic project URL links upon mutual approval. | Ready to plug in GitHub App & Discord Bot Webhooks. |
| **Identity Gating Security** | ✅ **REAL**: Strict server-side enforcement. Private identities live in a segregated table and API strictly refuses to return them until mutual approval exists. | None | Impossible to access identities client-side before mutual approval. |
