import React from 'react';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (color: ColorOption) => void;
  className?: string;
  showLabel?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  className = '',
  showLabel = true,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center text-xs font-bold text-slate-300 uppercase tracking-[0.14em]">
          COLOR: <span className="text-[#D4AF37] ml-1">{selectedColor}</span>
        </div>
      )}

      <div className="flex items-center gap-2.5 flex-wrap">
        {colors.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color)}
              title={color.name}
              className={`group relative w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#0A0A0A] scale-110'
                  : 'hover:scale-105 border border-white/20'
              }`}
            >
              <span
                className="w-full h-full rounded-full border border-black/30"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
