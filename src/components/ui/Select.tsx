import React from 'react';
import { Select as MuiSelect, MenuItem as MuiMenuItem, FormHelperText, FormControl, Box, Typography } from '@mui/material';
import type { SelectProps as MuiSelectProps } from '@mui/material';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectProps = Omit<MuiSelectProps, 'error' | 'variant'> & {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <Box className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <Typography component="label" htmlFor={selectId} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
            {label}
          </Typography>
        )}
        <FormControl fullWidth error={!!error}>
          <MuiSelect
            inputRef={ref}
            id={selectId}
            displayEmpty
            IconComponent={(props) => (
              <Box {...props} className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 ${props.className}`}>
                <ChevronDown size={16} />
              </Box>
            )}
            sx={{
              backgroundColor: '#12141E',
              color: 'white',
              borderRadius: '2px',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#ef4444' : '#D4AF37',
                borderWidth: '1px',
              },
              '&.Mui-focused': {
                backgroundColor: '#151824',
              },
              fontSize: '14px',
              '.MuiSelect-select': {
                padding: '14px 16px',
              },
              '.MuiSelect-icon': {
                color: '#94a3b8',
              }
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  sx: {
                    backgroundColor: '#151824',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    marginTop: '4px',
                  }
                }
              }
            }}
            {...props}
          >
            {options.map((opt) => (
              <MuiMenuItem 
                key={opt.value} 
                value={opt.value} 
                sx={{ 
                  '&.Mui-selected': { backgroundColor: 'rgba(212, 175, 55, 0.15)' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                {opt.label}
              </MuiMenuItem>
            ))}
          </MuiSelect>
          {(error || helperText) && (
            <FormHelperText sx={{ color: error ? '#ef4444' : '#94a3b8', margin: '4px 0 0 0', fontSize: '11px', fontWeight: error ? 500 : 400 }}>
              {error || helperText}
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    );
  }
);

Select.displayName = 'Select';
