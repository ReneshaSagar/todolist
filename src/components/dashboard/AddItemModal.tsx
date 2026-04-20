"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Bell, Plus, Info } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { cn } from "@/lib/utils";

interface AddItemModalProps {
  type: "task" | "reminder" | "event";
  onClose: () => void;
}

export default function AddItemModal({ type, onClose }: AddItemModalProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let scheduledAt = null;
      if (date && time) {
          scheduledAt = new Date(`${date}T${time}`);
      }

      await addTask({
        title,
        description,
        type,
        priority,
        scheduledAt: scheduledAt || undefined,
        tags: [type === "event" ? "Calendar" : type === "reminder" ? "Alert" : "Task"]
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeColor = () => {
    if (type === "reminder") return "text-orange-400 bg-orange-400/10";
    if (type === "event") return "text-blue-400 bg-blue-400/10";
    return "text-brand bg-brand/10";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg glass-dark border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getThemeColor())}>
               {type === "reminder" && <Bell size={20} />}
               {type === "event" && <Calendar size={20} />}
               {type === "task" && <Plus size={20} />}
             </div>
             <div>
               <h3 className="text-lg font-bold capitalize">Add {type}</h3>
               <p className="text-[10px] text-subdued uppercase tracking-widest font-black">Syncing to OS</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-subdued uppercase tracking-widest ml-1">Title</label>
              <input 
                autoFocus
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={`What needs to be done?`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-subdued uppercase tracking-widest ml-1">About / Info</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add some context..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-brand transition-all h-20 resize-none"
              />
            </div>

            {(type === "reminder" || type === "event") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-subdued uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-all invert brightness-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-subdued uppercase tracking-widest ml-1">Time</label>
                  <input 
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-all invert brightness-200"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-subdued uppercase tracking-widest ml-1">Urgency Level</label>
               <div className="flex gap-2">
                 {["Low", "Medium", "High", "Urgent"].map((p) => (
                   <button
                     key={p}
                     type="button"
                     onClick={() => setPriority(p as any)}
                     className={cn(
                       "flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all",
                       priority === p 
                        ? "bg-brand/20 border-brand/40 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]" 
                        : "bg-white/5 border-white/10 text-subdued hover:bg-white/10"
                     )}
                   >
                     {p}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
             <div className="flex items-center gap-2 text-xs text-subdued px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                <Info size={14} className="text-brand" />
                <span>Syncs to all OS instances</span>
             </div>
             <button 
               type="submit"
               disabled={isSubmitting}
               className="flex-1 py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
             >
               {isSubmitting ? "Syncing..." : `Finalize ${type}`}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
