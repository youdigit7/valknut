import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    products,
    setSelectedProduct,
    addToCart
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const FREE_SHIPPING_LIMIT = 10000;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_LIMIT) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleProceedCheckout = () => {
    window.location.hash = '#/checkout';
  };

  // Recommended pieces
  const cartProductIds = cart.map((c) => c.productId);
  const recommendedDrops = products
    .filter((p) => !cartProductIds.includes(p.id))
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] py-8 sm:py-12 border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-6">
          <a href="#/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={12} className="text-slate-600" />
          <a href="#/shop" className="hover:text-white transition-colors">Shop</a>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-[#D4AF37] font-bold">Shopping Bag ({totalItemCount})</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
              YOUR SELECTED PIECES
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
              SHOPPING BAG
            </h1>
          </div>

          <a
            href="#/shop"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>CONTINUE EXPLORING</span>
          </a>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="py-16 bg-[#0E1017] border border-white/10 rounded-md p-8 text-center space-y-6">
            <EmptyState
              title="YOUR SHOPPING BAG IS EMPTY"
              description="Looks like you haven't added any luxury streetwear garments or bespoke items to your bag yet."
              actionText="BROWSE LATEST DROPS"
              onAction={() => {
                window.location.hash = '#/shop';
              }}
            />

            {/* Quick Best Sellers Suggestion */}
            {recommendedDrops.length > 0 && (
              <div className="pt-12 border-t border-white/10 text-left max-w-5xl mx-auto space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-white font-syne">
                  TRENDING VALKNUT DROPS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedDrops.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={(prod) => setSelectedProduct(prod)}
                      onAddToCart={() => {
                        const fv = p.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
                        addToCart(p, fv.size as any, fv.color, fv.colorHex, 1);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Main Cart Content: 2-Column Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            
            {/* Left Column (8 Cols): Items List & Free Shipping Meter */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Progress Meter */}
              <div className="p-4 sm:p-5 bg-[#0E1017] border border-white/10 rounded-md space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <Truck size={16} className="text-[#D4AF37]" />
                    {cartSubtotal >= FREE_SHIPPING_LIMIT ? (
                      <span className="text-emerald-400">YOU QUALIFY FOR FREE ISLANDWIDE SHIPPING!</span>
                    ) : (
                      <span>
                        Add <strong className="text-[#D4AF37]">LKR {(FREE_SHIPPING_LIMIT - cartSubtotal).toLocaleString()}</strong> more for FREE Shipping!
                      </span>
                    )}
                  </span>
                  <span className="text-slate-400 font-normal">
                    Target: LKR {FREE_SHIPPING_LIMIT.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E2B714] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List Card */}
              <div className="bg-[#0E1017] border border-white/10 rounded-md divide-y divide-white/5 overflow-hidden shadow-xl">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                    
                    {/* Item Thumbnail & Basic Info */}
                    <div className="flex gap-4 items-center flex-1 min-w-0">
                      <a
                        href={`#/product/${item.product.slug}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-[2px] overflow-hidden bg-[#141620] border border-white/10 flex-shrink-0 relative block group"
                      >
                        <img
                          src={item.customization?.finalPreviewDataUrl || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </a>

                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase block">
                          {item.product.subCategory}
                        </span>

                        <a
                          href={`#/product/${item.product.slug}`}
                          className="text-sm sm:text-base font-bold text-white uppercase font-heading hover:text-[#D4AF37] transition-colors truncate block"
                        >
                          {item.product.name}
                        </a>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-0.5 flex-wrap">
                          <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            Colour: <strong className="text-white">{item.selectedColor}</strong>
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/30 inline-block"
                              style={{ backgroundColor: item.selectedColorHex }}
                            />
                          </span>
                        </div>

                        {/* Custom Studio Label */}
                        {item.customization && (
                          <div className="mt-2 p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-[2px] text-[11px] font-mono text-[#D4AF37] space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Sparkles size={12} />
                              <span>Bespoke: {item.customization.printTechnique} ({item.customization.placement.replace('_', ' ')})</span>
                            </div>
                            <div className="text-slate-300 text-[10px] flex flex-wrap gap-x-4">
                              {item.customization.customText && <span>Text: "{item.customization.customText}"</span>}
                              {item.customization.textFont && <span>Font: {item.customization.textFont}</span>}
                              {item.customization.uploadedArtworkUrl && <span className="text-emerald-400">✓ Custom Artwork Attached</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-[#131520] border border-white/15 rounded-[2px] p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Total and Trash */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black font-mono text-white block">
                            LKR {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] font-mono text-slate-500 block">
                              LKR {item.unitPrice.toLocaleString()} each
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-[2px] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Trust Features Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#0E1017] border border-white/5 rounded-[2px] flex items-center gap-2.5 text-xs font-mono text-slate-300">
                  <Truck size={16} className="text-[#D4AF37]" />
                  <span>Fast 2-3 Day Colombo Delivery</span>
                </div>
                <div className="p-3.5 bg-[#0E1017] border border-white/5 rounded-[2px] flex items-center gap-2.5 text-xs font-mono text-slate-300">
                  <ShieldCheck size={16} className="text-[#D4AF37]" />
                  <span>100% Guaranteed Heavy Cotton</span>
                </div>
                <div className="p-3.5 bg-[#0E1017] border border-white/5 rounded-[2px] flex items-center gap-2.5 text-xs font-mono text-slate-300">
                  <CheckCircle size={16} className="text-[#D4AF37]" />
                  <span>7-Day Hassle-Free Exchange</span>
                </div>
              </div>

            </div>

            {/* Right Column (4 Cols): Order Summary & Checkout Panel */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 shadow-2xl space-y-6">
                
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white font-syne border-b border-white/10 pb-4">
                  ORDER SUMMARY
                </h3>

                {/* Promo Code Applicator */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block font-bold">
                    PROMO CODE
                  </span>

                  {appliedCoupon ? (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-[2px] flex items-center justify-between text-xs text-emerald-400 font-mono">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Tag size={14} />
                        <span>'{appliedCoupon.code}' APPLIED</span>
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="e.g. VALKNUT10"
                        className="flex-1 bg-[#141620] border border-white/15 focus:border-[#D4AF37] rounded-[2px] px-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-[2px] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-mono ${couponMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span>Bag Subtotal:</span>
                    <strong className="text-white font-bold">LKR {cartSubtotal.toLocaleString()}</strong>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon:</span>
                      <strong>- LKR {cartDiscount.toLocaleString()}</strong>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping:</span>
                    <strong className={cartShipping === 0 ? 'text-emerald-400' : 'text-white'}>
                      {cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}
                    </strong>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/10 font-mono">
                    <span className="font-syne uppercase">ESTIMATED TOTAL:</span>
                    <span className="text-lg text-[#D4AF37]">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={16} />
                </button>

                {/* Payment Options Supported */}
                <div className="pt-2 text-center space-y-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
                    ACCEPTED PAYMENT GATEWAYS
                  </span>
                  <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-[2px]">Koko BNPL (3x 0%)</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-[2px]">OnePay</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-[2px]">Cash on Delivery</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
