import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/ecommerce';
import { Badge } from './Badge';
import { Price } from './Price';
import { Box, Typography, IconButton as MuiIconButton, Button as MuiButton, Card as MuiCard } from '@mui/material';

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
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0] || '';
  const secondaryImage = product.images[1] || product.images[0] || '';

  // Determine badge
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

  // Stock status
  const totalStock = product.variants.reduce((acc, v) => acc + (v.stock ?? v.stockCount ?? 0), 0);
  const isSoldOut = totalStock === 0;
  const isLowStock = !isSoldOut && totalStock < 10;

  // Colors

  return (
    <MuiCard
      className={`group relative flex flex-col bg-gradient-to-b from-[#141624] via-[#0f111a] to-[#0a0b12] border border-white/10 rounded-2xl p-3.5 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.25)] hover:-translate-y-1.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
         backgroundImage: 'none',
         backgroundColor: 'transparent',
         boxShadow: 'none',
         borderRadius: '16px',
         height: '100%',
         display: 'flex',
         flexDirection: 'column',
      }}
    >
      {/* Visual Image Container with True 3:4 Portrait Aspect Ratio */}
      <Box className="relative shrink-0 aspect-[3/4] w-full overflow-hidden bg-[#141620] rounded-xl mb-3.5 shadow-inner">
        
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
          className={`absolute z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-white/15 backdrop-blur-md ${
            isWishlisted
              ? 'bg-red-600 text-[var(--text-primary)] shadow-[0_0_15px_rgba(220,38,38,0.6)]'
              : 'bg-black/60 text-slate-300 hover:text-[var(--text-primary)] hover:bg-black/90 hover:scale-110 shadow-lg'
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
            <Box className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#151824]">
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
              className="flex-1 bg-white hover:bg-[#D4AF37] text-black py-2.5 px-3 text-[10px] sm:text-[11px] font-black tracking-[0.14em] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              disableRipple
              sx={{ color: 'black', '&:hover': { backgroundColor: '#D4AF37' } }}
            >
              <Eye size={13} className="mr-1" />
              <Typography component="span">QUICK VIEW</Typography>
            </MuiButton>
          </Box>
        </Box>
      </Box>

      {/* Product Information - Custom Layout */}
      <Box className="flex flex-col space-y-1 flex-1 mt-1 justify-between">
        <Box>
          {/* Price at the Top */}
          <Price
            price={product.price}
            salePrice={product.salePrice}
            size="xl"
            showDiscountPercent={true}
            className="mb-1"
          />

          {/* BNPL Installments Text */}
          <Typography component="div" className="text-[10px] sm:text-[11px] text-slate-400 font-medium pb-2.5 border-b border-white/10 mb-2.5 mt-0.5">
            or pay in 3 x <Box component="span" className="font-bold text-[var(--text-primary)]">LKR {Math.round((product.salePrice || product.price) / 3).toLocaleString()}</Box> with <Box component="span" sx={{ color: '#ffb7d5', fontWeight: 900 }}>KOKO</Box> or <Box component="span" sx={{ color: '#00c2cb', fontWeight: 900, fontStyle: 'italic' }}>mintpay</Box>
          </Typography>

          {/* Product Title */}
          <Typography
            component="h3"
            onClick={() => {
              window.location.hash = `#/product/${product.slug}`;
            }}
            className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-heading tracking-wide leading-snug cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2"
            sx={{ textTransform: 'capitalize' }}
          >
            {product.name}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Full-width Add to Cart Button */}
        {onAddToCart && (
          <MuiButton
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isSoldOut}
            fullWidth
            className={`mt-4 py-2.5 rounded text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${isSoldOut ? 'bg-slate-800 text-slate-500' : 'bg-[#002080] hover:bg-[#001761]'}`}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              bgcolor: isSoldOut ? '#1e293b' : '#002080',
              '&:hover': { bgcolor: isSoldOut ? '#1e293b' : '#001761' }
            }}
          >
            <ShoppingBag size={18} /> {isSoldOut ? 'Sold Out' : 'Add To Cart'}
          </MuiButton>
        )}
      </Box>
    </MuiCard>
  );
};
