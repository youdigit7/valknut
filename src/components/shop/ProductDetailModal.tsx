import React, { useState } from 'react';
import type { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { SizeChartModal } from './SizeChartModal';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Ruler, 
  Truck, 
  RefreshCw, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, setIsCartOpen, setIsCheckoutOpen, setCustomStudioProduct, showToast } = useStore();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || 'Onyx Black');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  ) || product.variants[0];

  const selectedColorHex = selectedVariant?.colorHex || '#000000';
  const stockCount = selectedVariant?.stock ?? 10;
  const isOutOfStock = stockCount <= 0;

  const availableColors = Array.from(new Set(product.variants.map(v => v.color)));
  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleOpenStudio = () => {
    setCustomStudioProduct(product);
    onClose();
    const studioEl = document.getElementById('custom-studio-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
        <div className="bg-[#0e1017] border border-white/10 w-full max-w-5xl rounded-lg overflow-hidden relative shadow-2xl my-auto max-h-[92vh] flex flex-col md:flex-row">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-black/60 rounded-full border border-white/10 backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 bg-[#141620] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            {/* Main Featured Image */}
            <div className="relative w-full aspect-[4/5] rounded overflow-hidden mb-3">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnails row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImgIndex === idx ? 'border-[#d4af37]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] space-y-6">
            <div>
              {/* Collection / Subcategory */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#d4af37] uppercase">
                  {product.collection || product.category}
                </span>

                <button 
                  onClick={handleShare} 
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>

              {/* Title & Price */}
              <h2 
                onClick={() => {
                  onClose();
                  window.location.hash = `#/product/${product.slug}`;
                }}
                className="text-2xl font-extrabold text-white tracking-tight font-syne uppercase mb-3 hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-white">
                  LKR {(product.salePrice ?? product.price).toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-slate-500 line-through">
                    LKR {product.price.toLocaleString()}
                  </span>
                )}
                {product.salePrice && (
                  <span className="badge-pill bg-red-950 text-red-400 border border-red-500/40">
                    SAVE LKR {(product.price - product.salePrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isOutOfStock ? 'bg-red-500' : stockCount <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {isOutOfStock 
                    ? 'Out of Stock' 
                    : stockCount <= 5 
                    ? `Low Stock — Only ${stockCount} Left!` 
                    : 'In Stock & Ready to Ship'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mb-5">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wider block mb-2">
                  Select Colour: <span className="text-[#d4af37]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((colorName) => {
                    const variantMatch = product.variants.find(v => v.color === colorName);
                    const hex = variantMatch?.colorHex || '#000000';
                    const isSelected = selectedColor === colorName;

                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected 
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white' 
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: hex }} />
                        <span>{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector + Size Chart Link */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                    Select Size: <span className="text-[#d4af37]">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="flex items-center gap-1 text-xs text-[#d4af37] hover:underline font-bold uppercase"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz as any)}
                        className={`w-12 h-12 rounded font-black text-xs uppercase flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-lg scale-105'
                            : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/40'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-white/20 rounded bg-white/5">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Custom Studio Promo if Product is Customizable */}
              {product.isCustomizable && (
                <div className="p-3 bg-gradient-to-r from-[#d4af37]/20 to-transparent border border-[#d4af37]/40 rounded mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                    <Sparkles size={16} />
                    <span>WANT TO ADD YOUR OWN LOGO OR TEXT?</span>
                  </div>
                  <button
                    onClick={handleOpenStudio}
                    className="px-3 py-1 bg-[#d4af37] text-black font-extrabold text-[10px] uppercase rounded hover:scale-105 transition-transform"
                  >
                    CUSTOM STUDIO
                  </button>
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full btn-gold py-4 text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full btn-primary py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>BUY IT NOW</span>
                </button>
              </div>

            </div>

            {/* Specs & Shipping Accordions */}
            <div className="border-t border-white/10 pt-4 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck size={16} className="text-[#d4af37]" />
                <span><strong>Material:</strong> {product.material}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Truck size={16} className="text-[#d4af37]" />
                <span><strong>Shipping:</strong> Islandwide Express Delivery (1-3 Days)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <RefreshCw size={16} className="text-[#d4af37]" />
                <span><strong>Returns:</strong> 7-Day Hassle Free Exchanges Guaranteed</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Size Chart Modal Component */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </>
  );
};
