"use client";

import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  CheckSquare,
  Plus,
  Clock,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  Filter,
  CheckCircle2,
  MoreVertical,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ProjectTask, TaskPriority, TaskStatus } from "@/types";

export default function TasksPage() {
  const { tasks, projects, currentStudent, createTask, updateTask, deleteTask } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("All");
  const [filterAssignee, setFilterAssignee] = useState<string>("All");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newProjId, setNewProjId] = useState(projects[0]?.id || "");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newAssigneeId, setNewAssigneeId] = useState(currentStudent.id);
  const [newDueDate, setNewDueDate] = useState("2026-11-15");
  const [error, setError] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedProjectId !== "All" && t.projectId !== selectedProjectId) {
        return false;
      }
      if (filterAssignee === "me" && t.assigneeId !== currentStudent.id) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedProjectId, filterAssignee, currentStudent.id]);

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: "todo", title: "To Do", color: "text-slate-400 border-slate-700" },
    { status: "in_progress", title: "In Progress", color: "text-indigo-400 border-indigo-500/30" },
    { status: "review", title: "Code Review", color: "text-amber-400 border-amber-500/30" },
    { status: "done", title: "Completed", color: "text-emerald-400 border-emerald-500/30" },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    const targetProject = projects.find((p) => p.id === newProjId) || projects[0];

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      projectId: targetProject.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: "todo",
      priority: newPriority,
      assigneeId: newAssigneeId,
      assigneeName: newAssigneeId === currentStudent.id ? currentStudent.fullName : "Teammate",
      dueDate: newDueDate,
      createdAt: new Date().toISOString(),
    };

    createTask(newTask);
    setNewTitle("");
    setNewDesc("");
    setIsNewTaskModalOpen(false);
    setError(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case "high":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">High</span>;
      case "medium":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Medium</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Project Deliverables & Kanban</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Task Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Organize sprint milestones, assign team responsibilities, and monitor completion progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">Filter by Project:</span>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterAssignee(filterAssignee === "me" ? "All" : "me")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterAssignee === "me"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900"
              }`}
            >
              Assigned to Me Only
            </button>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filteredTasks.length}</strong> tasks
          </span>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="rounded-2xl bg-slate-100/70 border border-slate-200/80 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    col.status === "todo" ? "text-slate-700" :
                    col.status === "in_progress" ? "text-indigo-700" :
                    col.status === "review" ? "text-amber-800" : "text-emerald-700"
                  }`}>
                    {col.title}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 mt-4 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      No tasks in {col.title.toLowerCase()}
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const proj = projects.find((p) => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400/60 transition-all space-y-3 group shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider truncate max-w-[120px]">
                              {proj?.title || "Project Task"}
                            </span>
                            {getPriorityBadge(task.priority)}
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate font-medium text-slate-700">
                              {task.assigneeName || "Unassigned"}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-slate-500 shrink-0">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Quick Status Shift Controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTask(task.id, { status: e.target.value as TaskStatus })
                              }
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-700 focus:outline-none font-medium"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="done">Completed</option>
                            </select>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-200">
              Create Sprint Task
            </h3>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project *
                </label>
                <select
                  value={newProjId}
                  onChange={(e) => setNewProjId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket listener for telemetry feed"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Task specifications and acceptance criteria..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
