import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  className = '',
}) => {
  const icon = {
    success: <CheckCircle2 size={18} className="text-[#D4AF37] flex-shrink-0" />,
    error: <AlertCircle size={18} className="text-red-400 flex-shrink-0" />,
    info: <Info size={18} className="text-blue-400 flex-shrink-0" />,
  }[type];

  const borderClass = {
    success: 'border-[#D4AF37]/40',
    error: 'border-red-500/40',
    info: 'border-blue-500/40',
  }[type];

  return (
    <div
      role="status"
      className={`flex items-center gap-3 bg-[#0E1017] border ${borderClass} px-4 py-3.5 rounded-[2px] shadow-2xl animate-slide-up max-w-sm w-full ${className}`}
    >
      {icon}
      <span className="text-xs font-semibold text-white flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
