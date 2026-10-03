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
  CornerDownLeft,
  Sparkles
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 pt-16 sm:pt-24 pb-12 flex flex-col items-center justify-start relative z-10">
        <div 
          className="w-full max-w-3xl bg-[#0c0e15]/95 backdrop-blur-3xl border border-white/15 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.12),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e2235] to-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
              <Search size={18} />
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
                placeholder="Search collection, product name, or SKU..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-sans font-medium focus:outline-none tracking-wide"
              />
            </div>

            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono font-medium cursor-pointer"
              aria-label="Close search"
            >
              <span>ESC</span>
              <X size={15} />
            </button>
          </div>

          <div className="px-5 py-3 bg-black/40 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0 mr-1">
              <Layers size={12} className="text-[#D4AF37]" />
              QUICK:
            </span>
            {['All', 'Hoodies', 'Oversized Tees', 'Joggers', 'Accessories', 'Men', 'Women'].map((tag) => {
              const isActive = (tag === 'All' && !selectedTag) || selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'All' || selectedTag === tag ? null : tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e6c042] via-[#D4AF37] to-[#aa8010] text-black font-extrabold shadow-sm'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="max-h-[58vh] overflow-y-auto p-5 sm:p-6 space-y-5">
            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
                <div className="w-7 h-7 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                <span className="tracking-widest uppercase text-[11px]">Searching archives...</span>
              </div>
            )}

            {!isLoading && (query.trim() !== '' || selectedTag) && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-slate-400">
                  <span className="font-bold tracking-wider uppercase text-white">
                    Found {results.length} {results.length === 1 ? 'Product' : 'Products'}
                  </span>
                  {results.length > 0 && (
                    <button
                      onClick={handleViewAllResults}
                      className="text-[#D4AF37] hover:text-[#f3e5ab] flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Explore all in Shop</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="py-14 text-center space-y-3">
                    <Package size={36} className="mx-auto text-slate-600" />
                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                      No matching pieces found
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Try searching with broader terms like &ldquo;hoodie&rdquo;, &ldquo;tee&rdquo;, or select from the quick categories above.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        setSelectedTag(null);
                      }}
                      className="mt-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white rounded-full transition-colors cursor-pointer"
                    >
                      Clear Search Query
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {results.map((product) => {
                      const totalStock = product.variants.reduce((s, v) => s + (v.stock ?? v.stockCount ?? 0), 0);
                      const isSoldOut = totalStock === 0;
                      const hasSale = Boolean(product.salePrice && product.salePrice < product.price);

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="group relative flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#D4AF37]/60 cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                        >
                          <div className="w-16 h-20 bg-[#141624] rounded-lg overflow-hidden shrink-0 relative">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                                V
                              </div>
                            )}
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[8px] font-mono font-bold text-red-400 uppercase">
                                  Sold Out
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                                {product.subCategory}
                              </span>
                              {product.collection && (
                                <span className="text-[9px] font-mono text-slate-500 uppercase truncate max-w-[120px]">
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

                            {product.variants[0]?.sku && (
                              <span className="text-[9px] font-mono text-slate-500 block truncate">
                                SKU: {product.variants[0].sku}
                              </span>
                            )}
                          </div>

                          <div className="p-2 rounded-full text-slate-500 group-hover:text-white group-hover:bg-white/10 transition-colors">
                            <Eye size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!query.trim() && !selectedTag && (
              <div className="space-y-6 py-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
                    <TrendingUp size={14} />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleApplyTrending(term)}
                        className="px-3.5 py-2 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#D4AF37]/50 border border-white/10 rounded-full text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Tag size={11} className="text-[#D4AF37]/70" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <Sparkles size={12} className="text-[#D4AF37]" />
                    <span>FEATURED VALKNUT DROPS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'DARK SOVEREIGN 2026', desc: '480GSM Sovereign Fleece' },
                      { name: 'ESSENTIAL SIGNATURE', desc: 'Boxy Combed Jersey Tees' },
                      { name: 'STEALTH LABS', desc: 'Cordura Tactical Bags & Joggers' }
                    ].map((drop) => (
                      <div
                        key={drop.name}
                        onClick={() => {
                          setQuery(drop.name);
                        }}
                        className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#D4AF37]/50 cursor-pointer transition-all shadow-sm hover:-translate-y-0.5"
                      >
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold mb-1">COLLECTION</span>
                        <h5 className="text-xs font-bold text-white truncate font-heading">{drop.name}</h5>
                        <p className="text-[10px] text-slate-400 truncate mt-1">{drop.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              Press <CornerDownLeft size={13} className="text-[#D4AF37]" /> to search catalog
            </span>

            <button
              onClick={handleViewAllResults}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#e6c042] via-[#D4AF37] to-[#aa8010] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:-translate-y-0.5"
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
