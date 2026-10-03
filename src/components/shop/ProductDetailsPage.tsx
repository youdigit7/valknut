import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { ProductVariant } from '../../types/ecommerce';
import { ProductImageGallery } from './ProductImageGallery';
import { SizeChartModal } from './SizeChartModal';
import { ProductCard } from '../ui/ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { getProductSEOMetadata, applySEOMetadata } from '../../utils/seo';
import { 
  ShoppingBag, 
  CreditCard, 
  Sparkles, 
  Ruler, 
  Truck, 
  RefreshCw, 
  Share2, 
  ShieldCheck, 
  Check, 
  Minus, 
  Plus, 
  ChevronRight, 
  Heart, 
  Copy, 
  MessageCircle 
} from 'lucide-react';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { 
    products, 
    setSelectedProduct,
    addToCart, 
    setIsCartOpen, 
    setIsCheckoutOpen, 
    setCustomStudioProduct, 
    showToast 
  } = useStore();

  // Find product by slug (or fallback by ID if slug not found)
  const product = useMemo(() => {
    return products.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug
    ) || null;
  }, [products, slug]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('valknut_wishlist');
      const list: string[] = saved ? JSON.parse(saved) : [];
      return product ? list.includes(product.id) : false;
    } catch {
      return false;
    }
  });

  // Size chart modal state
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize selected color and size from product variants
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVar = product.variants[0];
      setSelectedColor(firstVar.color);
      setSelectedSize(firstVar.size);
      setQuantity(1);
    }
  }, [product]);

  // Dynamic SEO & Structured Data updates
  useEffect(() => {
    if (product) {
      const seoMeta = getProductSEOMetadata(product);
      applySEOMetadata(seoMeta, product);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#0A0A0A]">
        <div className="max-w-md w-full bg-[#0E1017] p-8 border border-white/10 rounded-md text-center">
          <EmptyState
            title="PRODUCT NOT FOUND"
            description="The streetwear piece you are looking for might have sold out or been moved to a new collection."
            actionText="EXPLORE ALL PRODUCTS"
            onAction={() => {
              window.location.hash = '#/shop';
            }}
          />
        </div>
      </div>
    );
  }

  // Get available colors with unique hexes
  const availableColors = Array.from(
    new Map(
      product.variants.map((v) => [v.color, { color: v.color, colorHex: v.colorHex || '#000000', image: v.image }])
    ).values()
  );

  // Available sizes across product
  const allPossibleSizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Current active variant matching current color + size
  const activeVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === selectedSize
  );

  // Variant stock & availability status
  const currentStock = activeVariant?.stock ?? activeVariant?.stockCount ?? 0;
  const isOutOfStock = !activeVariant || currentStock <= 0;
  const isLowStock = !isOutOfStock && currentStock <= 8;

  // Pricing (Support variant-specific price or base product price)
  const currentPrice = activeVariant?.price ?? product.price;
  const currentSalePrice = activeVariant?.salePrice ?? product.salePrice;
  const hasSale = Boolean(currentSalePrice && currentSalePrice < currentPrice);
  const displayPrice = currentSalePrice ?? currentPrice;
  const discountPercent = hasSale ? Math.round(((currentPrice - (currentSalePrice || 0)) / currentPrice) * 100) : 0;

  // SKU display
  const activeSku = activeVariant?.sku || `VK-${product.slug.toUpperCase().slice(0, 10)}`;

  // Related & Recommended products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.collection === product.collection && !relatedProducts.some((r) => r.id === p.id))
    .slice(0, 4);

  const displayRecommendations = recommendedProducts.length >= 2 ? recommendedProducts : products.filter((p) => p.id !== product.id).slice(0, 4);

  // Cart operations
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const colorHex = activeVariant?.colorHex || '#000000';
    addToCart(product, selectedSize, selectedColor, colorHex, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const colorHex = activeVariant?.colorHex || '#000000';
    addToCart(product, selectedSize, selectedColor, colorHex, quantity);
    setIsCheckoutOpen(true);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem('valknut_wishlist');
        let list: string[] = saved ? JSON.parse(saved) : [];
        list = next ? [...list, product.id] : list.filter((id) => id !== product.id);
        localStorage.setItem('valknut_wishlist', JSON.stringify(list));
      } catch (e) {
        console.warn('Wishlist storage error', e);
      }
      showToast(next ? `Saved "${product.name}" to wishlist` : `Removed from wishlist`, 'info');
      return next;
    });
  };

  const handleOpenCustomStudio = () => {
    setCustomStudioProduct(product);
    window.location.hash = '#/custom-studio';
  };

  // Social sharing
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'success');
    setIsShareDropdownOpen(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out ${product.name} at VALKNUT Official: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsShareDropdownOpen(false);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Own your mind with ${product.name} from @valknutofficial. ${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setIsShareDropdownOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] py-8 sm:py-12 border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <a href="#/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
          <a href="#/shop" className="hover:text-white transition-colors">Shop</a>
          <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
          <a href={`#/shop/${product.category.toLowerCase()}`} className="hover:text-white transition-colors">
            {product.category}
          </a>
          <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
          <span className="text-slate-400">{product.subCategory}</span>
          <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
          <span className="text-[#D4AF37] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero: Two Column Sticky Gallery & Purchase Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start mb-20">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 xl:col-span-7 sticky top-28">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              isCustomizable={product.isCustomizable}
              onOpenCustomStudio={handleOpenCustomStudio}
            />
          </div>

          {/* Right Column: Product Details, Variant Selectors & Buy Buttons */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 bg-[#0D0E15] border border-white/10 rounded-md p-6 sm:p-8 shadow-2xl">
            
            {/* Header / Badges */}
            <div className="space-y-2 border-b border-white/10 pb-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-[#161825] border border-white/10 rounded-[2px] text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                    {product.category} • {product.subCategory}
                  </span>
                  {product.collection && (
                    <span className="px-2.5 py-0.5 bg-[#161825] border border-[#D4AF37]/30 rounded-[2px] text-[10px] font-mono text-slate-300 uppercase">
                      {product.collection}
                    </span>
                  )}
                  {hasSale && (
                    <span className="px-2 py-0.5 bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-mono font-black rounded-[2px] uppercase">
                      SALE {discountPercent}% OFF
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono font-black rounded-[2px] uppercase">
                      NEW DROP
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-600 text-white border-red-600 shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-syne leading-tight">
                {product.name}
              </h1>

              {/* SKU display */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                <span>SKU: <strong className="text-slate-300">{activeSku}</strong></span>
                <span>•</span>
                <span>ORIGIN: <strong className="text-slate-300">COLOMBO, LK</strong></span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                LKR {displayPrice.toLocaleString()}
              </span>
              {hasSale && (
                <span className="text-base font-mono text-slate-500 line-through">
                  LKR {currentPrice.toLocaleString()}
                </span>
              )}
              {hasSale && (
                <span className="text-xs font-mono font-bold text-red-400">
                  (Save LKR {(currentPrice - (currentSalePrice || 0)).toLocaleString()})
                </span>
              )}
            </div>

            {/* Stock Availability Indicator */}
            <div className="p-3 rounded-[2px] bg-[#12141F] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                      Currently Out of Stock
                    </span>
                  </>
                ) : isLowStock ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Low Stock: Only {currentStock} Left Ready to Ship
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      In Stock — Dispatched within 24 Hours
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                AUTHENTIC VALKNUT
              </span>
            </div>

            {/* 1. Colour Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold uppercase tracking-wider text-slate-300">
                    Colour: <strong className="text-white">{selectedColor}</strong>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{availableColors.length} Options</span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor.toLowerCase() === col.color.toLowerCase();
                    return (
                      <button
                        key={col.color}
                        onClick={() => setSelectedColor(col.color)}
                        className={`px-3 py-2 rounded-[2px] flex items-center gap-2 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#181B2B] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md'
                            : 'bg-[#12141F] border-white/10 hover:border-white/30 text-slate-400'
                        }`}
                        title={col.color}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: col.colorHex }}
                        >
                          {isSelected && (
                            <Check size={9} className={col.colorHex.toLowerCase().includes('fff') || col.colorHex.toLowerCase().includes('ede') ? 'text-black' : 'text-white'} />
                          )}
                        </span>
                        <span className="text-xs font-mono font-medium text-white">{col.color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Size Selector with Size Guide Trigger */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-slate-300">
                  Select Size: <strong className="text-white">{selectedSize}</strong>
                </span>
                
                {/* Size Chart Modal Trigger */}
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 font-mono font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {allPossibleSizes.map((sz) => {
                  const variantForSize = product.variants.find(
                    (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === sz
                  );
                  const isAvailableForSize = variantForSize && (variantForSize.stock ?? variantForSize.stockCount ?? 0) > 0;
                  const isSelected = selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      disabled={!isAvailableForSize}
                      onClick={() => {
                        setSelectedSize(sz);
                        setQuantity(1);
                      }}
                      className={`py-3 rounded-[2px] text-xs font-mono font-black uppercase transition-all flex flex-col items-center justify-center border cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105'
                          : isAvailableForSize
                          ? 'bg-[#12141F] border-white/10 hover:border-white/30 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-600 opacity-40 cursor-not-allowed line-through'
                      }`}
                    >
                      <span>{sz}</span>
                      <span className={`text-[8px] font-normal ${isSelected ? 'text-black/80 font-bold' : isAvailableForSize ? 'text-slate-500' : 'text-red-500/70'}`}>
                        {isAvailableForSize ? 'IN STOCK' : 'OUT'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Quantity & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center bg-[#12141F] border border-white/15 rounded-[2px] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(Math.min(currentStock || 10, 10), q + 1))}
                    disabled={quantity >= (currentStock || 10) || isOutOfStock}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 px-6 bg-[#D4AF37] hover:bg-[#E2B714] disabled:bg-white/10 disabled:text-slate-500 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}</span>
                </button>
              </div>

              {/* Buy Now Direct CTA */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-white hover:bg-slate-200 text-black font-black text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>BUY IT NOW</span>
                </button>
              )}

              {/* Bespoke Custom Studio Entry if available */}
              {product.isCustomizable && (
                <button
                  onClick={handleOpenCustomStudio}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-[#D4AF37]/10 border border-[#D4AF37]/50 text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>CUSTOMIZE GRAPHICS IN 3D STUDIO (+LKR 1,500)</span>
                </button>
              )}
            </div>

            {/* Sharing & Trust Strip */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-[#D4AF37]" />
                <span>100% Guaranteed Authentic</span>
              </div>

              {/* Share Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Share Drop</span>
                </button>

                {isShareDropdownOpen && (
                  <div className="absolute right-0 bottom-full mb-2 bg-[#12141F] border border-white/15 rounded-[2px] shadow-2xl p-2 min-w-[170px] space-y-1 z-30 animate-fade-in">
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left px-3 py-1.5 rounded-[2px] hover:bg-white/10 text-xs font-mono flex items-center gap-2 text-slate-200 hover:text-white"
                    >
                      <Copy size={13} />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full text-left px-3 py-1.5 rounded-[2px] hover:bg-white/10 text-xs font-mono flex items-center gap-2 text-slate-200 hover:text-white"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={handleShareTwitter}
                      className="w-full text-left px-3 py-1.5 rounded-[2px] hover:bg-white/10 text-xs font-mono flex items-center gap-2 text-slate-200 hover:text-white"
                    >
                      <Share2 size={13} />
                      <span>X / Twitter</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Accordion Specs: Description, Material, Shipping, Returns */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {/* 1. Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
                  Product Overview & Story
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* 2. Material & Care */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
                  Material & Care Instructions
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  <strong className="text-white">Fabric:</strong> {product.material}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  <strong className="text-white">Care:</strong> {product.careInstructions}
                </p>
              </div>

              {/* 3. Delivery & Returns Info */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Truck size={14} className="text-[#D4AF37]" />
                    <span>DELIVERY</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    2-3 days in Colombo. Islandwide 3-5 days. Free over LKR 25,000.
                  </p>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <RefreshCw size={14} className="text-[#D4AF37]" />
                    <span>7-DAY RETURN</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Hassle-free size exchange within 7 days of delivery.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Drops & Recommended Streetwear */}
        {displayRecommendations.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                  COMPLETE YOUR WARDROBE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                  RELATED PIECES & CAPSULES
                </h2>
              </div>

              <a
                href="#/shop"
                className="hidden sm:flex items-center gap-1 text-xs font-mono font-bold text-[#D4AF37] hover:underline"
              >
                <span>Browse All Shop</span>
                <ChevronRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayRecommendations.map((rec) => (
                <ProductCard
                  key={rec.id}
                  product={rec}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onAddToCart={() => {
                    const fv = rec.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
                    addToCart(rec, fv.size as any, fv.color, fv.colorHex, 1);
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />
    </div>
  );
};
