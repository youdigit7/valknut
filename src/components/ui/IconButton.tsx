import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'ghost' | 'secondary' | 'gold' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  badge?: number | string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  badge,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  const variantClasses = {
    ghost: 'text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-full',
    secondary: 'border border-white/10 text-slate-300 hover:text-white hover:border-[#D4AF37]/50 bg-white/[0.04] hover:bg-white/[0.08] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
    gold: 'border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.25)]',
    dark: 'bg-[#12141E] text-white hover:bg-[#1A1D2C] border border-white/10 rounded-full shadow-md',
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37] hover:scale-105 active:scale-95 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
      {badge !== undefined && badge !== null && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#e6c042] via-[#D4AF37] to-[#aa8010] text-black font-extrabold text-[9px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border border-black shadow-[0_2px_8px_rgba(212,175,55,0.5)]">
          {badge}
        </span>
      )}
    </button>
  );
};
