import React from 'react';
import { TextField as MuiTextField, InputAdornment, Box, Typography } from '@mui/material';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material';

export type InputProps = Omit<MuiTextFieldProps, 'error' | 'variant'> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <Box className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <Typography component="label" htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
            {label}
          </Typography>
        )}
        <MuiTextField
          inputRef={ref}
          id={inputId}
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error || helperText}
          slotProps={{
            input: {
              startAdornment: leftIcon ? <InputAdornment position="start" className="text-slate-400">{leftIcon}</InputAdornment> : null,
              endAdornment: rightIcon ? <InputAdornment position="end" className="text-slate-400">{rightIcon}</InputAdornment> : null,
              sx: {
                backgroundColor: '#12141E',
                color: 'white',
                borderRadius: '2px',
                '& fieldset': {
                  borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: error ? '#ef4444' : '#D4AF37',
                  borderWidth: '1px',
                },
                '&.Mui-focused': {
                  backgroundColor: '#151824',
                },
                fontSize: '14px',
              }
            },
            formHelperText: {
              sx: {
                color: error ? '#ef4444' : '#94a3b8',
                margin: '4px 0 0 0',
                fontSize: '11px',
                fontWeight: error ? 500 : 400,
              }
            }
          }}
          {...props}
        />
      </Box>
    );
  }
);

Input.displayName = 'Input';
