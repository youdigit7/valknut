import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'dark' | 'red' | 'purple' | 'outline' | 'soldout';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 tracking-[0.1em]',
    md: 'text-[10px] px-3 py-1 tracking-[0.14em]',
  }[size];

  const variantClasses = {
    gold: 'bg-[#D4AF37] text-black font-extrabold',
    dark: 'bg-white/10 text-white border border-white/10 backdrop-blur-sm',
    red: 'bg-red-600 text-white font-bold',
    purple: 'bg-purple-600 text-white font-bold',
    outline: 'bg-transparent text-[#D4AF37] border border-[#D4AF37]/60 font-bold',
    soldout: 'bg-[#181A24] text-slate-400 border border-white/10 font-bold',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center uppercase font-mono rounded-[2px] shadow-sm select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
