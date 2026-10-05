import React from 'react';
import { IconButton as MuiIconButton, Badge as MuiBadge } from '@mui/material';
import type { IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'size'> {
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
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  const variantClasses = {
    ghost: 'text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-full',
    secondary: 'border border-white/10 text-slate-300 hover:text-white hover:border-[#D4AF37]/50 bg-white/[0.04] hover:bg-white/[0.08] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
    gold: 'border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.25)]',
    dark: 'bg-[#12141E] text-white hover:bg-[#1A1D2C] border border-white/10 rounded-full shadow-md',
  }[variant];

  return (
    <MuiIconButton
      aria-label={label}
      title={label}
      disableRipple
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37] hover:scale-105 active:scale-95 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <MuiBadge 
        badgeContent={badge} 
        sx={{
          '& .MuiBadge-badge': {
            background: 'linear-gradient(to right, #e6c042, #D4AF37, #aa8010)',
            color: 'black',
            fontWeight: '800',
            fontSize: '9px',
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            border: '1px solid black',
            boxShadow: '0 2px 8px rgba(212,175,55,0.5)',
          }
        }}
      >
        {icon}
      </MuiBadge>
    </MuiIconButton>
  );
};
