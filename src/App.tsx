import React, { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import ColorCard from "./components/ColorCard";
import { generateRandomHex } from "./lib/utils";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";

interface ColorItem {
  hex: string;
  name?: string;
  isLocked: boolean;
  id: string;
}

interface SavedPalette {
  colors: { hex: string; name?: string }[];
  time: string;
}

export default function App() {
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [history, setHistory] = useState<SavedPalette[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initPalette = useCallback(() => {
    const initialColors: ColorItem[] = Array.from({ length: 5 }).map(() => ({
      hex: generateRandomHex(),
      isLocked: false,
      id: Math.random().toString(36).substring(7),
    }));
    setColors(initialColors);
  }, []);

  useEffect(() => {
    initPalette();
  }, [initPalette]);

  const saveToHistory = useCallback((palette: ColorItem[]) => {
    const newEntry: SavedPalette = {
      colors: palette.map(c => ({ hex: c.hex, name: c.name })),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 5));
  }, []);

  const generateRandom = () => {
    const nextColors = colors.map(color => 
      color.isLocked ? color : { ...color, hex: generateRandomHex(), name: undefined }
    );
    setColors(nextColors);
    saveToHistory(nextColors);
    setErrorMessage(null);
  };

  const generateAI = async (prompt: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.palette) {
        setColors(prev => prev.map((color, index) => {
          if (color.isLocked) return color;
          const aiColor = data.palette[index];
          return aiColor ? { ...color, hex: aiColor.hex, name: aiColor.name } : color;
        }));

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        saveToHistory(colors);
      } else {
        setErrorMessage("AI palitra yarata olmadi.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server xatoligi.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLock = (id: string) => {
    setColors(prev => prev.map(color => 
      color.id === id ? { ...color, isLocked: !color.isLocked } : color
    ));
  };

  const handleColorChange = (id: string, newHex: string) => {
    setColors(prev => prev.map(color => 
      color.id === id ? { ...color, hex: newHex.toUpperCase(), name: 'Custom Color' } : color
    ));
  };

  const exportPalette = () => {
    const paletteData = colors.map(c => ({ hex: c.hex, name: c.name }));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paletteData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "palette.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generateRandom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [colors, generateRandom]);

  return (
    <div className="h-screen bg-[#0A0A0A] flex flex-col text-white font-sans overflow-hidden border border-[#333]">
      <Header 
        onGenerateRandom={generateRandom} 
        onGenerateAI={generateAI} 
        onExport={exportPalette}
        isLoading={isLoading}
      />
      
      <main className="flex-1 flex mt-[64px] overflow-hidden">
        {/* Palette Generator */}
        <section className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {colors.map((color) => (
              <motion.div 
                key={color.id} 
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex h-full"
              >
                <ColorCard
                  hex={color.hex}
                  name={color.name}
                  isLocked={color.isLocked}
                  onToggleLock={() => toggleLock(color.id)}
                  onColorChange={(newHex) => handleColorChange(color.id, newHex)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* Sidebar */}
        <aside className="w-[320px] bg-[#111] border-l border-[#333] flex flex-col shrink-0">
          <div className="p-6 border-b border-[#333]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Analiz</h2>
            <div className="space-y-4">
               <div className="bg-[#1A1A1A] p-4 border border-[#333] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Harmoniya</span>
                    <span className="bg-blue-900/40 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-800 uppercase">Optimal</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium">Barcha ranglar muvozanatda</div>
               </div>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Tarix</h2>
            <div className="space-y-6">
              {history.map((entry, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex h-10 w-full rounded-md overflow-hidden border border-[#333] hover:border-blue-500 transition-colors">
                    {entry.colors.map((c, j) => (
                      <div key={j} className="flex-1" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Palitra #{history.length - i}</span>
                    <span className="text-[10px] text-zinc-600">{entry.time}</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-[10px] text-zinc-600 font-mono italic">Hali saqlanmagan...</div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-[#333] bg-[#0A0A0A]">
            <button 
              onClick={exportPalette}
              className="w-full py-3 bg-[#1A1A1A] border border-[#333] hover:border-blue-500 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all shadow-lg"
            >
              Export Palette
            </button>
          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-[32px] bg-[#000] border-t border-[#333] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Engine Active</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase">Mode: AI Generative</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>Space: Tasodifiy</span>
          <span>Sichqoncha: Nusxa/Tahrirlash</span>
          <span className="text-zinc-400">v2.1.0</span>
        </div>
      </footer>

      {errorMessage && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-12 right-6 bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest z-50 shadow-2xl"
        >
          {errorMessage}
        </motion.div>
      )}
    </div>
  );
}
