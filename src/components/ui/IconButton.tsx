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
    sm: 'w-8 h-8 p-1 text-sm',
    md: 'w-10 h-10 p-2 text-base',
    lg: 'w-12 h-12 p-3 text-lg',
  }[size];

  const variantClasses = {
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
    secondary: 'border border-white/10 text-slate-300 hover:text-white hover:border-white/30 bg-[#12141E]/60',
    gold: 'border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]',
    dark: 'bg-[#12141E] text-white hover:bg-[#1A1D2C] border border-white/5',
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center justify-center rounded-[2px] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
      {badge !== undefined && badge !== null && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border border-black shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );
};
