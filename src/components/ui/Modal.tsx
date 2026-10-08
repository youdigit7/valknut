import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton as MuiIconButton, Box, Typography } from '@mui/material';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  showCloseButton = true,
}) => {
  const sizeMap = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg',
    full: 'xl',
  } as const;

  const maxWidth = sizeMap[size];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#0E1017',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          backgroundImage: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          margin: { xs: 2, sm: 4 },
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
          }
        }
      }}
    >
      {(title || showCloseButton) && (
        <DialogTitle className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5 bg-[var(--bg-card)]/40" sx={{ padding: '20px 24px' }}>
          <Box>
            {title && (
              <Typography variant="h6" className="text-lg font-black uppercase text-[var(--text-primary)] font-syne tracking-wider">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" className="text-xs text-slate-400 mt-1">
                {subtitle}
              </Typography>
            )}
          </Box>
          {showCloseButton && (
            <MuiIconButton
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-[var(--text-primary)] hover:bg-white/5 rounded-[2px] transition-colors"
              aria-label="Close modal"
              sx={{ color: '#94a3b8' }}
            >
              <X size={20} />
            </MuiIconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent className="p-5 sm:p-6" sx={{ padding: '20px 24px', maxHeight: '80vh' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
