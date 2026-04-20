"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
  "The concept of 'flow' was first recognized and named by psychologist Mihály Csíkszentmihályi in 1975.",
  "Working in complete silence is often less productive than having ambient noise around 70 decibels.",
  "It takes an average of 23 minutes and 15 seconds to return to deep focus after an interruption.",
  "Your brain consumes about 20% of your body's energy, despite being only 2% of your weight.",
  "The Pomodoro Technique was invented in the late 1980s by Francesco Cirillo using a tomato-shaped kitchen timer.",
  "Dopamine isn't just about reward; it's heavily involved in motivation and the anticipation of completing tasks."
];

export default function DailyFact() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    // Pick a random fact
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
  }, []);

  if (!fact) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex flex-shrink-0 items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-subdued uppercase tracking-widest mb-1.5">Daily Insight</h4>
        <AnimatePresence>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium leading-relaxed text-white/90"
          >
            {fact}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
