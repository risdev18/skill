"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  StudentProfile,
  Project,
  Team,
  ProjectTask,
  ProjectApplication,
  ApplicationStatus,
} from "@/types";
import { StorageService } from "@/lib/storage";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
}

interface AppContextType {
  isDemoMode: boolean;
  currentStudent: StudentProfile;
  students: StudentProfile[];
  projects: Project[];
  teams: Team[];
  tasks: ProjectTask[];
  applications: ProjectApplication[];
  toasts: ToastMessage[];
  switchPersona: (studentId: string) => void;
  updateProfile: (updated: StudentProfile) => void;
  toggleShortlist: (studentId: string) => void;
  createProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  applyToProject: (projectId: string, pitch: string, matchScore?: number) => boolean;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  createTask: (task: ProjectTask) => void;
  updateTask: (taskId: string, partial: Partial<ProjectTask>) => void;
  deleteTask: (taskId: string) => void;
  resetAllData: () => void;
  showToast: (title: string, description?: string, variant?: ToastMessage["variant"]) => void;
  removeToast: (id: string) => void;
  refreshState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => StorageService.getCurrentStudent());
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, description?: string, variant: ToastMessage["variant"] = "default") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshState = useCallback(() => {
    setIsDemoMode(StorageService.isDemoMode());
    setCurrentStudent(StorageService.getCurrentStudent());
    setStudents(StorageService.getStudents());
    setProjects(StorageService.getProjects());
    setTeams(StorageService.getTeams());
    setTasks(StorageService.getTasks());
    setApplications(StorageService.getApplications());
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshState();
  }, [refreshState]);

  const switchPersona = (studentId: string) => {
    StorageService.setCurrentUserId(studentId);
    refreshState();
    const newPersona = StorageService.getStudentById(studentId);
    showToast(
      "Persona Switched",
      `Now browsing as ${newPersona?.fullName || "student"} (${newPersona?.department})`,
      "info"
    );
  };

  const updateProfile = (updated: StudentProfile) => {
    StorageService.updateStudent(updated);
    refreshState();
    showToast("Profile Updated", "Your technical profile has been saved.", "success");
  };

  const toggleShortlist = (studentId: string) => {
    const isShortlisted = StorageService.toggleShortlist(studentId);
    refreshState();
    const target = students.find((s) => s.id === studentId);
    showToast(
      isShortlisted ? "Added to Shortlist" : "Removed from Shortlist",
      `${target?.fullName || "Candidate"} ${isShortlisted ? "saved to your recruiting queue" : "removed"}`,
      "default"
    );
  };

  const createProject = (project: Project) => {
    StorageService.createProject(project);
    refreshState();
    showToast("Project Published", `"${project.title}" is now open for applicants.`, "success");
  };

  const updateProject = (project: Project) => {
    StorageService.updateProject(project);
    refreshState();
    showToast("Project Updated", "Project details saved successfully.", "success");
  };

  const applyToProject = (projectId: string, pitch: string, matchScore?: number): boolean => {
    const res = StorageService.createApplication(projectId, pitch, matchScore);
    if (res.success) {
      refreshState();
      showToast("Application Sent", res.message, "success");
      return true;
    } else {
      showToast("Application Failed", res.message, "error");
      return false;
    }
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    const res = StorageService.updateApplicationStatus(appId, status);
    refreshState();
    showToast(
      `Application ${status}`,
      res.message,
      res.success ? "success" : "error"
    );
  };

  const createTask = (task: ProjectTask) => {
    StorageService.createTask(task);
    refreshState();
    showToast("Task Created", `"${task.title}" added to project board.`, "success");
  };

  const updateTask = (taskId: string, partial: Partial<ProjectTask>) => {
    StorageService.updateTask(taskId, partial);
    refreshState();
  };

  const deleteTask = (taskId: string) => {
    StorageService.deleteTask(taskId);
    refreshState();
    showToast("Task Deleted", "The task was removed from the board.", "default");
  };

  const resetAllData = () => {
    StorageService.resetToDefaults();
    refreshState();
    showToast("Data Reset", "Sample students, projects, and tasks restored to default seed.", "info");
  };

  // Safe SSR initial render
  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        currentStudent,
        students,
        projects,
        teams,
        tasks,
        applications,
        toasts,
        switchPersona,
        updateProfile,
        toggleShortlist,
        createProject,
        updateProject,
        applyToProject,
        updateApplicationStatus,
        createTask,
        updateTask,
        deleteTask,
        resetAllData,
        showToast,
        removeToast,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
