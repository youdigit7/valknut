import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Truck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    window.location.hash = '#/checkout';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e1017] border-l border-white/10 text-white shadow-2xl flex flex-col justify-between animate-slide-right">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-[#d4af37]" size={22} />
              <h3 className="text-lg font-bold uppercase tracking-wider font-syne">
                YOUR SHOPPING BAG
              </h3>
              <span className="text-xs bg-[#d4af37] text-black font-extrabold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>

            <button 
              onClick={() => setIsCartOpen(false)} 
              className="text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close Shopping Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#141620] px-6 py-3 border-b border-white/5">
            {cartSubtotal >= 10000 ? (
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Truck size={15} />
                <span>CONGRATULATIONS! YOU QUALIFY FOR FREE ISLANDWIDE SHIPPING</span>
              </p>
            ) : (
              <div>
                <p className="text-[11px] text-slate-300 font-semibold mb-1">
                  Add <strong className="text-[#d4af37]">LKR {(10000 - cartSubtotal).toLocaleString()}</strong> more for FREE Shipping!
                </p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#e2b714] transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 10000) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/5">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-sm font-bold text-slate-300">Your shopping bag is currently empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-gold text-xs py-2.5 px-6"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.customization?.finalPreviewDataUrl || item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded bg-[#141620] border border-white/10 flex-shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white line-clamp-1 pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                        <p>Size: <strong className="text-white">{item.selectedSize}</strong> | Colour: <strong className="text-white">{item.selectedColor}</strong></p>
                        
                        {item.customization && (
                          <div className="mt-1.5 p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] text-[#D4AF37] space-y-0.5 font-mono">
                            <div className="flex items-center gap-1 font-bold">
                              <Sparkles size={11} />
                              <span>Bespoke: {item.customization.printTechnique}</span>
                            </div>
                            <div className="text-slate-300 flex items-center justify-between text-[9px]">
                              <span>Zone: {item.customization.placement.replace('_', ' ')}</span>
                              {item.customization.customText && <span className="truncate max-w-[120px]">"{item.customization.customText}"</span>}
                            </div>
                            {item.customization.uploadedArtworkUrl && (
                              <div className="text-[9px] text-emerald-400 flex items-center gap-1 pt-0.5">
                                <span>✓ Custom Graphic Uploaded</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <div className="flex items-center border border-white/20 rounded bg-white/5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-white">
                        LKR {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#08090d] border-t border-white/10 space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded flex items-center justify-between text-xs text-emerald-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Tag size={14} />
                      <span>COUPON APPLIED: '{appliedCoupon.code}'</span>
                    </span>
                    <button onClick={removeCoupon} className="text-xs text-red-400 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. VALKNUT10)"
                      className="flex-1 bg-[#141620] border border-white/20 rounded px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                    />
                    <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold">
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-400 mt-1 font-semibold">{couponError}</p>}
              </div>

              {/* Price Totals Summary */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">LKR {cartSubtotal.toLocaleString()}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-semibold">- LKR {cartDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping:</span>
                  <span className="font-semibold text-white">
                    {cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>TOTAL:</span>
                  <span className="text-lg text-[#d4af37]">LKR {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons: Proceed to Checkout & View Bag */}
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full btn-gold py-4 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.hash = '#/cart';
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold rounded-[2px] border border-white/10 transition-colors cursor-pointer text-center block"
                >
                  VIEW FULL SHOPPING BAG
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
