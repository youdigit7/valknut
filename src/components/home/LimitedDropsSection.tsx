import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart } from 'lucide-react';

export const LimitedDropsSection: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  
  const limitedProducts = products.filter(p => p.isLimitedEdition).slice(0, 2);
  
  // Countdown timer - set to 5 days from now
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, mins: 31, secs: 7 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs -= 1;
        if (secs < 0) { secs = 59; mins -= 1; }
        if (mins < 0) { mins = 59; hours -= 1; }
        if (hours < 0) { hours = 23; days -= 1; }
        if (days < 0) { days = 0; hours = 0; mins = 0; secs = 0; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (limitedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left - Text + Countdown */}
          <div className="space-y-6">
            <span className="text-[#d4af37] text-[11px] font-bold tracking-[0.25em] uppercase block">
              NUMBERED RUNS
            </span>
            
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-syne tracking-tight leading-[0.95]">
              LIMITED DROPS
            </h2>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Made once, never repeated. Club members get 24 hours of early access before public release.
            </p>
            
            {/* Countdown Timer */}
            <div className="flex gap-3 pt-4">
              {[
                { val: timeLeft.days.toString().padStart(2, '0'), label: 'DAYS' },
                { val: timeLeft.hours.toString().padStart(2, '0'), label: 'HOURS' },
                { val: timeLeft.mins.toString().padStart(2, '0'), label: 'MINS' },
                { val: timeLeft.secs.toString().padStart(2, '0'), label: 'SECS' },
              ].map(({ val, label }) => (
                <div key={label} className="w-16 h-20 bg-[#12141e] border border-white/10 rounded flex flex-col items-center justify-center">
                  <span className="text-[#d4af37] text-2xl font-black font-syne">{val}</span>
                  <span className="text-slate-500 text-[9px] font-bold tracking-[0.15em] uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Limited Product Cards */}
          <div className="grid grid-cols-2 gap-4">
            {limitedProducts.map((product) => {
              const uniqueColors = [...new Set(product.variants.map(v => v.color))].slice(0, 3);
              const totalStock = product.variants.reduce((acc, v) => acc + (v.stock ?? v.stockCount ?? 0), 0);
              const stockLabel = totalStock === 0 ? 'SOLD OUT' : totalStock < 10 ? 'LOW STOCK' : null;
              
              return (
                <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="relative aspect-[3/4] bg-[#12141e] border border-white/5 rounded overflow-hidden mb-3">
                    <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase rounded-sm">
                      LIMITED DROP
                    </div>
                    <button className="absolute top-3 right-3 z-10 p-1.5 text-slate-500 hover:text-[#d4af37] transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Heart size={16} />
                    </button>
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                      <span className="text-[#d4af37] text-[10px] tracking-[0.2em] uppercase font-bold mb-2">IMAGE</span>
                      <span className="text-slate-400 text-xs text-center">{product.name} — front on model</span>
                      <span className="text-slate-500 text-[10px] mt-1">Hover swaps to back-view shot</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors leading-tight">{product.name}</h3>
                      {stockLabel && <span className="text-red-400 text-[9px] font-bold tracking-[0.1em] uppercase whitespace-nowrap">{stockLabel}</span>}
                    </div>
                    <p className="text-slate-500 text-[10px] tracking-wide">{product.subCategory} · {product.category}</p>
                    <span className="text-white text-sm font-bold block">Rs{product.price.toLocaleString()}</span>
                    {uniqueColors.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {uniqueColors.map(color => (
                          <span key={color} className="px-2 py-0.5 text-[8px] font-semibold tracking-wider text-slate-400 border border-white/10 rounded-sm uppercase">{color}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
