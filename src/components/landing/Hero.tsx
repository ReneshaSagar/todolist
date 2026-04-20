"use client";

import { Canvas } from "@react-three/fiber";
import { FlowOrb } from "./FlowOrb";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
          <FlowOrb />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-brand uppercase glass rounded-full ring-1 ring-brand/30">
            Next Generation Productivity
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white leading-none">
            Enter the <br />
            <span className="text-brand">FlowState.</span>
          </h1>
          <p className="max-w-xl mx-auto mb-10 text-lg md:text-xl text-subdued font-medium">
            AI-powered persistence, gamified grit, and Spotify-synced focus. 
            The only workspace designed to keep you in sync.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-brand text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 group"
            >
              Start Your Grind
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
