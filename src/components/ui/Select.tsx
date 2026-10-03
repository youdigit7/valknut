import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none bg-[#12141E] border ${
              error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#D4AF37]'
            } rounded-[2px] py-3.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:bg-[#151824] transition-all duration-200 cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#12141E] text-white py-2">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
