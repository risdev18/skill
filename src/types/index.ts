export type SkillProficiency = 1 | 2 | 3;

export const PROFICIENCY_LABELS: Record<SkillProficiency, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

export type UserRole = "student" | "project_owner" | "recruiter";

export interface StudentSkill {
  id: string;
  skillName: string;
  proficiency: SkillProficiency;
  category?: string;
}

export interface RequiredSkill {
  id: string;
  skillName: string;
  weight: number; // e.g. 20, 30, 50 (will be normalized)
  minimumProficiency: SkillProficiency;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  college: string;
  department: string;
  academicYear: "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "Graduate";
  bio: string;
  skills: StudentSkill[];
  interests: string[];
  preferredCategories: string[];
  availability: "15+ hrs/week" | "10-15 hrs/week" | "5-10 hrs/week" | "< 5 hrs/week" | "Unavailable";
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  visibility: "public" | "campus-only" | "private";
  activeProjectsCount: number;
  shortlisted?: boolean;
  // Role & Campus Affiliation
  userRole?: UserRole;
  organization?: string;
  roleTitle?: string;
}

export type ProjectCategory =
  | "Web Development"
  | "AI and Machine Learning"
  | "Data Science"
  | "Cybersecurity"
  | "Mobile Development"
  | "IoT"
  | "Open Source"
  | "Research"
  | "Other";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  ownerId: string;
  ownerName: string;
  ownerCollege: string;
  requiredSkills: RequiredSkill[];
  maxTeamSize: number;
  currentTeamSize: number;
  openPositions?: number;
  duration: string;
  experiencePreference: "All Levels" | "Intermediate+" | "Advanced Only";
  deadline: string;
  status: "Open" | "In Progress" | "Completed";
  createdAt: string;
}

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected" | "Withdrawn";

export interface ProjectApplication {
  id: string;
  projectId: string;
  studentId: string;
  student: StudentProfile;
  appliedAt: string;
  status: ApplicationStatus;
  pitch: string;
  matchScore?: number;
}

export interface TeamMember {
  studentId: string;
  role: string;
  joinedAt: string;
  student: StudentProfile;
}

export interface Team {
  id: string;
  projectId: string;
  projectTitle: string;
  category: ProjectCategory;
  ownerId: string;
  members: TeamMember[];
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate: string;
  createdAt: string;
}

export interface MatchBreakdown {
  studentId: string;
  studentName: string;
  overallScore: number;
  baseSkillScore: number;
  bonusScore: number;
  normalizedWeightsTotal: number;
  matchedSkills: {
    skillName: string;
    studentProficiency: SkillProficiency;
    requiredProficiency: SkillProficiency;
    contribution: number;
    weight: number;
    isFullyProficient: boolean;
  }[];
  underProficientSkills: {
    skillName: string;
    studentProficiency: SkillProficiency;
    requiredProficiency: SkillProficiency;
    gap: number;
  }[];
  missingSkills: {
    skillName: string;
    weight: number;
    requiredProficiency: SkillProficiency;
  }[];
  reasons: string[];
  suggestions: string[];
  explanation: string;
  availability: string;
  categoryMatch: boolean;
}

export interface TeamSkillGapReport {
  projectId: string;
  projectTitle: string;
  totalRequiredSkills: number;
  coveredCount: number;
  partiallyCoveredCount: number;
  missingCount: number;
  coveragePercentage: number;
  skillsAnalysis: {
    skillName: string;
    weight: number;
    requiredProficiency: SkillProficiency;
    teamEffectiveProficiency: SkillProficiency | 0;
    status: "covered" | "partially_covered" | "missing";
    membersWithSkill: {
      studentId: string;
      studentName: string;
      proficiency: SkillProficiency;
    }[];
  }[];
  recommendations: string[];
}
