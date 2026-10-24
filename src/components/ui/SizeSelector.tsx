import React from 'react';
import { Box, Typography, Button as MuiButton, Link as MuiLink } from '@mui/material';
import type { ProductSize } from '../../types/ecommerce';

export type SizeOption = ProductSize;

export interface SizeSelectorProps {
  sizes?: SizeOption[];
  selectedSize: SizeOption | string;
  onSelectSize: (size: SizeOption) => void;
  availableSizes?: SizeOption[];
  className?: string;
  showGuideButton?: boolean;
  onOpenGuide?: () => void;
}

const DEFAULT_SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes = DEFAULT_SIZES,
  selectedSize,
  onSelectSize,
  availableSizes,
  className = '',
  showGuideButton = false,
  onOpenGuide,
}) => {
  return (
    <Box className={`space-y-2 ${className}`}>
      <Box className="flex items-center justify-between text-xs">
        <Typography component="span" className="font-bold text-slate-300 uppercase tracking-[0.14em]">
          SELECT SIZE: <Typography component="span" className="text-[#D4AF37] font-mono ml-1">{selectedSize}</Typography>
        </Typography>
        {showGuideButton && (
          <MuiLink
            component="button"
            type="button"
            onClick={onOpenGuide || (() => (window.location.hash = '#/size-guide'))}
            className="text-slate-400 hover:text-[#D4AF37] underline text-[11px] font-medium transition-colors"
            sx={{ textDecoration: 'underline' }}
          >
            Size Guide
          </MuiLink>
        )}
      </Box>

      <Box className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isAvailable = availableSizes ? availableSizes.includes(size) : true;

          return (
            <MuiButton
              key={size}
              disabled={!isAvailable}
              onClick={() => onSelectSize(size)}
              disableRipple
              className={`min-w-[48px] h-11 px-3 flex items-center justify-center text-xs font-bold font-mono uppercase rounded-[2px] transition-all relative ${
                isSelected
                  ? 'bg-white text-black border-2 border-white shadow-md'
                  : isAvailable
                  ? 'bg-[var(--bg-card)] text-slate-200 border border-white/10 hover:border-white/40 hover:text-[var(--text-primary)]'
                  : 'bg-[var(--bg-surface)] text-slate-600 border border-white/5 cursor-not-allowed opacity-40 line-through'
              }`}
              sx={{
                minWidth: '48px',
                height: '44px',
                padding: '0 12px',
                '&.Mui-disabled': {
                   color: '#475569',
                   borderColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            >
              {size}
            </MuiButton>
          );
        })}
      </Box>
    </Box>
  );
};
