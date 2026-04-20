"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Send, Loader2, PlusCircle } from "lucide-react";
import { useTasks, Task } from "@/context/TaskContext";
import { cn } from "@/lib/utils";

export default function NeuralPlanner() {
  const { addTask } = useTasks();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ message: string; tasks: Partial<Task>[] } | null>(null);
  const [adopting, setAdopting] = useState(false);

  const handleSynthesize = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (err) {
      console.error(err);
      alert("AI failed to synchronize. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async () => {
    if (!plan || !plan.tasks) return;
    setAdopting(true);
    for (const task of plan.tasks) {
      await addTask(task);
    }
    setAdopting(false);
    setPlan(null);
    setPrompt("");
    alert("Protocol Adopted. Your tasks are now live.");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand/20 to-brand-secondary/20 flex items-center justify-center border border-brand/20">
          <BrainCircuit className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Neural Planner</h2>
          <p className="text-sm text-subdued font-medium">Lofi-OS scheduling protocol.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!plan ? (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-panel p-2 rounded-[24px] flex flex-col focus-within:border-brand/50 transition-colors">
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={"Yo, what's on the agenda today? Drop your chaotic thoughts here and I'll sort them out..."}
                className="w-full h-40 bg-transparent text-white px-6 py-5 focus:outline-none resize-none text-base placeholder:text-white/20"
              />
              <div className="flex justify-between items-center p-4 border-t border-white/5">
                <span className="text-xs text-subdued font-bold tracking-widest uppercase ml-2">Agentic Mode Active</span>
                <button 
                  onClick={handleSynthesize} 
                  disabled={loading || !prompt.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? "Synthesizing..." : "Optimize Schedule"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="glass-dark p-6 rounded-[24px] border border-white/10 mb-6">
              <p className="text-lg leading-relaxed text-white/90 font-medium font-serif italic mb-6">"{plan.message}"</p>
              
              <div className="space-y-3">
                <p className="text-xs font-bold text-subdued uppercase tracking-widest ml-1 mb-2">Proposed FlowState</p>
                {plan.tasks.map((task, i) => (
                  <div key={i} className="flex justify-between items-center p-4 glass rounded-2xl bg-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{task.title}</h4>
                      <div className="flex gap-2">
                        {task.tags?.map(t => (
                          <span key={t} className="text-[10px] bg-brand/20 text-brand px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                       <span className={cn("text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/5", 
                           task.priority === "Urgent" ? "text-red-400" :
                           task.priority === "High" ? "text-orange-400" : "text-subdued"
                         )}>{task.priority}</span>
                       <span className="text-xs font-mono text-brand-accent">+{task.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
               <button 
                  onClick={() => setPlan(null)}
                  className="px-6 py-3 text-sm font-bold text-subdued hover:text-white transition-colors"
               >
                 Go Back
               </button>
               <button 
                  onClick={handleAdopt}
                  disabled={adopting}
                  className="flex items-center gap-2 px-8 py-3 bg-brand text-white font-bold rounded-full hover:bg-brand-secondary transition-all shadow-lg shadow-brand/20 disabled:animate-pulse"
               >
                 {adopting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                 Adopt Protocol
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
