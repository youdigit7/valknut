import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import type { CategoryType } from '../../types/ecommerce';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart,
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { SearchModal } from '../shop/SearchModal';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsAccountOpen, 
    activeCategory,
    setActiveCategory
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('LKR');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currencies = ['LKR', 'USD', 'EUR', 'GBP', 'AUD'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };
    if (showCurrencyDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCurrencyDropdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCurrencyDropdown(false);
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (hash: string, category?: CategoryType | 'ALL') => {
    if (category) {
      setActiveCategory(category);
    }
    window.location.hash = hash;
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#06070a]/95 backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] border-b border-white/10' 
        : 'bg-[#06070a]/80 backdrop-blur-xl border-b border-white/[0.08]'
    }`}>
      {/* Top Banner */}
      <div className="bg-[#020202] border-b border-white/[0.05] py-1.5 px-3 sm:px-6 lg:px-8 text-center w-full z-50">
        <div className="max-w-[2000px] mx-auto flex items-center justify-between text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.15em] sm:tracking-[0.2em]">
          <span className="hidden md:inline-flex items-center gap-2 text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
            COLOMBO ARCHIVES
          </span>
          <p className="text-slate-200 text-center flex-1 md:flex-none uppercase truncate px-2">
            <span className="text-[#D4AF37] font-bold">DROP 04 LIVE</span>
            <span className="text-white/20 mx-1.5 sm:mx-3">—</span>
            <span className="hidden sm:inline">COMPLIMENTARY SHIPPING OVER LKR 25,000</span>
            <span className="sm:hidden">FREE SHIP &gt; LKR 25K</span>
          </p>
          <span className="hidden md:inline text-slate-400 font-medium">
            GLOBAL DISPATCH
          </span>
        </div>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            DESKTOP NAVBAR (Hidden on mobile/tablet)
            ========================================================================= */}
        <div className="hidden lg:flex max-w-[2000px] mx-auto h-20 items-center justify-between gap-4 xl:gap-8">
          
          {/* LEFT: LOGO */}
          <div 
            onClick={() => handleNavigate('#/', 'ALL')}
            className="flex items-center gap-3.5 group select-none cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e2235] via-[#10121d] to-black border border-white/20 group-hover:border-[#D4AF37]/80 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300">
              <span className="text-[#D4AF37] font-heading text-base font-black tracking-tighter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">V</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-heading font-black tracking-[0.22em] text-white leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#D4AF37] transition-all duration-300">
                VALKNUT
              </span>
              <span className="text-[8px] font-mono tracking-[0.4em] text-slate-400 mt-1 uppercase font-semibold">
                OFFICIAL
              </span>
            </div>
          </div>

          {/* CENTER: NAV LINKS */}
          <nav className="flex items-center justify-center gap-1 xl:gap-2 p-1.5 rounded-full bg-[#0a0a0a]/60 border border-white/10 shadow-[inset_0_1px_10px_rgba(0,0,0,0.8),0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md shrink-1 overflow-hidden">
            {[
              { label: 'SHOP', hash: '#/shop', cat: 'ALL' },
              { label: 'COLLECTIONS', hash: '#/shop?collection=DARK+SOVEREIGN+2026', cat: 'ALL' },
              { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
              { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
              { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
            ].map(item => {
              const isActive = (item.cat === 'ALL' && activeCategory === 'ALL' && window.location.hash.startsWith('#/shop') && !window.location.hash.includes('/men') && !window.location.hash.includes('/women') && !window.location.hash.includes('/essentials')) ||
                (item.cat !== 'ALL' && (activeCategory === item.cat || window.location.hash.includes(item.cat.toLowerCase())));
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')}
                  className={`relative px-3 xl:px-5 py-2 text-[9px] xl:text-xs font-bold tracking-[0.12em] xl:tracking-[0.15em] uppercase rounded-full transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-[#0A0A0A] bg-gradient-to-r from-[#D4AF37] to-[#f3e5ab] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                  }`}
                >
                  <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
            
            <div className="h-4 w-px bg-white/10 mx-0.5 xl:mx-1 shrink-0" />

            <button 
              onClick={() => handleNavigate('#/custom-studio')}
              className="group relative px-3 xl:px-5 py-2 rounded-full bg-black border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] text-[9px] xl:text-xs font-bold tracking-[0.12em] xl:tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-1.5 xl:gap-2 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles size={12} className="text-[#D4AF37] animate-pulse relative z-10" />
              <span className="relative z-10 group-hover:text-[#f3e5ab] transition-colors whitespace-nowrap">STUDIO</span>
            </button>
          </nav>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center justify-end gap-2 xl:gap-3 shrink-0">
            
            <div ref={currencyRef} className="relative z-50">
              <button 
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 h-10 px-3 xl:px-3.5 text-slate-300 hover:text-white text-[10px] xl:text-[11px] font-mono font-bold tracking-wider rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 text-slate-400 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#0a0b10]/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 min-w-[120px] animate-fade-in overflow-hidden">
                  {currencies.map(c => (
                    <button 
                      key={c}
                      onClick={() => { setSelectedCurrency(c); setShowCurrencyDropdown(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
                        c === selectedCurrency ? 'text-[#D4AF37] bg-white/[0.08] pl-6 relative' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {c === selectedCurrency && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]" />}
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowCurrencyDropdown(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 h-10 pl-3.5 pr-2.5 xl:pr-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF37]/50 rounded-full text-slate-300 hover:text-white text-xs transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)] group cursor-pointer"
              title="Search Catalog (Ctrl + K)"
            >
              <Search size={14} className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-slate-400 group-hover:text-slate-200 text-[10px] xl:text-[11px] tracking-wide">Search...</span>
              <kbd className="hidden xl:inline-block ml-1 text-[9px] text-slate-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5 font-mono shadow-inner">⌘K</kbd>
            </button>

            <IconButton
              icon={<User size={18} />}
              label="Account"
              variant="secondary"
              onClick={() => setIsAccountOpen(true)}
            />

            <a href="#/lookbook" aria-label="Wishlist">
              <IconButton
                icon={<Heart size={18} />}
                label="Wishlist"
                variant="secondary"
              />
            </a>

            <IconButton
              icon={<ShoppingBag size={18} />}
              label="Bag"
              badge={cartItemsCount > 0 ? cartItemsCount : undefined}
              variant="secondary"
              onClick={() => setIsCartOpen(true)}
            />
          </div>
        </div>


        {/* =========================================================================
            MOBILE/TABLET NAVBAR (Hidden on desktop)
            ========================================================================= */}
        <div className="flex lg:hidden max-w-[2000px] mx-auto h-[4.5rem] items-center justify-between relative">
          
          {/* MOBILE LEFT */}
          <div className="flex items-center gap-1.5 sm:gap-2 z-10 w-1/3 justify-start">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-95"
              aria-label="Menu"
            >
              <Menu size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-95"
              aria-label="Search"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* MOBILE CENTER: LOGO (Absolutely Centered) */}
          <div 
            onClick={() => handleNavigate('#/', 'ALL')}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group select-none cursor-pointer z-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#1e2235] via-[#10121d] to-black border border-white/20 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.8)] shrink-0 active:scale-95 transition-transform">
              <span className="text-[#D4AF37] font-heading text-sm font-black tracking-tighter">V</span>
            </div>
            <div className="flex flex-col justify-center hidden min-[360px]:flex">
              <span className="text-sm sm:text-base font-heading font-black tracking-[0.2em] text-white leading-none">
                VALKNUT
              </span>
            </div>
          </div>

          {/* MOBILE RIGHT */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 z-10 w-1/3">
            <div className="hidden sm:block">
              <IconButton
                icon={<User size={18} />}
                label="Account"
                variant="secondary"
                onClick={() => setIsAccountOpen(true)}
              />
            </div>
            
            <IconButton
              icon={<ShoppingBag size={18} />}
              label="Bag"
              badge={cartItemsCount > 0 ? cartItemsCount : undefined}
              variant="secondary"
              onClick={() => setIsCartOpen(true)}
            />
          </div>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-[#06070a] border-r border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 animate-slide-right">
            
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e2235] via-[#10121d] to-black border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <span className="text-[#D4AF37] font-heading text-sm font-black">V</span>
                </div>
                <span className="text-base font-black tracking-[0.2em] text-white font-heading">
                  VALKNUT
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.03] hover:bg-white/[0.08] transition-colors border border-white/5"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6">
              
              {/* Mobile Search Input directly in menu */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search collections..."
                  readOnly
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full bg-[#10121d] border border-white/10 rounded-full py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors shadow-inner cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-4 pl-1">
                  COLLECTIONS
                </p>
                {[
                  { label: 'SHOP ALL', hash: '#/shop', cat: 'ALL' },
                  { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
                  { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
                  { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
                ].map(item => (
                  <button 
                    key={item.label}
                    onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')} 
                    className="w-full text-left py-3.5 px-4 rounded-xl text-[11px] sm:text-xs font-bold tracking-[0.15em] text-slate-300 hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-[#D4AF37] transition-colors" />
                  </button>
                ))}
                <button 
                  onClick={() => handleNavigate('#/custom-studio')} 
                  className="w-full text-left py-3.5 px-4 mt-2 rounded-xl text-[11px] sm:text-xs font-extrabold tracking-[0.15em] text-[#0A0A0A] bg-gradient-to-r from-[#D4AF37] to-[#f3e5ab] shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} />
                    CUSTOM STUDIO
                  </span>
                  <ChevronRight size={14} className="text-[#0A0A0A]/60" />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1">
                <p className="text-[9px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase mb-3 pl-1">
                  DISCOVER
                </p>
                <a href="#/brand-story" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all">OUR STORY</a>
                <a href="#/lookbook" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all">LOOKBOOK</a>
                <a href="#/size-guide" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all">SIZE GUIDE</a>
                <a href="#/track-order" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all">TRACK ORDER</a>
                
                {/* Mobile Account Access */}
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsAccountOpen(true); }}
                  className="w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:bg-white/[0.02] transition-all flex items-center gap-2"
                >
                  <User size={14} /> MY ACCOUNT
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-white/[0.05] bg-gradient-to-t from-black to-transparent">
              <div className="mb-4">
                <label className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-500 uppercase block mb-2">CURRENCY</label>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-[#10121d] border border-white/10 rounded-lg py-2 px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 appearance-none"
                >
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 italic">
                &ldquo;OWN YOUR MIND. CONTROL YOUR WORLD.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToShop={(term) => {
          window.location.hash = `#/shop?q=${encodeURIComponent(term)}`;
        }}
      />
    </header>
  );
};

