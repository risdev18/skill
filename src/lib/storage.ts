import {
  StudentProfile,
  Project,
  Team,
  ProjectTask,
  ProjectApplication,
  ApplicationStatus,
} from "@/types";
import {
  INITIAL_STUDENTS,
  INITIAL_PROJECTS,
  INITIAL_TEAMS,
  INITIAL_TASKS,
  INITIAL_APPLICATIONS,
} from "./mock-data";
import { isSupabaseConfigured } from "./supabase";

const STORAGE_KEYS = {
  STUDENTS: "skillsync_students_v3",
  PROJECTS: "skillsync_projects_v3",
  TEAMS: "skillsync_teams_v3",
  TASKS: "skillsync_tasks_v3",
  APPLICATIONS: "skillsync_applications_v3",
  CURRENT_USER_ID: "skillsync_current_user_id_v3",
};

function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  isDemoMode(): boolean {
    return !isSupabaseConfigured();
  },

  isInitialized(): boolean {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem(STORAGE_KEYS.STUDENTS);
  },

  loadSampleData(): void {
    this.resetToDefaults();
  },

  resetToDefaults(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_TEAMS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, JSON.stringify("student-alex"));
  },

  // Active Persona
  getCurrentUserId(): string {
    return getLocalItem<string>(STORAGE_KEYS.CURRENT_USER_ID, "student-alex");
  },

  setCurrentUserId(studentId: string): void {
    setLocalItem(STORAGE_KEYS.CURRENT_USER_ID, studentId);
  },

  getCurrentStudent(): StudentProfile {
    const currentId = this.getCurrentUserId();
    const students = this.getStudents();
    return students.find((s) => s.id === currentId) || students[0];
  },

  // Students & Recruiters
  getStudents(): StudentProfile[] {
    return getLocalItem<StudentProfile[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },

  getStudentById(id: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.id === id);
  },

  updateStudent(student: StudentProfile): void {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      students[index] = student;
      setLocalItem(STORAGE_KEYS.STUDENTS, students);
    }
  },

  toggleShortlist(studentId: string): boolean {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (student) {
      student.shortlisted = !student.shortlisted;
      setLocalItem(STORAGE_KEYS.STUDENTS, students);
      return student.shortlisted;
    }
    return false;
  },

  // Projects
  getProjects(): Project[] {
    const projs = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return projs.map((p) => ({
      ...p,
      openPositions: typeof p.openPositions === "number" ? p.openPositions : Math.max(0, p.maxTeamSize - p.currentTeamSize),
    }));
  },

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  },

  createProject(newProject: Project): void {
    const projects = this.getProjects();
    const projWithOpen = {
      ...newProject,
      openPositions: Math.max(0, newProject.maxTeamSize - newProject.currentTeamSize),
    };
    projects.unshift(projWithOpen);
    setLocalItem(STORAGE_KEYS.PROJECTS, projects);

    // Automatically create a corresponding team record
    const teams = this.getTeams();
    const currentUser = this.getCurrentStudent();
    teams.push({
      id: `team-${newProject.id}`,
      projectId: newProject.id,
      projectTitle: newProject.title,
      category: newProject.category,
      ownerId: newProject.ownerId,
      members: [
        {
          studentId: currentUser.id,
          role: currentUser.userRole === "project_owner" || currentUser.userRole === "recruiter" ? "Project Lead & Mentor" : "Project Creator",
          joinedAt: new Date().toISOString(),
          student: currentUser,
        },
      ],
    });
    setLocalItem(STORAGE_KEYS.TEAMS, teams);
  },

  updateProject(project: Project): void {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = {
        ...project,
        openPositions: Math.max(0, project.maxTeamSize - project.currentTeamSize),
      };
      setLocalItem(STORAGE_KEYS.PROJECTS, projects);
    }
  },

  // Applications
  getApplications(projectId?: string): ProjectApplication[] {
    const apps = getLocalItem<ProjectApplication[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    if (projectId) {
      return apps.filter((a) => a.projectId === projectId);
    }
    return apps;
  },

  hasUserApplied(projectId: string, studentId: string): boolean {
    const apps = this.getApplications(projectId);
    return apps.some((a) => a.studentId === studentId && (a.status === "Pending" || a.status === "Accepted"));
  },

  createApplication(projectId: string, pitch: string, matchScore?: number): { success: boolean; message: string } {
    const project = this.getProjectById(projectId);
    const currentUser = this.getCurrentStudent();

    if (!project) return { success: false, message: "Project not found." };
    if (project.ownerId === currentUser.id) {
      return { success: false, message: "You are the creator of this project. You cannot apply to your own project." };
    }
    if (project.currentTeamSize >= project.maxTeamSize) {
      return { success: false, message: "This team has already reached its maximum capacity." };
    }
    if (this.hasUserApplied(projectId, currentUser.id)) {
      return { success: false, message: "You have already applied to this project." };
    }

    const apps = this.getApplications();
    const newApp: ProjectApplication = {
      id: `app-${Date.now()}`,
      projectId,
      studentId: currentUser.id,
      student: currentUser,
      appliedAt: new Date().toISOString(),
      status: "Pending",
      pitch: pitch.trim(),
      matchScore: matchScore || 70,
    };

    apps.unshift(newApp);
    setLocalItem(STORAGE_KEYS.APPLICATIONS, apps);
    return { success: true, message: "Application submitted successfully!" };
  },

  withdrawApplication(appId: string): void {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === appId);
    if (app) {
      app.status = "Withdrawn";
      setLocalItem(STORAGE_KEYS.APPLICATIONS, apps);
    }
  },

  updateApplicationStatus(appId: string, status: ApplicationStatus): { success: boolean; message: string } {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === appId);
    if (!app) return { success: false, message: "Application not found." };

    const project = this.getProjectById(app.projectId);
    if (!project) return { success: false, message: "Project not found." };

    if (status === "Accepted") {
      if (project.currentTeamSize >= project.maxTeamSize) {
        return { success: false, message: "Cannot accept: Team is already at maximum capacity." };
      }
      // Increment project current team size and adjust open positions
      project.currentTeamSize += 1;
      project.openPositions = Math.max(0, project.maxTeamSize - project.currentTeamSize);
      this.updateProject(project);

      // Add to team members
      const teams = this.getTeams();
      const team = teams.find((t) => t.projectId === project.id);
      if (team) {
        const student = this.getStudentById(app.studentId) || app.student;
        if (!team.members.some((m) => m.studentId === app.studentId)) {
          team.members.push({
            studentId: app.studentId,
            role: "Team Contributor",
            joinedAt: new Date().toISOString(),
            student,
          });
          setLocalItem(STORAGE_KEYS.TEAMS, teams);
        }
      }
    }

    app.status = status;
    setLocalItem(STORAGE_KEYS.APPLICATIONS, apps);
    return { success: true, message: `Application ${status.toLowerCase()} successfully.` };
  },

  // Teams
  getTeams(): Team[] {
    return getLocalItem<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  },

  getTeamByProjectId(projectId: string): Team | undefined {
    return this.getTeams().find((t) => t.projectId === projectId);
  },

  // Tasks
  getTasks(projectId?: string): ProjectTask[] {
    const tasks = getLocalItem<ProjectTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    if (projectId) {
      return tasks.filter((t) => t.projectId === projectId);
    }
    return tasks;
  },

  createTask(newTask: ProjectTask): void {
    const tasks = this.getTasks();
    tasks.unshift(newTask);
    setLocalItem(STORAGE_KEYS.TASKS, tasks);
  },

  updateTask(taskId: string, partial: Partial<ProjectTask>): void {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx >= 0) {
      tasks[idx] = { ...tasks[idx], ...partial };
      setLocalItem(STORAGE_KEYS.TASKS, tasks);
    }
  },

  deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    setLocalItem(STORAGE_KEYS.TASKS, filtered);
  },
};
