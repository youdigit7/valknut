import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/ecommerce';
import { Badge } from './Badge';
import { Price } from './Price';
import { Box, Typography, IconButton as MuiIconButton, Button as MuiButton, Card as MuiCard } from '@mui/material';
import { useAppTheme } from '../../context/ThemeContext';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = '',
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || '';
  const secondaryImage = product.images[1] || product.images[0] || '';

  const isSale = Boolean(product.salePrice && product.salePrice < product.price);
  const badge = product.isNewArrival
    ? { text: 'NEW ARRIVAL', variant: 'gold' as const }
    : product.isBestSeller
    ? { text: 'BEST SELLER', variant: 'gold' as const }
    : product.isLimitedEdition
    ? { text: 'LIMITED DROP', variant: 'purple' as const }
    : isSale
    ? { text: 'SALE', variant: 'red' as const }
    : null;

  const totalStock = product.variants.reduce((acc, v) => acc + (v.stock ?? v.stockCount ?? 0), 0);
  const isSoldOut = totalStock === 0;
  const isLowStock = !isSoldOut && totalStock < 10;

  return (
    <MuiCard
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#141624] via-[#0f111a] to-[#0a0b12] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.25)]'
          : 'bg-white border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12),0_0_25px_rgba(212,175,55,0.2)]'
      } hover:-translate-y-1.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        backgroundImage: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image section — flex:1 so it fills all card space above the info panel */}
      <Box
        className={`relative w-full overflow-hidden ${isDark ? 'bg-[#141620]' : 'bg-slate-100'}`}
        sx={{ flex: 1, minHeight: 220 }}
      >
        {/* Badges */}
        <Box className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
          {badge && <Badge variant={badge.variant} size="sm">{badge.text}</Badge>}
          {isSoldOut ? (
            <Badge variant="soldout" size="sm">SOLD OUT</Badge>
          ) : isLowStock ? (
            <Typography component="span" className="text-[8px] sm:text-[9px] font-mono font-bold text-red-400 bg-black/85 border border-red-500/40 px-2 py-0.5 rounded-full tracking-wider uppercase backdrop-blur-md shadow-lg">
              LOW STOCK
            </Typography>
          ) : null}
        </Box>

        {/* Wishlist */}
        <MuiIconButton
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
          className={`absolute z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md ${
            isDark ? 'border-white/15' : 'border-black/10'
          } ${
            isWishlisted
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)]'
              : isDark
                ? 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 hover:scale-110 shadow-lg'
                : 'bg-white/90 text-slate-700 hover:text-black hover:bg-white hover:scale-110 shadow-md'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          disableRipple
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </MuiIconButton>

        {/* Photo — clicks navigate to product */}
        <Box
          className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
          onClick={() => { window.location.hash = `#/product/${product.slug}`; }}
        >
          {primaryImage && !primaryImage.includes('placeholder') ? (
            <>
              <Box
                component="img"
                src={primaryImage}
                alt={`${product.name} — ${product.subCategory || product.category}`}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                  isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {secondaryImage !== primaryImage && (
                <Box
                  component="img"
                  src={secondaryImage}
                  alt={`${product.name} Alternate`}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </>
          ) : (
            <Box className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${isDark ? 'bg-[#151824]' : 'bg-slate-100'}`}>
              <Typography component="span" className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-1">VALKNUT</Typography>
              <Typography component="span" className="text-[var(--text-primary)] text-xs font-bold">{product.name}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Info panel — fixed height, never stretches */}
      <Box className="flex flex-col px-4 pt-3 pb-4" sx={{ flexShrink: 0 }}>
        <Typography
          component="span"
          className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1.5 block"
          sx={{ fontFamily: '"Outfit", sans-serif' }}
        >
          {product.subCategory || product.category}
        </Typography>

        <Typography
          component="h3"
          onClick={() => { window.location.hash = `#/product/${product.slug}`; }}
          className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-normal leading-snug cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2.5"
          sx={{ fontFamily: '"Outfit", sans-serif' }}
        >
          {product.name}
        </Typography>

        <Box className="flex items-baseline gap-2 mb-2">
          <Price price={product.price} salePrice={product.salePrice} size="lg" showDiscountPercent={true} />
        </Box>

        <Typography component="div" className={`text-[10px] sm:text-[11px] font-medium pb-2.5 border-b mb-3 mt-0.5 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-black/10'}`}>
          or pay in 3 x <Box component="span" className="font-bold text-[var(--text-primary)]">LKR {Math.round((product.salePrice || product.price) / 3).toLocaleString()}</Box> with <Box component="span" sx={{ color: '#ffb7d5', fontWeight: 900 }}>KOKO</Box> or <Box component="span" sx={{ color: '#00c2cb', fontWeight: 900, fontStyle: 'italic' }}>mintpay</Box>
        </Typography>

        {onAddToCart && (
          <MuiButton
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={isSoldOut}
            fullWidth
            className={`mt-2 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              isSoldOut
                ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#D4AF37] hover:bg-[#e2b714] text-black active:scale-[0.98]'
            }`}
            sx={{
              textTransform: 'uppercase',
              fontSize: '0.8125rem',
              letterSpacing: '0.1em',
              fontWeight: 800,
              fontFamily: '"Outfit", sans-serif',
              bgcolor: isSoldOut ? (isDark ? '#1e293b' : '#e2e8f0') : '#D4AF37',
              color: isSoldOut ? (isDark ? '#64748b' : '#94a3b8') : '#000000',
              borderRadius: '12px',
              py: 1.25,
              '&:hover': {
                bgcolor: isSoldOut ? (isDark ? '#1e293b' : '#e2e8f0') : '#e2b714',
                boxShadow: isSoldOut ? 'none' : '0 8px 25px rgba(212,175,55,0.45)'
              }
            }}
          >
            <ShoppingBag size={16} /> {isSoldOut ? 'Sold Out' : 'Add To Bag'}
          </MuiButton>
        )}
      </Box>
    </MuiCard>
  );
};

