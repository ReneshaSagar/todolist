"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyFact() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    async function fetchFact() {
      try {
        const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
        const data = await response.json();
        setFact(data.text);
      } catch (error) {
        console.error("Failed to fetch fact:", error);
        setFact("It takes an average of 23 minutes to return to deep focus after an interruption.");
      }
    }
    fetchFact();
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
