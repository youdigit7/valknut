import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/ecommerce';
import { Badge } from './Badge';
import { Price } from './Price';

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
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))].slice(0, 4);

  return (
    <div
      className={`group relative flex flex-col bg-gradient-to-b from-[#141624] via-[#0f111a] to-[#0a0b12] border border-white/10 hover:border-[#D4AF37]/60 rounded-xl p-3 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.25)] hover:-translate-y-1.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container with True 3:4 Portrait Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141620] rounded-lg mb-3 shadow-inner">
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 items-start">
          {badge && <Badge variant={badge.variant} size="sm">{badge.text}</Badge>}
          {isSoldOut ? (
            <Badge variant="soldout" size="sm">SOLD OUT</Badge>
          ) : isLowStock ? (
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-red-400 bg-black/85 border border-red-500/40 px-2 py-0.5 rounded-full tracking-wider uppercase backdrop-blur-md shadow-lg">
              LOW STOCK
            </span>
          ) : null}
        </div>

        {/* 3D Glass Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-white/15 backdrop-blur-md ${
            isWishlisted
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)]'
              : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 hover:scale-110 shadow-lg'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Main Product Image with Full 100% Bleed Inside 3:4 Frame */}
        <div
          className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
          onClick={() => {
            window.location.hash = `#/product/${product.slug}`;
          }}
        >
          {primaryImage && !primaryImage.includes('placeholder') ? (
            <>
              <img
                src={primaryImage}
                alt={`${product.name} — Dark Luxury Streetwear ${product.subCategory || product.category} in Sri Lanka`}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
                  isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-100' : 'opacity-100 scale-100'
                }`}
              />
              {secondaryImage !== primaryImage && (
                <img
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
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#151824]">
              <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-1">
                VALKNUT
              </span>
              <span className="text-white text-xs font-bold">{product.name}</span>
            </div>
          )}

          {/* 3D Modern Quick Action Bar with Frosted Glass & Gold Accent */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
              className="flex-1 bg-white hover:bg-[#D4AF37] text-black py-2.5 px-3 text-[10px] sm:text-[11px] font-black tracking-[0.14em] uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-white/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Eye size={13} />
              <span>QUICK VIEW</span>
            </button>
            {onAddToCart && !isSoldOut && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="w-10 bg-gradient-to-br from-[#D4AF37] to-[#b39023] hover:from-[#e2b714] hover:to-[#D4AF37] text-black py-2.5 rounded-lg transition-all flex items-center justify-center shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 border-t border-white/40 cursor-pointer"
                aria-label="Add to bag"
              >
                <ShoppingBag size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Information with Clear Hierarchy & Spacing */}
      <div className="flex flex-col space-y-1.5 sm:space-y-2 flex-1 justify-between">
        
        <div>
          {/* Subcategory & Color Counter */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono uppercase tracking-wider mb-1">
            <span className="text-slate-400 font-semibold truncate max-w-[65%]">{product.subCategory || product.category}</span>
            {uniqueColors.length > 0 && (
              <span className="text-slate-500 shrink-0">{uniqueColors.length} {uniqueColors.length === 1 ? 'COLOR' : 'COLORS'}</span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => {
              window.location.hash = `#/product/${product.slug}`;
            }}
            className="text-xs sm:text-sm font-bold text-white uppercase font-heading tracking-wide leading-snug cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2"
          >
            {product.name}
          </h3>
        </div>

        {/* Price Row & Swatches */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/5">
          <Price
            price={product.price}
            salePrice={product.salePrice}
            size="sm"
            showDiscountPercent={true}
          />

          {/* Color Dots */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {Array.from(new Set(product.variants.map((v) => v.colorHex))).slice(0, 3).map((hex, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/30 inline-block shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
