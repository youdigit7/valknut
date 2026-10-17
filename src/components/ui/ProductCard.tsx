import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
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
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = '',
}) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const images = Array.isArray(product?.images) ? product.images : [];
  const primaryImage = images[0] || '';
  const secondaryImage = images[1] || images[0] || '';

  // Determine badge
  const isSale = Boolean(product?.salePrice && product.salePrice < product.price);
  const badge = product?.isNewArrival
    ? { text: 'NEW ARRIVAL', variant: 'gold' as const }
    : product?.isBestSeller
    ? { text: 'BEST SELLER', variant: 'gold' as const }
    : product?.isLimitedEdition
    ? { text: 'LIMITED DROP', variant: 'purple' as const }
    : isSale
    ? { text: 'SALE', variant: 'red' as const }
    : null;

  // Stock status - safe against missing or undefined variants
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const totalStock = variants.reduce((acc, v) => acc + (v.stock ?? v.stockCount ?? 0), 0);
  const isSoldOut = variants.length > 0 ? totalStock === 0 : false;
  const isLowStock = !isSoldOut && totalStock > 0 && totalStock < 10;

  return (
    <MuiCard
      className={`group relative flex flex-col rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
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
      {/* Visual Image Container with True 3:4 Portrait Aspect Ratio */}
      <Box className={`relative shrink-0 aspect-[3/4] w-full overflow-hidden rounded-xl mb-4 shadow-inner ${isDark ? 'bg-[#141620]' : 'bg-slate-100'}`}>
        
        {/* Badges Overlay */}
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

        {/* 3D Glass Wishlist Button */}
        <MuiIconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
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

        {/* Main Product Image with Full 100% Bleed Inside 3:4 Frame */}
        <Box
          className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
          onClick={() => {
            window.location.hash = `#/product/${product.slug}`;
          }}
        >
          {primaryImage && !primaryImage.includes('placeholder') ? (
            <>
              <Box
                component="img"
                src={primaryImage}
                alt={`${product.name} — Dark Luxury Streetwear ${product.subCategory || product.category} in Sri Lanka`}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
                  isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-100' : 'opacity-100 scale-100'
                }`}
              />
              {secondaryImage !== primaryImage && (
                <Box
                  component="img"
                  src={secondaryImage}
                  alt={`${product.name} Alternate Angle — Heavyweight Streetwear`}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </>
          ) : (
            <Box className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${isDark ? 'bg-[#151824]' : 'bg-slate-100'}`}>
              <Typography component="span" className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-1">
                VALKNUT
              </Typography>
              <Typography component="span" className="text-[var(--text-primary)] text-xs font-bold">{product.name}</Typography>
            </Box>
          )}
          {/* 3D Modern Quick Action Bar with Frosted Glass & Gold Accent */}
          <Box className="absolute inset-x-2.5 bottom-2.5 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            <MuiButton
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className={`flex-1 py-2.5 px-3 text-[10px] sm:text-[11px] font-black tracking-[0.14em] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] border cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isDark 
                  ? 'bg-white hover:bg-[#D4AF37] text-black border-white/20' 
                  : 'bg-slate-900 hover:bg-[#D4AF37] text-white hover:text-black border-black/10'
              }`}
              disableRipple
              sx={{ color: isDark ? 'black' : 'white', '&:hover': { backgroundColor: '#D4AF37', color: 'black' } }}
            >
              <Eye size={13} className="mr-1" />
              <Typography component="span">QUICK VIEW</Typography>
            </MuiButton>
          </Box>
        </Box>
      </Box>

      {/* Product Information - Custom Layout with Generous Margins */}
      <Box className="flex flex-col flex-1 mt-1 justify-between">
        <Box>
          {/* Category Eyebrow */}
          <Typography
            component="span"
            className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1.5 block"
            sx={{ fontFamily: '"Outfit", sans-serif' }}
          >
            {product.subCategory || product.category}
          </Typography>

          {/* Product Title */}
          <Typography
            component="h3"
            onClick={() => {
              window.location.hash = `#/product/${product.slug}`;
            }}
            className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-normal leading-snug cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2.5"
            sx={{ fontFamily: '"Outfit", sans-serif' }}
          >
            {product.name}
          </Typography>

          {/* Price */}
          <Box className="flex items-baseline gap-2 mb-2">
            <Price
              price={product.price}
              salePrice={product.salePrice}
              size="lg"
              showDiscountPercent={true}
            />
          </Box>

          {/* BNPL Installments Text with Margins */}
          <Typography component="div" className={`text-[10px] sm:text-[11px] font-medium pb-2.5 border-b mb-3 mt-0.5 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-black/10'}`}>
            or pay in 3 x <Box component="span" className="font-bold text-[var(--text-primary)]">LKR {Math.round((product.salePrice || product.price) / 3).toLocaleString()}</Box> with <Box component="span" sx={{ color: '#ffb7d5', fontWeight: 900 }}>KOKO</Box> or <Box component="span" sx={{ color: '#00c2cb', fontWeight: 900, fontStyle: 'italic' }}>mintpay</Box>
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Full-width Add to Cart Button with Generous Margin and Luxury Gold Button */}
        {onAddToCart && (
          <MuiButton
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
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
