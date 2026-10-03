import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#08090C] text-slate-400 border-t border-white/10 font-sans">
      
      {/* Top Editorial Banner */}
      <div className="border-b border-white/5 py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 bg-[#0A0C10] w-full">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center lg:text-left">
          <div>
            <span className="text-[#D4AF37] text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase block mb-1.5 sm:mb-2">
              THE VALKNUT CREED
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase font-syne tracking-tight break-words">
              &ldquo;OWN YOUR MIND. CONTROL YOUR WORLD.&rdquo;
            </h3>
          </div>

          {/* Newsletter Form */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full mx-auto lg:mx-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                required
                className="bg-[#12141E] border border-white/15 px-4 py-3 sm:py-3.5 text-xs text-white placeholder-slate-500 font-mono rounded-[2px] focus:outline-none focus:border-[#D4AF37] w-full min-w-0 sm:w-72 lg:w-80"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-black uppercase tracking-[0.14em] px-5 sm:px-6 py-3 sm:py-3.5 rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check size={16} />
                    <span>JOINED</span>
                  </>
                ) : (
                  <>
                    <span>JOIN CLUB</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-[#D4AF37] font-mono mt-2 text-center lg:text-left">
                ✓ You have been added to the VIP drop list.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1800px] mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border-[1.5px] border-[#D4AF37]/80 flex items-center justify-center rounded-[2px]">
                <span className="text-[#D4AF37] font-syne text-base font-black">V</span>
              </div>
              <span className="text-xl font-black tracking-[0.25em] text-white font-syne">
                VALKNUT
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              High-end streetwear rooted in Norse symbolism and modern minimalism. Designed in Sri Lanka and engineered for the world.
            </p>

            {/* Social Icons (Instagram, TikTok, Facebook, WhatsApp) */}
            <div className="flex gap-2 pt-2">
              {/* Instagram */}
              <a 
                href="https://instagram.com/valknutofficial1" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
                aria-label="VALKNUT on Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://tiktok.com/@valknutofficial5" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
                aria-label="VALKNUT on TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.18 8.18 0 004.76 1.52V7.05a4.82 4.82 0 01-1-.36z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com/valknutofficial" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
                aria-label="VALKNUT on Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/94770000000" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-white/5 transition-all"
                aria-label="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-[#D4AF37] text-[11px] font-mono font-bold tracking-[0.2em] uppercase">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#/shop" className="hover:text-white transition-colors">All Products</a></li>
              <li><a href="#/category/men" className="hover:text-white transition-colors">Men Collection</a></li>
              <li><a href="#/category/women" className="hover:text-white transition-colors">Women Collection</a></li>
              <li><a href="#/category/essentials" className="hover:text-white transition-colors">Essentials & Accessories</a></li>
              <li><a href="#/custom-studio" className="text-[#D4AF37] hover:text-[#E2B714] font-bold transition-colors">Custom Studio</a></li>
              <li><a href="#/shop" className="hover:text-white transition-colors">New Drops</a></li>
            </ul>
          </div>

          {/* Col 3: Brand */}
          <div className="space-y-3">
            <h4 className="text-[#D4AF37] text-[11px] font-mono font-bold tracking-[0.2em] uppercase">
              BRAND
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#/brand-story" className="hover:text-white transition-colors">About VALKNUT</a></li>
              <li><a href="#/brand-story" className="hover:text-white transition-colors">Brand Story</a></li>
              <li><a href="#/lookbook" className="hover:text-white transition-colors">Lookbook 2024</a></li>
              <li><a href="#/sri-lanka-streetwear" className="hover:text-white transition-colors">Sri Lanka Streetwear</a></li>
              <li><a href="#/brand-story" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 4: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-[#D4AF37] text-[11px] font-mono font-bold tracking-[0.2em] uppercase">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#/track-order" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#/size-guide" className="hover:text-white transition-colors">Size Guide & Fit</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Shipping Information</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Exchange & Returns</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Col 5: Policies */}
          <div className="space-y-3">
            <h4 className="text-[#D4AF37] text-[11px] font-mono font-bold tracking-[0.2em] uppercase">
              POLICIES & LEGAL
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#/shipping-returns" className="hover:text-white transition-colors">Payment Security</a></li>
              <li><a href="#/admin" className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-mono text-[11px] pt-1"><span>✦ Executive Admin</span></a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="border-t border-white/5 bg-[#050608] w-full">
        <div className="max-w-[1800px] mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[11px] font-mono">
            &copy; {new Date().getFullYear()} VALKNUT Official. All rights reserved. Built in Colombo.
          </p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">ACCEPTED:</span>
            {['Visa', 'Mastercard', 'Koko', 'MintPay', 'Bank Transfer', 'COD'].map(method => (
              <span 
                key={method}
                className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-slate-300 border border-white/10 rounded-[2px] bg-[#12141E]"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
