"use client";

import { Canvas } from "@react-three/fiber";
import TwistingShape from "@/components/landing/TwistingShape";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <TwistingShape />
          </Suspense>
        </Canvas>
        {/* Deep gradient overlay to blend 3D with the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowState</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-subdued hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-5xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 border border-white/5">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold uppercase tracking-widest text-subdued">FlowState OS is now live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
             Master your time.<br/>
             <span className="text-gradient-brand">Optimize your mind.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-subdued max-w-2xl mb-12 font-medium leading-relaxed">
             An AI-driven operating system for your daily life. Automated scheduling, Spotify mood synthesis, and intelligent Pomodoro routing to achieve peak flow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
             <Link 
               href="/signup" 
               className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand-secondary transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)]"
             >
                Initialize Workspace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link 
               href="/login" 
               className="flex items-center justify-center w-full sm:w-auto px-8 py-4 glass-dark text-white font-bold rounded-full hover:bg-white/10 transition-colors"
             >
                Login to Dashboard
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Value Props */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-brand" />}
            title="AI Neural Planner"
            desc="Throw your chaotic tasks at the AI and watch it generate an optimized, scheduled timeline."
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-brand-secondary" />}
            title="Audio-Visual Flow"
            desc="Spotify integration detects your requested mood to pipe in high-focus frequencies automatically."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-brand-accent" />}
            title="Distraction Shield"
            desc="Built-in Pomodoro trackers seamlessly attached to tasks. Start grinding, zero friction."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 glass-panel rounded-[24px] group hover:border-brand/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center mb-6 shadow-md border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-subdued leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
