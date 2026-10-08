import React from 'react';
import { IconButton as MuiIconButton, Box, Typography } from '@mui/material';
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
    <Box
      role="status"
      className={`flex items-center gap-3 bg-[var(--bg-surface)] border ${borderClass} px-4 py-3.5 rounded-[2px] shadow-2xl max-w-sm w-full ${className}`}
    >
      {icon}
      <Typography component="span" className="text-xs font-semibold text-[var(--text-primary)] flex-1">{message}</Typography>
      {onClose && (
        <MuiIconButton
          onClick={onClose}
          className="text-slate-400 hover:text-[var(--text-primary)] p-1 transition-colors"
          aria-label="Dismiss notification"
          disableRipple
        >
          <X size={14} />
        </MuiIconButton>
      )}
    </Box>
  );
};
