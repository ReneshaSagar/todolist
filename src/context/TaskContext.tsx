"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";

export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Mood = "Lazy" | "Neutral" | "Energetic";
export type ItemType = "task" | "reminder" | "event";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  type: ItemType;
  tags: string[];
  dueDate?: Date;
  scheduledAt?: Date; /* Used for reminders and calendar events */
  completed: boolean;
  notified?: boolean; /* Track if notification was already triggered */
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

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || undefined,
          scheduledAt: data.scheduledAt?.toDate() || undefined
        } as Task;
      });
      
      // Sort tasks locally to completely avoid Firebase Index requirements
      fetchedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task: Partial<Task>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title: task.title || "New Task",
        description: task.description || "",
        priority: task.priority || "Medium",
        type: task.type || "task",
        xp: task.xp || 20,
        completed: false,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        scheduledAt: task.scheduledAt || null,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Ensure we don't try to save undefined to Firestore
      const cleanUpdates: any = { ...updates };
      Object.keys(cleanUpdates).forEach(key => cleanUpdates[key] === undefined && delete cleanUpdates[key]);
      
      await updateDoc(doc(db, "tasks", id), cleanUpdates);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
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
