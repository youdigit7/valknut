import React, { useState } from 'react';
import type { CategoryType } from '../../types/ecommerce';
import { 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Check, 
  SlidersHorizontal,
  DollarSign,
  Sparkles,
  Tag,
  Palette,
  Maximize2
} from 'lucide-react';

export interface FilterState {
  category: CategoryType | 'ALL';
  subCategory: string | 'ALL';
  collection: string | 'ALL';
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  isSaleOnly: boolean;
  isNewOnly: boolean;
  isBestSellerOnly: boolean;
  search: string;
}

interface FacetData {
  categories: Record<string, number>;
  subCategories: Record<string, number>;
  collections: Record<string, number>;
  sizes: Record<string, number>;
  colors: Record<string, { count: number; hex: string }>;
  priceRange: { min: number; max: number };
  totalInStock: number;
  totalOnSale: number;
}

interface ShopSidebarFiltersProps {
  filters: FilterState;
  facets: FacetData;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
  isMobileDrawer?: boolean;
}

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const ShopSidebarFilters: React.FC<ShopSidebarFiltersProps> = ({
  filters,
  facets,
  onChange,
  onReset,
  className = ''
}) => {
  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState({
    categories: true,
    collections: true,
    price: true,
    sizes: true,
    colors: true,
    availability: true,
    badges: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle multi-select array values
  const toggleSize = (size: string) => {
    const current = filters.sizes;
    const exists = current.includes(size);
    const updated = exists ? current.filter((s) => s !== size) : [...current, size];
    onChange({ sizes: updated });
  };

  const toggleColor = (colorName: string) => {
    const current = filters.colors;
    const exists = current.includes(colorName);
    const updated = exists ? current.filter((c) => c !== colorName) : [...current, colorName];
    onChange({ colors: updated });
  };

  const hasActiveFilters = Boolean(
    filters.category !== 'ALL' ||
    filters.subCategory !== 'ALL' ||
    filters.collection !== 'ALL' ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > (facets.priceRange.min || 0) ||
    filters.priceRange[1] < (facets.priceRange.max || 30000) ||
    filters.inStockOnly ||
    filters.isSaleOnly ||
    filters.isNewOnly ||
    filters.isBestSellerOnly ||
    filters.search.trim() !== ''
  );

  const activeFilterCount = [
    filters.category !== 'ALL',
    filters.subCategory !== 'ALL',
    filters.collection !== 'ALL',
    ...filters.sizes,
    ...filters.colors,
    filters.priceRange[0] > (facets.priceRange.min || 0) || filters.priceRange[1] < (facets.priceRange.max || 30000),
    filters.inStockOnly,
    filters.isSaleOnly,
    filters.isNewOnly,
    filters.isBestSellerOnly,
    filters.search.trim() !== ''
  ].filter(Boolean).length;

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#D4AF37]" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white font-syne">
            FILTERS
          </h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-mono font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] font-mono font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category & Subcategory Filter */}
      <div className="border-b border-white/10 pb-5">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white mb-3"
        >
          <span className="flex items-center gap-1.5 font-heading">
            <Tag size={13} className="text-[#D4AF37]" />
            <span>Category & Department</span>
          </span>
          {openSections.categories ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.categories && (
          <div className="space-y-3 pt-1">
            {/* Top Categories */}
            <div className="grid grid-cols-2 gap-1.5">
              {(['ALL', 'MEN', 'WOMEN', 'ESSENTIALS'] as const).map((cat) => {
                const isSelected = filters.category === cat;
                const count = cat === 'ALL' ? facets.categories.ALL : facets.categories[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      onChange({
                        category: cat,
                        subCategory: 'ALL'
                      });
                    }}
                    className={`px-3 py-2 text-left rounded-[2px] text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-black/80 font-black' : 'text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Subcategories */}
            {Object.keys(facets.subCategories).length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2">
                  SUBCATEGORY
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    onClick={() => onChange({ subCategory: 'ALL' })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-xs font-sans transition-colors flex items-center justify-between ${
                      filters.subCategory === 'ALL'
                        ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>All Subcategories</span>
                  </button>
                  {Object.entries(facets.subCategories).map(([subCat, count]) => {
                    const isSelected = filters.subCategory.toLowerCase() === subCat.toLowerCase();
                    return (
                      <button
                        key={subCat}
                        onClick={() => onChange({ subCategory: isSelected ? 'ALL' : subCat })}
                        className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-xs font-sans transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{subCat}</span>
                        <span className="text-[10px] font-mono text-slate-600">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Collection Filters */}
      {Object.keys(facets.collections).length > 0 && (
        <div className="border-b border-white/10 pb-5">
          <button
            onClick={() => toggleSection('collections')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white mb-3"
          >
            <span className="flex items-center gap-1.5 font-heading">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span>Capsule Collections</span>
            </span>
            {openSections.collections ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.collections && (
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => onChange({ collection: 'ALL' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-xs font-sans transition-colors flex items-center justify-between ${
                  filters.collection === 'ALL'
                    ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>All Collections</span>
              </button>
              {Object.entries(facets.collections).map(([col, count]) => {
                const isSelected = filters.collection.toLowerCase() === col.toLowerCase();
                return (
                  <button
                    key={col}
                    onClick={() => onChange({ collection: isSelected ? 'ALL' : col })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-xs font-mono font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate uppercase">{col}</span>
                    <span className="text-[10px] text-slate-600 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Price Filter (Dual Slider & Preset Chips) */}
      <div className="border-b border-white/10 pb-5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white mb-3"
        >
          <span className="flex items-center gap-1.5 font-heading">
            <DollarSign size={13} className="text-[#D4AF37]" />
            <span>Price Range (LKR)</span>
          </span>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            {/* Range readout */}
            <div className="flex items-center justify-between text-xs font-mono font-bold text-white bg-black/40 p-2 border border-white/10 rounded-[2px]">
              <span className="text-[#D4AF37]">LKR {filters.priceRange[0].toLocaleString()}</span>
              <span className="text-slate-500">—</span>
              <span className="text-[#D4AF37]">LKR {filters.priceRange[1].toLocaleString()}</span>
            </div>

            {/* Slider */}
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={facets.priceRange.min || 0}
                max={facets.priceRange.max || 30000}
                step={500}
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ priceRange: [filters.priceRange[0], Math.max(val, filters.priceRange[0])] });
                }}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Quick Price Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '< 6K', min: 0, max: 6000 },
                { label: '6K - 10K', min: 6000, max: 10000 },
                { label: '10K - 15K', min: 10000, max: 15000 },
                { label: '15K+', min: 15000, max: 30000 }
              ].map((bracket) => {
                const isActive =
                  filters.priceRange[0] === bracket.min && filters.priceRange[1] === bracket.max;
                return (
                  <button
                    key={bracket.label}
                    onClick={() => onChange({ priceRange: [bracket.min, bracket.max] })}
                    className={`px-2.5 py-1 rounded-[2px] text-[10px] font-mono font-bold transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {bracket.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Size Filter (S, M, L, XL, XXL) */}
      <div className="border-b border-white/10 pb-5">
        <button
          onClick={() => toggleSection('sizes')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white mb-3"
        >
          <span className="flex items-center gap-1.5 font-heading">
            <Maximize2 size={13} className="text-[#D4AF37]" />
            <span>Size Selection</span>
          </span>
          {openSections.sizes ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.sizes && (
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {ALL_SIZES.map((size) => {
              const isSelected = filters.sizes.includes(size);
              const count = facets.sizes[size] || 0;
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`py-2 px-1 rounded-[2px] text-xs font-mono font-black transition-all flex flex-col items-center justify-center border cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm scale-105'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:border-white/20 border-white/5'
                  }`}
                >
                  <span>{size}</span>
                  <span className={`text-[9px] font-normal ${isSelected ? 'text-black/80' : 'text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Color Swatches Filter */}
      {Object.keys(facets.colors).length > 0 && (
        <div className="border-b border-white/10 pb-5">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white mb-3"
          >
            <span className="flex items-center gap-1.5 font-heading">
              <Palette size={13} className="text-[#D4AF37]" />
              <span>Colour Palette</span>
            </span>
            {openSections.colors ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {openSections.colors && (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(facets.colors).map(([colorName, { count, hex }]) => {
                  const isSelected = filters.colors.includes(colorName);
                  return (
                    <button
                      key={colorName}
                      onClick={() => toggleColor(colorName)}
                      className={`p-2 rounded-[2px] text-left text-xs font-mono transition-all flex items-center gap-2 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: hex }}
                      >
                        {isSelected && (
                          <Check size={9} className={hex.toLowerCase().includes('fff') || hex.toLowerCase().includes('ede') ? 'text-black' : 'text-white'} />
                        )}
                      </span>
                      <span className="truncate text-[11px] flex-1">{colorName}</span>
                      <span className="text-[10px] text-slate-600">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Availability & Special States */}
      <div className="border-b border-white/10 pb-5 space-y-3">
        <button
          onClick={() => toggleSection('availability')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white"
        >
          <span className="font-heading">Stock & Drops</span>
          {openSections.availability ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.availability && (
          <div className="space-y-2 pt-1">
            {/* In Stock Only */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded-[2px] accent-[#D4AF37] bg-white/5 border-white/20"
              />
              <span className="font-mono">In Stock Ready to Ship ({facets.totalInStock})</span>
            </label>

            {/* Sale Items Only */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.isSaleOnly}
                onChange={(e) => onChange({ isSaleOnly: e.target.checked })}
                className="w-4 h-4 rounded-[2px] accent-[#D4AF37] bg-white/5 border-white/20"
              />
              <span className="font-mono text-red-400 font-semibold">Special Offers & Sale ({facets.totalOnSale})</span>
            </label>

            {/* New Arrivals Only */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.isNewOnly}
                onChange={(e) => onChange({ isNewOnly: e.target.checked })}
                className="w-4 h-4 rounded-[2px] accent-[#D4AF37] bg-white/5 border-white/20"
              />
              <span className="font-mono text-[#D4AF37]">New Drop Arrivals Only</span>
            </label>

            {/* Best Sellers */}
            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.isBestSellerOnly}
                onChange={(e) => onChange({ isBestSellerOnly: e.target.checked })}
                className="w-4 h-4 rounded-[2px] accent-[#D4AF37] bg-white/5 border-white/20"
              />
              <span className="font-mono">Best Sellers Restocked</span>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
};
