import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-extrabold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer select-none rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]';

  const sizeClasses = {
    sm: 'text-[11px] px-4 py-2.5 gap-2',
    md: 'text-xs sm:text-sm px-7 py-4 gap-2.5',
    lg: 'text-sm sm:text-base px-9 py-4.5 gap-3',
    xl: 'text-base sm:text-lg px-12 py-5 gap-3.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-white text-black hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] active:scale-[0.98] border border-white',
    secondary:
      'bg-transparent text-white border-2 border-white/25 hover:border-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]',
    gold:
      'bg-[#D4AF37] text-black hover:bg-[#E2B714] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-[0.98] font-black border border-[#D4AF37]',
    outline:
      'bg-transparent text-[#D4AF37] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.98]',
    danger:
      'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-[0.98]',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
