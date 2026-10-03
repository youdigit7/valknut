import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/ecommerce';
import { searchCatalog } from '../../services/productService';
import { 
  Search, 
  X, 
  ArrowRight, 
  TrendingUp, 
  Tag, 
  Layers, 
  Package,
  Eye,
  CornerDownLeft
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToShop?: (searchTerm: string) => void;
}

const TRENDING_SEARCHES = [
  '480GSM Sovereign Hoodie',
  'Celestial Mountain',
  'Mind Control Oversized',
  'Acid Wash',
  'Tactical Crossbody',
  'Cordura 1000D',
  'Femme Crop Hoodie',
  'Pump Cover'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToShop
}) => {
  const { products, setSelectedProduct, setSearchQuery: setGlobalSearchQuery } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSelectedTag(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global shortcut listeners (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search
  useEffect(() => {
    const effectiveQuery = selectedTag ? `${query} ${selectedTag}`.trim() : query.trim();
    if (!effectiveQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const matches = await searchCatalog(effectiveQuery, products, 8);
      setResults(matches);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, selectedTag, products]);

  if (!isOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    onClose();
  };

  const handleViewAllResults = () => {
    const term = query.trim();
    setGlobalSearchQuery(term);
    if (onNavigateToShop) {
      onNavigateToShop(term);
    } else {
      window.location.hash = term ? `#/shop?search=${encodeURIComponent(term)}` : '#/shop';
    }
    onClose();
  };

  const handleApplyTrending = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-start p-3 sm:p-6 md:pt-16 overflow-y-auto">
        <div 
          className="w-full max-w-3xl bg-[#0D0E14] border border-white/15 rounded-md shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Bar */}
          <div className="relative p-4 sm:p-5 border-b border-white/10 bg-[#12141F]/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <Search size={20} />
            </div>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleViewAllResults();
                  }
                }}
                placeholder="Search by name, SKU (VK-HD-...), tags, category, or collection..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-sans font-medium focus:outline-none tracking-wide"
              />
            </div>

            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-[2px] transition-colors"
                title="Clear input"
              >
                <X size={18} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider"
              aria-label="Close search"
            >
              <span className="hidden sm:inline text-slate-500">ESC</span>
              <X size={20} />
            </button>
          </div>

          {/* Tag Quick Filters */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#0A0A0C] border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 flex-shrink-0 mr-1">
              <Layers size={11} className="text-[#D4AF37]" />
              Quick:
            </span>
            {['All', 'Hoodies', 'Oversized Tees', 'Joggers', 'Accessories', 'Men', 'Women'].map((tag) => {
              const isActive = (tag === 'All' && !selectedTag) || selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'All' || selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-[2px] text-xs font-mono font-medium transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Modal Body / Results */}
          <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 font-mono text-xs">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                <span>Searching catalog...</span>
              </div>
            )}

            {/* Results List */}
            {!isLoading && (query.trim() !== '' || selectedTag) && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-xs font-mono text-slate-400">
                  <span className="font-bold tracking-wider uppercase text-white">
                    Found {results.length} {results.length === 1 ? 'Product' : 'Products'}
                  </span>
                  {results.length > 0 && (
                    <button
                      onClick={handleViewAllResults}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider"
                    >
                      <span>Explore all in Shop</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Package size={36} className="mx-auto text-slate-600" />
                    <p className="text-sm font-semibold text-white uppercase tracking-wider">
                      No matching products found
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try searching with broader terms like &ldquo;hoodie&rdquo;, &ldquo;tee&rdquo;, &ldquo;black&rdquo;, or browse all collections.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        setSelectedTag(null);
                      }}
                      className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white rounded-[2px] transition-colors"
                    >
                      Clear Search Query
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((product) => {
                      const totalStock = product.variants.reduce((s, v) => s + (v.stock ?? v.stockCount ?? 0), 0);
                      const isSoldOut = totalStock === 0;
                      const hasSale = Boolean(product.salePrice && product.salePrice < product.price);

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="group relative flex items-center gap-3 p-3 bg-[#131520] hover:bg-[#181B2A] border border-white/5 hover:border-[#D4AF37]/50 rounded-[2px] cursor-pointer transition-all duration-200"
                        >
                          {/* Thumbnail */}
                          <div className="w-16 h-20 bg-[#1A1D2D] rounded-[2px] overflow-hidden flex-shrink-0 relative">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-syne font-bold text-xs">
                                V
                              </div>
                            )}
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <span className="text-[8px] font-mono font-bold text-red-400 uppercase">
                                  Sold Out
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                                {product.subCategory}
                              </span>
                              {product.collection && (
                                <span className="text-[9px] font-mono text-slate-500 uppercase">
                                  • {product.collection}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-white uppercase font-heading truncate group-hover:text-[#D4AF37] transition-colors">
                              {product.name}
                            </h4>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-white">
                                LKR {(product.salePrice ?? product.price).toLocaleString()}
                              </span>
                              {hasSale && (
                                <span className="text-[10px] font-mono text-slate-500 line-through">
                                  LKR {product.price.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* SKU / Tag highlight */}
                            {product.variants[0]?.sku && (
                              <span className="text-[9px] font-mono text-slate-500 block truncate">
                                SKU: {product.variants[0].sku}
                              </span>
                            )}
                          </div>

                          <div className="p-1.5 rounded text-slate-500 group-hover:text-white transition-colors">
                            <Eye size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Trending & Suggestions when search is empty */}
            {!query.trim() && !selectedTag && (
              <div className="space-y-5 py-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                    <TrendingUp size={14} />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleApplyTrending(term)}
                        className="px-3 py-1.5 bg-[#12141E] hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-[#D4AF37] rounded-[2px] text-xs font-mono text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag size={11} className="opacity-60" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Drops Shortcut */}
                <div className="pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    FEATURED VALKNUT DROPS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'DARK SOVEREIGN 2026', desc: '480GSM Sovereign Fleece', cat: 'MEN' },
                      { name: 'ESSENTIAL SIGNATURE', desc: 'Boxy Combed Jersey Tees', cat: 'MEN' },
                      { name: 'STEALTH LABS', desc: 'Cordura Tactical Bags & Joggers', cat: 'ESSENTIALS' }
                    ].map((drop) => (
                      <div
                        key={drop.name}
                        onClick={() => {
                          setQuery(drop.name);
                        }}
                        className="p-2.5 bg-[#12141E] hover:bg-[#1A1D2B] border border-white/5 hover:border-[#D4AF37]/40 rounded-[2px] cursor-pointer transition-colors"
                      >
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">COLLECTION</span>
                        <h5 className="text-xs font-bold text-white truncate font-heading">{drop.name}</h5>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{drop.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 bg-[#0A0A0C] border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline flex items-center gap-1">
              Press <CornerDownLeft size={12} className="inline text-slate-400" /> to search full catalog
            </span>

            <button
              onClick={handleViewAllResults}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
            >
              <span>{query.trim() ? `Search "${query.trim()}" in Shop` : 'Browse Complete Shop'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
