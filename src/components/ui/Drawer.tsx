import React from 'react';
import { Drawer as MuiDrawer, Box, Typography, IconButton } from '@mui/material';
import type { DrawerProps as MuiDrawerProps } from '@mui/material';
import { X } from 'lucide-react';

export interface DrawerProps extends Omit<MuiDrawerProps, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  position?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'right',
  width = 'md',
  children,
  footer,
  ...props
}) => {
  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[width];

  return (
    <MuiDrawer
      anchor={position}
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundImage: 'none',
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
          }
        }
      }}
      {...props}
    >
      {/* Header */}
      <Box className={`w-full ${widthClasses} bg-[#0D0E12] border-${position === 'right' ? 'l' : 'r'} border-white/10 shadow-2xl flex-1 flex flex-col h-full`}>
      <Box className="flex items-center justify-between p-5 border-b border-white/10 bg-[var(--bg-card)]/50">
        <Box>
          {title && (
            <Typography variant="h3" className="text-sm font-black uppercase text-[var(--text-primary)] tracking-[0.2em] font-syne">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" className="text-[11px] text-slate-400 mt-0.5">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-[var(--text-primary)] hover:bg-white/5 rounded-[2px] transition-colors"
          aria-label="Close drawer"
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* Scrollable Body */}
      <Box className="flex-1 overflow-y-auto p-5">{children}</Box>

      {/* Footer */}
      {footer && (
        <Box className="p-5 border-t border-white/10 bg-[var(--bg-card)]/50">
          {footer}
        </Box>
      )}
      </Box>
    </MuiDrawer>
  );
};
