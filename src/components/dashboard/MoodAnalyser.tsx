"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, Send, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MoodAnalyser() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! How's your day going? Tell me how you're feeling, and I'll find the perfect frequency for your flow." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestion, setSuggestion] = useState<{ song: string; artist: string } | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              prompt: `This is a mood analysis chat. The user says: "${input}". 
              Review the chat history and analyze their emotional state. 
              Ask 1 supportive follow-up question or provide a chill insight. 
              ALSO, if you have enough context, suggest ONE specific song and artist that fits their mood (something soothing for stress, high-energy for focus, etc.).
              Return JSON: { "reply": "your supportive message", "suggestion": { "song": "name", "artist": "name" } | null }` 
          })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.message }]);
      if (data.suggestion) setSuggestion(data.suggestion);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "My neural links are a bit fuzzy. How about we just keep vibing?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand" /> Mood Analyser
        </h3>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 bg-brand/20 rounded-full border border-brand/30"
          >
            <Music className="w-3 h-3 text-brand" />
            <span className="text-[10px] font-bold text-brand truncate max-w-[100px]">
              {suggestion.song}
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed",
              msg.role === "user" ? "bg-brand text-white rounded-tr-none" : "bg-white/5 text-subdued rounded-tl-none border border-white/5"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
               {[1, 2, 3].map(i => (
                 <motion.div 
                   key={i} 
                   animate={{ opacity: [0.3, 1, 0.3] }} 
                   transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                   className="w-1.5 h-1.5 bg-subdued rounded-full" 
                 />
               ))}
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="relative">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="How's your day been?"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-brand transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1.5 w-9 h-9 bg-brand rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
