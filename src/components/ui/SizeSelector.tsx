import React from 'react';

export type SizeOption = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeSelectorProps {
  sizes?: SizeOption[];
  selectedSize: SizeOption | string;
  onSelectSize: (size: SizeOption) => void;
  availableSizes?: SizeOption[];
  className?: string;
  showGuideButton?: boolean;
  onOpenGuide?: () => void;
}

const DEFAULT_SIZES: SizeOption[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes = DEFAULT_SIZES,
  selectedSize,
  onSelectSize,
  availableSizes,
  className = '',
  showGuideButton = false,
  onOpenGuide,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-[0.14em]">
          SELECT SIZE: <span className="text-[#D4AF37] font-mono ml-1">{selectedSize}</span>
        </span>
        {showGuideButton && (
          <button
            type="button"
            onClick={onOpenGuide || (() => (window.location.hash = '#/size-guide'))}
            className="text-slate-400 hover:text-[#D4AF37] underline text-[11px] font-medium transition-colors"
          >
            Size Guide
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isAvailable = availableSizes ? availableSizes.includes(size) : true;

          return (
            <button
              key={size}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectSize(size)}
              className={`min-w-[48px] h-11 px-3 flex items-center justify-center text-xs font-bold font-mono uppercase rounded-[2px] transition-all relative ${
                isSelected
                  ? 'bg-white text-black border-2 border-white shadow-md'
                  : isAvailable
                  ? 'bg-[#12141E] text-slate-200 border border-white/10 hover:border-white/40 hover:text-white'
                  : 'bg-[#0E1017] text-slate-600 border border-white/5 cursor-not-allowed opacity-40 line-through'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
