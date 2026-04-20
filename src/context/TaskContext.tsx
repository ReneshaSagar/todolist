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

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || undefined
        } as Task;
      });
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
        ...task,
        userId: user.uid,
        title: task.title || "New Task",
        priority: task.priority || "Medium",
        xp: task.xp || 20,
        completed: false,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await updateDoc(doc(db, "tasks", id), updates as any);
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
