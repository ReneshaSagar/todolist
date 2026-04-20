"use client";

import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";
import { useSpotify } from "@/context/SpotifyContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  ListTodo, 
  Music, 
  Plus, 
  Timer,
  LogOut,
  BrainCircuit,
  Calendar,
  MoreHorizontal,
  X,
  Bell
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import FocusMode from "@/components/dashboard/FocusMode";
import DailyFact from "@/components/dashboard/DailyFact";
import NeuralPlanner from "@/components/dashboard/NeuralPlanner";
import MoodAnalyser from "@/components/dashboard/MoodAnalyser";
import AddItemModal from "@/components/dashboard/AddItemModal";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { isConnected, connect, currentTrack } = useSpotify();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showItemModal, setShowItemModal] = useState<{ type: "task" | "reminder" | "event" } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    
    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
          Notification.requestPermission();
      }
    }
  }, [user, authLoading, router]);

  // Persistent Notification Engine
  useEffect(() => {
    const checkInterval = setInterval(() => {
       const now = new Date();
       tasks.forEach(task => {
          if (!task.completed && task.scheduledAt && !task.notified) {
             const diff = task.scheduledAt.getTime() - now.getTime();
             if (diff <= 0 && diff > -60000) { // Trigger within 1 minute of time
                new Notification(`FlowState Alert: ${task.title}`, {
                   body: task.description || `Time for your ${task.type}!`,
                   icon: "/next_icon_192.png",
                   requireInteraction: true // Keeps it on screen until dismissed
                });
                // Mark as notified so it doesn't fire again
                updateTask(task.id, { notified: true } as any);
             }
          }
       });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [tasks, updateTask]);

  if (authLoading || !user) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-card/50 backdrop-blur-3xl relative z-10">
        <div className="p-8 flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center p-1 shadow-[0_0_10px_rgba(79,70,229,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">FlowState</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-subdued uppercase tracking-widest mb-2 mt-4">Overview</p>
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            icon={<ListTodo size={18} />} 
            label="Tasks" 
            active={activeTab === "tasks"} 
            onClick={() => setActiveTab("tasks")} 
          />
          <NavItem 
            icon={<Timer size={18} />} 
            label="Focus Mode" 
            active={activeTab === "focus"} 
            onClick={() => setActiveTab("focus")} 
          />
          <NavItem 
            icon={<BrainCircuit size={18} />} 
            label="AI Planner" 
            active={activeTab === "ai"} 
            onClick={() => setActiveTab("ai")} 
          />
        </nav>

        <div className="p-4 mt-auto space-y-4">
           {/* Spotify Widget Preview */}
           <div className="glass-dark p-4 rounded-2xl border border-white/5">
             {!isConnected ? (
                 <button 
                    onClick={connect}
                    className="w-full py-2.5 bg-[#1DB954] text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                 >
                    <Music size={14} /> Connect Spotify
                 </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1DB954]/20 flex items-center justify-center overflow-hidden">
                     {currentTrack?.album?.images?.[0] ? 
                       <img src={currentTrack.album.images[0].url} className="w-full h-full object-cover" /> :
                       <Music size={14} className="text-[#1DB954]" />
                     }
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-[11px] font-bold truncate text-white">{currentTrack?.name || "Ready to Flow"}</p>
                    <p className="text-[9px] text-subdued truncate">{currentTrack?.artists?.[0]?.name || "Spotify Sync Active"}</p>
                  </div>
                </div>
              )}
           </div>

           {/* User Profile */}
           <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-secondary to-brand flex items-center justify-center border border-white/10 text-xs font-bold shadow-md">
               {(user.displayName || user.email || "G")[0].toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold text-white truncate">{user.displayName || user.email}</p>
               <p className="text-[10px] text-subdued">OS Explorer</p>
             </div>
             <button onClick={logout} className="p-1.5 hover:bg-white/10 rounded-md text-subdued hover:text-white transition-colors">
               <LogOut size={14} />
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-end px-8 absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md">
           <p className="text-xs text-subdued font-medium flex items-center gap-2">
             <Calendar size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
           </p>
        </header>

        <section className="flex-1 overflow-y-auto pt-24 px-8 pb-10 scroll-smooth">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between mb-2">
                   <h1 className="text-3xl font-bold tracking-tight">Welcome to FlowState</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 space-y-6">
                      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                        <div className="relative z-10 w-2/3">
                          <h3 className="text-2xl font-bold mb-2">AI Neural Planner</h3>
                          <p className="text-subdued text-sm mb-6 leading-relaxed">Agentic AI is offline in this phase. Once deployed, the AI will restructure your workflow dynamically.</p>
                          <button onClick={() => setActiveTab("ai")} className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">
                            Initialize AI
                          </button>
                        </div>
                        <BrainCircuit className="absolute -right-10 -bottom-10 w-64 h-64 text-brand/5 group-hover:text-brand/10 transition-colors duration-500" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4 mt-8">
                          <h3 className="text-lg font-bold">Today's Objectives</h3>
                          <button onClick={() => setActiveTab("tasks")} className="text-xs text-brand hover:text-brand-accent transition-colors font-semibold">View All</button>
                        </div>
                        <div className="space-y-3">
                          {tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                              <div className={cn("w-2 h-2 rounded-full", task.completed ? "bg-brand" : "bg-white/20")} />
                              <span className={cn("text-sm font-medium", task.completed && "line-through text-subdued")}>{task.title}</span>
                            </div>
                          ))}
                          {tasks.length === 0 && <p className="text-sm text-subdued py-4">No tasks tracked yet.</p>}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <DailyFact />
                      
                      <MoodAnalyser />

                      <div className="glass-panel p-6 rounded-3xl h-64 flex flex-col">
                        <h3 className="text-sm font-bold mb-auto flex items-center gap-2"><Timer size={16} /> Fast Focus</h3>
                        <div className="text-center">
                           <p className="text-4xl font-black tabular-nums tracking-tighter mb-4">25:00</p>
                           <button onClick={() => setActiveTab("focus")} className="w-full py-3 bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 rounded-xl text-sm font-bold transition-all">
                             Enter Focus Mode
                           </button>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "tasks" && (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setShowItemModal({ type: "reminder" })}
                      className="flex items-center gap-2 px-4 py-2 glass-dark text-subdued text-xs font-bold rounded-lg border border-white/5 hover:text-white transition-all"
                    >
                      <Plus size={14} /> Add Reminder
                    </button>
                    <button 
                      onClick={() => setShowItemModal({ type: "event" })}
                      className="flex items-center gap-2 px-4 py-2 glass-dark text-subdued text-xs font-bold rounded-lg border border-white/5 hover:text-white transition-all"
                    >
                      <Calendar size={14} /> Schedule Event
                    </button>
                    <button 
                      onClick={() => setShowItemModal({ type: "task" })}
                      className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg shadow-lg hover:bg-brand-secondary transition-colors"
                    >
                      <Plus size={14} /> Create Task
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="group flex items-center gap-4 p-4 glass rounded-2xl hover:border-white/10 transition-all border border-transparent">
                      <button onClick={() => updateTask(task.id, { completed: !task.completed })} className="text-white/30 hover:text-brand transition-colors">
                        {task.completed ? <CheckCircle2 className="text-brand w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                           {task.type === "reminder" && <Bell className="w-3 h-3 text-orange-400" />}
                           {task.type === "event" && <Calendar className="w-3 h-3 text-blue-400" />}
                           <h4 className={cn("text-base font-medium transition-all", task.completed && "line-through text-subdued")}>{task.title}</h4>
                        </div>
                        {task.scheduledAt && (
                          <p className="text-[10px] text-subdued font-bold flex items-center gap-1">
                             <Timer className="w-3 h-3" /> {task.scheduledAt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className={cn("text-[8px] uppercase font-bold px-2 py-1 rounded-md bg-white/5", 
                           task.priority === "Urgent" ? "text-red-400 bg-red-400/10" :
                           task.priority === "High" ? "text-orange-400 bg-orange-400/10" : "text-subdued"
                         )}>{task.priority}</span>
                         
                         <button 
                           onClick={() => deleteTask(task.id)}
                           className="p-1.5 text-subdued hover:text-red-400 rounded-md hover:bg-red-400/10 transition-colors"
                         >
                           <X size={14} />
                         </button>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                      <p className="text-subdued font-medium">Your inbox is clear. Take a breath.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "focus" && (
              <motion.div 
                key="focus"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-[80vh]"
              >
                <FocusMode />
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                 <NeuralPlanner />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Item Modal */}
      {showItemModal && (
        <AddItemModal 
          type={showItemModal.type} 
          onClose={() => setShowItemModal(null)} 
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
        active ? "bg-white/10 text-white shadow-inner border border-white/5" : "text-subdued hover:bg-white/5 hover:text-white"
      )}
    >
      <span className={cn(active ? "text-brand" : "text-subdued group-hover:text-white")}>{icon}</span>
      {label}
    </button>
  );
}
