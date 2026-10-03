import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className = '',
}) => {
  const handleDecrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  }[size];

  const buttonPadding = {
    sm: 'w-7 px-1',
    md: 'w-9 px-2',
    lg: 'w-11 px-3',
  }[size];

  return (
    <div
      className={`inline-flex items-center bg-[#12141E] border border-white/10 rounded-[2px] ${sizeClasses} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors ${buttonPadding}`}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>

      <span className="w-10 text-center font-mono font-bold text-white select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors ${buttonPadding}`}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
};
