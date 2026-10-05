import React from 'react';
import { Box, Typography } from '@mui/material';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <Box
      className={`flex flex-col items-center justify-center text-center p-12 bg-[#0E1017] border border-white/5 rounded-[2px] max-w-md mx-auto ${className}`}
    >
      <Box className="w-16 h-16 rounded-full bg-[#151824] border border-white/10 flex items-center justify-center text-slate-400 mb-5">
        {icon || <PackageOpen size={28} className="text-[#D4AF37]" />}
      </Box>

      <Typography variant="h4" className="text-lg font-black uppercase text-white font-syne tracking-wider mb-2">
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
          {description}
        </Typography>
      )}

      {actionText && onAction && (
        <Button variant="gold" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
