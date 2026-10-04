import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Snackbar, Slide, Box, Typography } from '@mui/material';
import type { SlideProps } from '@mui/material/Slide';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const NotificationToast: React.FC = () => {
  const { toast } = useStore();

  const getToastStyles = (type?: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return {
          bgcolor: 'rgba(14, 16, 23, 0.95)',
          borderColor: '#d4af37',
          color: 'white',
        };
      case 'error':
        return {
          bgcolor: 'rgba(69, 10, 10, 0.95)',
          borderColor: '#ef4444',
          color: '#fecaca',
        };
      case 'info':
      default:
        return {
          bgcolor: 'rgba(20, 22, 32, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#e2e8f0',
        };
    }
  };

  return (
    <Snackbar
      open={!!toast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      slots={{ transition: SlideTransition }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' } // Ensures mobile takes full width minus margins
      }}
    >
      <Box 
        sx={{
          px: 2.5,
          py: 1.75,
          borderRadius: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backdropFilter: 'blur(12px)',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { sm: '400px' },
          ...getToastStyles(toast?.type as any)
        }}
      >
        {toast?.type === 'success' && <CheckCircle color="#d4af37" size={18} />}
        {toast?.type === 'error' && <AlertCircle color="#f87171" size={18} />}
        {toast?.type === 'info' && <Info color="#38bdf8" size={18} />}
        <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 1.4 }}>
          {toast?.message || ''}
        </Typography>
      </Box>
    </Snackbar>
  );
};
