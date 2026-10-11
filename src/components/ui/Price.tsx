import React from 'react';
import { Box, Typography } from '@mui/material';

export interface PriceProps {
  price: number;
  salePrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountPercent?: boolean;
  className?: string;
}

export const Price: React.FC<PriceProps> = ({
  price,
  salePrice,
  currency = 'Rs',
  size = 'md',
  showDiscountPercent = false,
  className = '',
}) => {
  const isSale = salePrice !== undefined && salePrice !== null && salePrice < price;

  const currentPrice = isSale ? salePrice : price;
  const originalPrice = isSale ? price : null;

  const discountPercent = isSale
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      current: 'text-xs font-bold',
      original: 'text-[11px]',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      current: 'text-sm font-bold',
      original: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      current: 'text-lg sm:text-xl font-extrabold',
      original: 'text-sm',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      current: 'text-2xl sm:text-3xl font-black',
      original: 'text-base',
      badge: 'text-xs px-3 py-1',
    },
  }[size];

  return (
    <Box className={`inline-flex items-baseline gap-2.5 flex-wrap ${className}`}>
      <Typography component="span" className={`${sizeClasses.current} text-[#D4AF37]`} sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.02em', fontWeight: 900 }}>
        {currency} {currentPrice.toLocaleString()}
      </Typography>

      {isSale && originalPrice && (
        <Typography component="span" className={`${sizeClasses.original} text-slate-400 line-through`} sx={{ fontFamily: '"Outfit", sans-serif' }}>
          {currency} {originalPrice.toLocaleString()}
        </Typography>
      )}

      {isSale && showDiscountPercent && (
        <Box component="span" className={`${sizeClasses.badge} bg-red-600/20 text-red-400 border border-red-500/30 rounded-[2px] font-bold uppercase tracking-wider`}>
          -{discountPercent}%
        </Box>
      )}
    </Box>
  );
};
