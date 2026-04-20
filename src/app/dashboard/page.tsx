"use client";

import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";
import { useSpotify } from "@/context/SpotifyContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  ListTodo, 
  Music, 
  Plus, 
  Search,
  Settings,
  Timer,
  LogOut,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import FocusMode from "@/components/dashboard/FocusMode";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { tasks, addTask, updateTask, mood, setMood } = useTasks();
  const { isConnected, connect, currentTrack } = useSpotify();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-black">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter text-brand italic">FLOWSTATE</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            icon={<ListTodo size={20} />} 
            label="Tasks" 
            active={activeTab === "tasks"} 
            onClick={() => setActiveTab("tasks")} 
          />
          <NavItem 
            icon={<Timer size={20} />} 
            label="Focus" 
            active={activeTab === "focus"} 
            onClick={() => setActiveTab("focus")} 
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Stats" 
            active={activeTab === "stats"} 
            onClick={() => setActiveTab("stats")} 
          />
        </nav>

        <div className="p-4 mt-auto">
          {!isConnected ? (
             <button 
                onClick={connect}
                className="w-full py-3 bg-brand text-black font-bold rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform"
             >
                Connect Spotify
             </button>
          ) : (
            <div className="p-4 glass rounded-[24px] flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/20 rounded-lg flex items-center justify-center">
                <Music size={20} className="text-brand" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white">{currentTrack?.name || "Listening..."}</p>
                <p className="text-[10px] text-subdued truncate">{currentTrack?.artists?.[0]?.name || "Spotify"}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-black">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <span className="text-[10px] font-black text-subdued uppercase tracking-widest">System Mood</span>
            <div className="flex gap-2">
               {["Lazy", "Neutral", "Energetic"].map((m) => (
                 <button
                   key={m}
                   onClick={() => setMood(m as any)}
                   className={cn(
                     "px-3 py-1 text-[10px] font-black uppercase rounded-full transition-all",
                     mood === m ? "bg-brand text-black shadow-lg shadow-brand/20" : "text-subdued hover:text-white"
                   )}
                 >
                   {m}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-brand uppercase tracking-widest">XP Level 14</p>
                <p className="text-sm font-black tracking-tight">{user.displayName || user.email?.split('@')[0]}</p>
             </div>
             <button onClick={logout} className="p-2 hover:bg-white/5 rounded-xl text-subdued transition-colors">
               <LogOut size={20} />
             </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {activeTab === "tasks" && (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-4xl mx-auto space-y-10"
              >
                {/* AI Plan Banner */}
                <div className="p-10 rounded-[40px] glass-dark border border-brand/10 relative overflow-hidden group">
                  <div className="relative z-10">
                      <div className="flex items-center gap-2 text-brand mb-4">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-xs font-bold uppercase tracking-widest">AI Command</span>
                      </div>
                      <h3 className="text-3xl font-black mb-3 tracking-tighter">Initialize Daily Flow.</h3>
                      <p className="text-subdued mb-8 max-w-sm font-medium leading-relaxed">Let FlowState AI analyze your deadlines and energetic state to structure your grind.</p>
                      <button className="px-8 py-3 bg-brand text-black font-bold rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                        Plan My Day
                      </button>
                  </div>
                  <BarChart3 className="absolute -right-8 -bottom-8 w-60 h-60 text-brand/5 group-hover:text-brand/10 transition-transform duration-700" />
                </div>

                {/* Task List */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black tracking-tighter">Current Quests</h3>
                    <button 
                      onClick={() => addTask({ title: "Deep Work Initiative", priority: "High" })}
                      className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-[0.2em] hover:translate-x-1 transition-transform"
                    >
                      <Plus size={16} /> New Entry
                    </button>
                  </div>

                  <div className="grid gap-4 pb-20">
                    {tasks.map((task) => (
                      <TaskItem key={task.id} task={task} onToggle={() => updateTask(task.id, { completed: !task.completed })} />
                    ))}
                    {tasks.length === 0 && (
                      <div className="py-24 text-center glass rounded-[40px] border-dashed border-white/5">
                        <p className="text-subdued font-bold text-lg">System idle. All objectives secured.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "focus" && (
              <motion.div 
                key="focus"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full"
              >
                <FocusMode />
              </motion.div>
            )}

            {activeTab === "dashboard" && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-8"
              >
                <div className="glass p-10 rounded-[40px]">
                  <h3 className="text-xl font-bold mb-6">Grind Stats</h3>
                  <div className="aspect-video bg-white/5 rounded-3xl flex items-center justify-center">
                    <BarChart3 className="text-brand w-12 h-12 opacity-20" />
                  </div>
                </div>
                <div className="glass p-10 rounded-[40px]">
                  <h3 className="text-xl font-bold mb-6">XP Progression</h3>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand w-[65%]" />
                  </div>
                  <p className="mt-4 text-xs font-bold text-subdued uppercase">640 / 1000 XP to Level 15</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all",
        active ? "bg-white/5 text-brand" : "text-subdued hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      {active && <motion.div layoutId="nav-pill" className="ml-auto w-1 h-1 bg-brand rounded-full shadow-[0_0_10px_var(--spotify-green)]" />}
    </button>
  );
}

function TaskItem({ task, onToggle }: { task: any; onToggle: () => void }) {
  return (
    <div className="group flex items-center gap-8 p-8 glass rounded-[32px] hover:border-white/10 transition-all cursor-pointer">
      <button onClick={onToggle} className="transition-transform active:scale-95">
        {task.completed ? <CheckCircle2 className="text-brand w-7 h-7" /> : <Circle className="text-white/10 group-hover:text-brand transition-colors w-7 h-7" />}
      </button>
      <div className="flex-1">
        <h4 className={cn("text-xl font-black transition-all tracking-tight", task.completed && "line-through text-subdued")}>{task.title}</h4>
        <div className="flex gap-6 mt-2">
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", 
            task.priority === "Urgent" ? "text-red-500" : task.priority === "High" ? "text-orange-500" : "text-brand"
          )}>{task.priority} Priority</span>
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
            + {task.xp} XP
          </span>
        </div>
      </div>
    </div>
  );
}
