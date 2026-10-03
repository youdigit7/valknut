import React, { useState } from 'react';
import type { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Eye, Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setCustomStudioProduct, addToCart } = useStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const hasSale = Boolean(product.salePrice && product.salePrice < product.price);
  const displayPrice = product.salePrice ?? product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstVariant = product.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
    addToCart(
      product, 
      firstVariant.size as any, 
      firstVariant.color, 
      firstVariant.colorHex, 
      1
    );
  };

  const handleCustomStudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomStudioProduct(product);
    const studioEl = document.getElementById('custom-studio-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-[#0e1017] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#d4af37]/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div 
        className="relative w-full aspect-[4/5] bg-[#141620] overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImgIndex(1)}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img 
          src={product.images[currentImgIndex] || product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasSale && (
            <span className="badge-pill bg-red-950/80 text-red-400 border border-red-500/40 backdrop-blur-md">
              SALE
            </span>
          )}
          {product.isBestSeller && (
            <span className="badge-pill badge-gold backdrop-blur-md">
              BEST SELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="badge-pill badge-dark backdrop-blur-md">
              NEW
            </span>
          )}
        </div>

        {/* Custom Studio Badge Top Right */}
        {product.isCustomizable && (
          <button
            onClick={handleCustomStudio}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/50 backdrop-blur-md transition-all duration-300 z-10"
            title="Customize in Studio"
          >
            <Sparkles size={15} />
          </button>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button 
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 bg-white text-black font-extrabold text-[11px] tracking-wider uppercase rounded hover:bg-[#d4af37] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>QUICK ADD</span>
          </button>

          <button 
            onClick={() => setSelectedProduct(product)}
            className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-md transition-colors"
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase block mb-1">
            {product.subCategory}
          </span>
          <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Price & Variant Swatches */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-white">
              LKR {displayPrice.toLocaleString()}
            </span>
            {hasSale && (
              <span className="text-xs text-slate-500 line-through">
                LKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1">
            {Array.from(new Set(product.variants.map(v => v.colorHex))).slice(0, 3).map((hex, i) => (
              <span 
                key={i} 
                className="w-2.5 h-2.5 rounded-full border border-white/30 inline-block"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
