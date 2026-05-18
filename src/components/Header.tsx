import React, { useState } from 'react';
import { RefreshCw, Sparkles, Download, History } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onGenerateRandom: () => void;
  onGenerateAI: (prompt: string) => void;
  onExport: () => void;
  isLoading: boolean;
}

export default function Header({ onGenerateRandom, onGenerateAI, onExport, isLoading }: HeaderProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerateAI(prompt);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#333] px-6 h-[64px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-lg shadow-lg"></div>
        <h1 className="text-lg font-bold tracking-tight uppercase text-white/90">
        ColorPixer <span className="text-blue-500 opacity-80">Pro</span>
        </h1>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="AI GENERATOR..."
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-md py-1.5 pl-10 pr-4 text-[11px] font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all uppercase tracking-widest"
          />
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none" />
          <button 
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white transition-colors"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onGenerateRandom}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          Generate (Space)
        </button>
        <div className="h-6 w-px bg-[#333] mx-1"></div>
        <button
          onClick={onExport}
          className="p-2 text-zinc-500 hover:text-white hover:bg-[#222] rounded transition-all"
          title="EXPORT"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
