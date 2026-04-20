"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Mood = "Lazy" | "Neutral" | "Energetic";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  completed: boolean;
  xp: number;
  subtasks: { id: string; title: string; completed: boolean }[];
  createdAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  mood: Mood;
  setMood: (mood: Mood) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mood, setMood] = useState<Mood>("Neutral");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTasks(data.map(t => ({ 
            ...t, 
            createdAt: new Date(t.createdAt),
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined
          })));
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async (task: Partial<Task>) => {
    if (!user) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
      });
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (mood === "Lazy") {
      const priorityOrder = { Low: 0, Medium: 1, High: 2, Urgent: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (mood === "Energetic") {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <TaskContext.Provider value={{ tasks: sortedTasks, addTask, updateTask, deleteTask, mood, setMood, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
