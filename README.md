# SkillSync

> **Find Your People. Build Something Extraordinary.**

SkillSync is a student skill discovery, project collaboration, and intelligent team formation web platform built for engineering capstones, research lab initiatives, and hackathon teams.

---

## 🚀 Key Highlights & Architectural Differentiators

1. **Deterministic Skill Matching Engine**:
   - Computes transparent compatibility scores between candidate student profiles and project-defined skill requirements.
   - Normalizes importance weights to 100%.
   - Mathematical formula: `proficiencyRatio = min(studentProficiency / minimumRequiredProficiency, 1.0)`, `skillContribution = normalizedWeight * proficiencyRatio`, `baseSkillScore = sum(all skillContributions)`.
   - Incorporates transparent, bounded bonus adjustments for weekly availability, domain category interest, and academic experience.
   - Dynamically synthesizes human-readable justifications explaining exact reasons for the match.
   - Zero black-box mystery or ungrounded claims.

2. **Team Skill Gap Analyzer**:
   - Diagnoses current team roster capabilities against project requirements.
   - Evaluates effective team proficiency using the highest declared proficiency among members for each required skill.
   - Categorizes competencies into **Fully Covered**, **Partially Covered (Under-proficient)**, and **Completely Missing**.
   - Generates tailored recruitment recommendations directly linked to candidate search.

3. **Hybrid Persistence Architecture**:
   - **Local Storage Demo Mode**: Runs immediately out-of-the-box with zero database configuration required. Preloaded with 8 realistic engineering student personas, 6 capstone projects, active teams, and sprint tasks.
   - **Supabase Integration Ready**: Includes production-grade PostgreSQL schema (`supabase-schema.sql`) with Row-Level Security (RLS) policies.
   - **Transparent Status Indicator**: Clearly communicates whether the application is running in local Demo Storage or connected to remote Supabase.

4. **Kanban Sprint Task Board**:
   - Sprint task management across 4 stages: *To Do*, *In Progress*, *Code Review*, and *Completed*.
   - Filterable by project and assignee with priority badges and due date tracking.

5. **Platform Analytics & Telemetry**:
   - Interactive charts built with **Recharts**:
     - Technical Skill Supply vs. Demand
     - Project Categories Breakdown
     - Academic Standing Distribution
     - Team Skill Coverage Health Tiers

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom SaaS dark theme (charcoal, slate, electric violet, and blue accents)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State & Persistence**: React Context + LocalStorage Demo Provider + Supabase JS Client
- **Testing**: Vitest with unit test suite covering the Skill Matching Engine

---

## 📦 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests

```bash
npm test
```

Executes the Vitest test suite testing:
- Perfect skill match
- Partial skill match with proficiency gap
- No matching skills
- Case-insensitivity and whitespace normalization
- Weight validation and normalization
- Missing optional fields handling

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx               # Marketing Landing Page
│   │   ├── dashboard/page.tsx     # Student Dashboard Overview
│   │   ├── discover/page.tsx      # Student Talent Directory
│   │   ├── students/[id]/page.tsx # Student Public Profile & Match Tester
│   │   ├── projects/page.tsx      # Project Marketplace
│   │   ├── projects/new/page.tsx  # Project Creation Form
│   │   ├── projects/[id]/page.tsx # Project Details & Applicant Review
│   │   ├── matching/page.tsx      # Core Skill Matching Engine & Sandbox
│   │   ├── teams/page.tsx         # Teams Overview
│   │   ├── teams/[id]/page.tsx    # Team Skill Gap Analyzer
│   │   ├── tasks/page.tsx         # Project Kanban Task Board
│   │   ├── analytics/page.tsx     # Recharts Telemetry Dashboard
│   │   ├── settings/page.tsx      # Settings & Storage Mode
│   │   ├── login/page.tsx         # Login with Persona Quick-Entry
│   │   ├── register/page.tsx      # Profile Registration Form
│   │   └── api/                   # Next.js Route Handlers
│   ├── components/                # UI Components (Sidebar, Topnav, Modals, Badges)
│   ├── context/AppContext.tsx     # Application State & Storage Sync
│   ├── lib/
│   │   ├── matching.ts            # Deterministic Matching Engine
│   │   ├── matching.test.ts       # Matching Engine Unit Tests
│   │   ├── gap-analyzer.ts        # Team Skill Gap Analyzer
│   │   ├── storage.ts             # Demo Storage Service
│   │   ├── mock-data.ts           # Realistic Engineering Seed Data
│   │   └── supabase.ts            # Supabase Client & Status Check
│   └── types/index.ts             # Domain Interfaces and Types
├── supabase-schema.sql            # PostgreSQL RLS Database Schema
└── package.json
```

---

## 🧪 Testing the Application

1. **Persona Switching**: Click on the active profile pill in the top-right header or bottom of the sidebar to switch between pre-loaded engineering personas (e.g., *Alex Chen* - Full Stack, *Priya Sharma* - AI/ML Specialist, *Marcus Rodriguez* - Robotics & IoT, *Sarah Jenkins* - Cybersecurity).
2. **Matching Engine**: Go to `/matching` and click **"Inspect Math"** on any candidate to inspect the step-by-step mathematical breakdown.
3. **Custom Sandbox**: Toggle **"Custom Skill Sandbox"** in `/matching` to define arbitrary tech stacks and test roster compatibility in real-time.
4. **Team Gap Analysis**: Go to `/teams` and click **"Inspect Gaps"** on *MediScan AI* or *AeroNav* to examine the capability matrix and synthesized recruitment alerts.
