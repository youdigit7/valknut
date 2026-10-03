import React, { useState, useEffect } from 'react';
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

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currencies = ['LKR', 'USD', 'EUR', 'GBP', 'AUD'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
        : 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5'
    }`}>
      {/* Top Editorial Announcement Bar */}
      <div className="bg-[#0E1017] border-b border-white/5 py-2.5 px-5 sm:px-6 lg:px-8 text-center w-full">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between text-[11px] font-mono font-bold tracking-[0.2em] text-slate-400">
          <span className="hidden sm:inline text-slate-500">COLOMBO / WORLDWIDE</span>
          <p className="text-white text-center flex-1 sm:flex-none uppercase">
            <span className="text-[#D4AF37] font-black mr-1.5">DROP 04 LIVE</span> — FREE WORLDWIDE SHIPPING OVER LKR 25,000
          </p>
          <span className="hidden sm:inline text-[#D4AF37]">VALKNUT OFFICIAL</span>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="w-full">
        <div className="max-w-[1800px] mx-auto px-5 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Mobile Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Center/Left: Brand Logo */}
          <div 
            onClick={() => handleNavigate('#/', 'ALL')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 border-[1.5px] border-[#D4AF37]/80 flex items-center justify-center rounded-[2px] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
              <span className="text-[#D4AF37] font-syne text-sm sm:text-base font-black">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-[0.25em] text-white font-syne leading-none">
                VALKNUT
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] text-slate-400 mt-0.5">
                OFFICIAL
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Shop, Collections, Men, Women, Essentials, Custom Studio) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            <button 
              onClick={() => handleNavigate('#/shop', 'ALL')}
              className={`text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer ${
                activeCategory === 'ALL' && window.location.hash.startsWith('#/shop') && !window.location.hash.includes('/men') && !window.location.hash.includes('/women') && !window.location.hash.includes('/essentials')
                  ? 'text-[#D4AF37]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              SHOP
            </button>
            <button 
              onClick={() => handleNavigate('#/shop?collection=DARK+SOVEREIGN+2026', 'ALL')}
              className="text-[11px] font-bold tracking-[0.18em] uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <button 
              onClick={() => handleNavigate('#/shop/men', 'MEN')}
              className={`text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer ${
                window.location.hash.includes('men') ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
              }`}
            >
              MEN
            </button>
            <button 
              onClick={() => handleNavigate('#/shop/women', 'WOMEN')}
              className={`text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer ${
                window.location.hash.includes('women') ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
              }`}
            >
              WOMEN
            </button>
            <button 
              onClick={() => handleNavigate('#/shop/essentials', 'ESSENTIALS')}
              className={`text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer ${
                window.location.hash.includes('essentials') ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
              }`}
            >
              ESSENTIALS
            </button>
            <button 
              onClick={() => handleNavigate('#/custom-studio')}
              className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#D4AF37] hover:text-[#E2B714] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span>CUSTOM STUDIO</span>
            </button>
          </nav>

          {/* Right Side: Search, Currency, Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector (Desktop) */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-slate-300 hover:text-white text-[11px] font-mono font-bold tracking-wider transition-colors px-2 py-1.5 border border-white/5 rounded-[2px]"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown size={12} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#12141E] border border-white/10 rounded-[2px] shadow-2xl py-1 min-w-[90px] animate-fade-in z-50">
                  {currencies.map(c => (
                    <button 
                      key={c}
                      onClick={() => { setSelectedCurrency(c); setShowCurrencyDropdown(false); }}
                      className={`block w-full text-left px-4 py-2 text-xs font-mono font-semibold transition-colors ${
                        c === selectedCurrency ? 'text-[#D4AF37] bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#12141F] border border-white/10 hover:border-[#D4AF37]/50 rounded-[2px] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              title="Search Catalog (Ctrl + K)"
            >
              <Search size={15} className="text-[#D4AF37]" />
              <span className="text-slate-400">Search...</span>
              <kbd className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
            </button>

            {/* Account */}
            <IconButton
              icon={<User size={18} />}
              label="Customer Account"
              onClick={() => setIsAccountOpen(true)}
            />

            {/* Wishlist */}
            <a 
              href="#/lookbook" 
              className="hidden sm:inline-flex"
              aria-label="Wishlist & Lookbook"
            >
              <IconButton
                icon={<Heart size={18} />}
                label="Wishlist"
              />
            </a>

            {/* Shopping Cart */}
            <IconButton
              icon={<ShoppingBag size={18} />}
              label="Shopping Bag"
              badge={cartItemsCount > 0 ? cartItemsCount : undefined}
              variant="secondary"
              onClick={() => setIsCartOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Premium Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#0E1017] border-r border-white/10 shadow-2xl flex flex-col z-10 animate-slide-right">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#12141E]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 border border-[#D4AF37] flex items-center justify-center rounded-[2px]">
                  <span className="text-[#D4AF37] font-syne text-xs font-black">V</span>
                </div>
                <span className="text-base font-extrabold tracking-[0.2em] text-white font-syne">
                  VALKNUT
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-3">
                  SHOP CATEGORIES
                </p>
                <button 
                  onClick={() => handleNavigate('#/shop', 'ALL')} 
                  className="w-full text-left py-3 border-b border-white/5 text-sm font-bold tracking-[0.14em] text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>SHOP ALL</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => handleNavigate('#/shop/men', 'MEN')} 
                  className="w-full text-left py-3 border-b border-white/5 text-sm font-bold tracking-[0.14em] text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>MEN</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => handleNavigate('#/shop/women', 'WOMEN')} 
                  className="w-full text-left py-3 border-b border-white/5 text-sm font-bold tracking-[0.14em] text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>WOMEN</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => handleNavigate('#/shop/essentials', 'ESSENTIALS')} 
                  className="w-full text-left py-3 border-b border-white/5 text-sm font-bold tracking-[0.14em] text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>ESSENTIALS & ACCESSORIES</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => handleNavigate('#/custom-studio')} 
                  className="w-full text-left py-3 border-b border-white/5 text-sm font-extrabold tracking-[0.14em] text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} />
                    CUSTOM STUDIO
                  </span>
                  <ChevronRight size={16} className="text-[#D4AF37]" />
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
                  DISCOVER VALKNUT
                </p>
                <a 
                  href="#/brand-story" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white"
                >
                  OUR STORY
                </a>
                <a 
                  href="#/lookbook" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white"
                >
                  LOOKBOOK
                </a>
                <a 
                  href="#/size-guide" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white"
                >
                  SIZE GUIDE
                </a>
                <a 
                  href="#/track-order" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 text-xs font-bold tracking-wider text-slate-300 hover:text-white"
                >
                  TRACK YOUR ORDER
                </a>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-white/10 bg-[#12141E]/40 space-y-3">
              <p className="text-[11px] font-mono text-slate-400">
                &ldquo;OWN YOUR MIND. CONTROL YOUR WORLD.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Currency: <strong className="text-white">{selectedCurrency}</strong></span>
                <span className="text-[#D4AF37]">Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
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
