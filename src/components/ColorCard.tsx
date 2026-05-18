import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Palette } from 'lucide-react';
import { getContrastColor, getLuminance, getRGB } from '../lib/utils';
import confetti from 'canvas-confetti';

interface ColorCardProps {
  hex: string;
  name?: string;
  isLocked: boolean;
  onToggleLock: () => void;
  onColorChange: (newHex: string) => void;
}

export default function ColorCard({ hex, name, isLocked, onToggleLock, onColorChange }: ColorCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const textColor = getContrastColor(hex);
  const luminance = getLuminance(hex);
  const rgb = getRGB(hex);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
    
    confetti({
      particleCount: 20,
      spread: 70,
      origin: { y: 0.6 },
      colors: [hex]
    });
  };

  return (
    <div
      className="relative flex-1 flex flex-col group border-r border-black/20 last:border-r-0 h-full overflow-hidden"
      style={{ backgroundColor: hex }}
    >
      <div className="flex-1 flex items-end p-8" style={{ color: textColor }}>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-3xl font-bold uppercase tracking-tighter">{hex}</h2>
            <div className="flex gap-2">
               <button
                onClick={() => colorInputRef.current?.click()}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/10 rounded transition-all"
                style={{ color: textColor }}
                title="Rang tanlash"
              >
                <Palette className="w-4 h-4" />
              </button>
               <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/10 rounded transition-all"
                style={{ color: textColor }}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-current" />}
              </button>
              <button
                onClick={onToggleLock}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/10 rounded transition-all"
                style={{ color: textColor }}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">{name || "Unnamed Hue"}</div>
        </div>
        <input 
          type="color" 
          ref={colorInputRef}
          value={hex}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
        />
      </div>

      <div 
        className="h-[140px] px-8 py-6 flex flex-col justify-end gap-3 bg-black/5"
        style={{ color: textColor }}
      >
        <div className="h-1 w-full bg-current/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-current transition-all duration-700 ease-out" 
            style={{ width: `${luminance}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono opacity-60">
          <span>RGB: {rgb}</span>
          <span>LUM: {luminance}%</span>
        </div>
      </div>
    </div>
  );
}
