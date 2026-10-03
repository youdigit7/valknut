import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[#12141E] border ${
              error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
            } rounded-[2px] py-3.5 ${leftIcon ? 'pl-11' : 'pl-4'} ${
              rightIcon ? 'pr-11' : 'pr-4'
            } text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#151824] transition-all duration-200 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
