import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product, CategoryType } from '../../types/ecommerce';
import { ProductCard } from '../ui/ProductCard';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { ShopSidebarFilters } from './ShopSidebarFilters';
import type { FilterState } from './ShopSidebarFilters';
import { ShopMobileFilterDrawer } from './ShopMobileFilterDrawer';
import { SearchModal } from './SearchModal';
import { queryShopProducts, calculateFacets } from '../../services/productService';
import { getShopSEOMetadata, applySEOMetadata } from '../../utils/seo';
import { 
  ArrowUpDown, 
  Search, 
  X, 
  LayoutGrid, 
  Grid3X3, 
  RotateCcw,
  ChevronRight,
  Filter
} from 'lucide-react';

/**
 * URL Query Parameter Serializer & Parser for Bookmarkable & Shareable Shop Views
 */
function parseUrlParams(hashStr: string): Partial<FilterState> & { sortBy?: any; page?: number } {
  const result: Partial<FilterState> & { sortBy?: any; page?: number } = {};

  try {
    const rawHash = hashStr.startsWith('#') ? hashStr.slice(1) : hashStr;
    const [pathPart, queryPart] = rawHash.split('?');

    // Parse path-based category shortcuts e.g. /shop/men, /shop/men/hoodies, /category/women
    if (pathPart) {
      const cleanPath = pathPart.replace(/^\//, '').toLowerCase();
      const segments = cleanPath.split('/');

      // Check /shop/men or /category/men
      if (segments.length >= 2 && (segments[0] === 'shop' || segments[0] === 'category')) {
        const cat = segments[1]?.toUpperCase();
        if (cat === 'MEN' || cat === 'WOMEN' || cat === 'ESSENTIALS') {
          result.category = cat as CategoryType;
        }

        // Subcategory in path e.g. /shop/men/hoodies
        if (segments[2]) {
          const subSlug = segments[2].replace(/-/g, ' ');
          result.subCategory = subSlug;
        }
      }
    }

    // Parse query string parameters e.g. ?category=hoodies&size=xl&color=black
    if (queryPart) {
      const params = new URLSearchParams(queryPart);

      const cat = params.get('category');
      if (cat) {
        const upperCat = cat.toUpperCase();
        if (upperCat === 'MEN' || upperCat === 'WOMEN' || upperCat === 'ESSENTIALS') {
          result.category = upperCat as CategoryType;
        } else {
          // If user passed ?category=hoodies
          result.subCategory = cat;
        }
      }

      const sub = params.get('subCategory') || params.get('subcategory') || params.get('sub');
      if (sub) result.subCategory = sub;

      const col = params.get('collection');
      if (col) result.collection = col;

      const q = params.get('q') || params.get('search');
      if (q) result.search = q;

      const sizeParam = params.get('size') || params.get('sizes');
      if (sizeParam) {
        result.sizes = sizeParam.toUpperCase().split(',').map((s) => s.trim());
      }

      const colorParam = params.get('color') || params.get('colors');
      if (colorParam) {
        result.colors = colorParam.split(',').map((c) => c.trim());
      }

      const minP = params.get('minPrice');
      const maxP = params.get('maxPrice');
      if (minP || maxP) {
        result.priceRange = [
          minP ? Number(minP) : 0,
          maxP ? Number(maxP) : 30000
        ];
      }

      const inStock = params.get('inStock');
      if (inStock === 'true' || inStock === '1') result.inStockOnly = true;

      const sale = params.get('sale');
      if (sale === 'true' || sale === '1') result.isSaleOnly = true;

      const newArrival = params.get('new');
      if (newArrival === 'true' || newArrival === '1') result.isNewOnly = true;

      const sort = params.get('sort');
      if (sort === 'latest' || sort === 'price-low' || sort === 'price-high' || sort === 'popular') {
        result.sortBy = sort;
      }

      const pageParam = params.get('page');
      if (pageParam && Number(pageParam) > 0) {
        result.page = Number(pageParam);
      }
    }
  } catch (e) {
    console.warn('Failed parsing URL filter params:', e);
  }

  return result;
}

function syncFiltersToUrl(filters: FilterState, sortBy: string, page: number) {
  try {
    const params = new URLSearchParams();

    // Base path
    let basePath = '#/shop';
    if (filters.category !== 'ALL') {
      basePath = `#/shop/${filters.category.toLowerCase()}`;
    }

    if (filters.subCategory !== 'ALL') {
      params.set('subCategory', filters.subCategory);
    }
    if (filters.collection !== 'ALL') {
      params.set('collection', filters.collection);
    }
    if (filters.search.trim() !== '') {
      params.set('q', filters.search.trim());
    }
    if (filters.sizes.length > 0) {
      params.set('size', filters.sizes.join(',').toLowerCase());
    }
    if (filters.colors.length > 0) {
      params.set('color', filters.colors.join(','));
    }
    if (filters.priceRange[0] > 0) {
      params.set('minPrice', String(filters.priceRange[0]));
    }
    if (filters.priceRange[1] < 30000) {
      params.set('maxPrice', String(filters.priceRange[1]));
    }
    if (filters.inStockOnly) {
      params.set('inStock', 'true');
    }
    if (filters.isSaleOnly) {
      params.set('sale', 'true');
    }
    if (filters.isNewOnly) {
      params.set('new', 'true');
    }
    if (filters.isBestSellerOnly) {
      params.set('popular', 'true');
    }
    if (sortBy !== 'latest') {
      params.set('sort', sortBy);
    }
    if (page > 1) {
      params.set('page', String(page));
    }

    const queryString = params.toString();
    const newHash = queryString ? `${basePath}?${queryString}` : basePath;

    // Use replaceState to keep history clean while making URL shareable
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  } catch (e) {
    console.warn('Could not sync filters to URL:', e);
  }
}

export const ProductCatalog: React.FC = () => {
  const { 
    products: allCachedProducts, 
    setSelectedProduct, 
    addToCart,
    showToast 
  } = useStore();

  // Wishlist state (stored in localStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('valknut_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const isWishlisted = prev.includes(product.id);
      const updated = isWishlisted ? prev.filter((id) => id !== product.id) : [...prev, product.id];
      try {
        localStorage.setItem('valknut_wishlist', JSON.stringify(updated));
      } catch (e) {
        console.warn('Wishlist localStorage error', e);
      }
      showToast(
        isWishlisted ? `Removed "${product.name}" from wishlist` : `Added "${product.name}" to wishlist`,
        'info'
      );
      return updated;
    });
  };

  // Base facets calculated from entire catalog
  const initialFacets = useMemo(() => calculateFacets(allCachedProducts), [allCachedProducts]);

  // Initial Filter State parsed from URL
  const initialUrlState = useMemo(() => parseUrlParams(window.location.hash || ''), []);

  const [filters, setFilters] = useState<FilterState>(() => ({
    category: initialUrlState.category || 'ALL',
    subCategory: initialUrlState.subCategory || 'ALL',
    collection: initialUrlState.collection || 'ALL',
    sizes: initialUrlState.sizes || [],
    colors: initialUrlState.colors || [],
    priceRange: initialUrlState.priceRange || [0, 30000],
    inStockOnly: Boolean(initialUrlState.inStockOnly),
    isSaleOnly: Boolean(initialUrlState.isSaleOnly),
    isNewOnly: Boolean(initialUrlState.isNewOnly),
    isBestSellerOnly: false,
    search: initialUrlState.search || ''
  }));

  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'popular'>(
    initialUrlState.sortBy || 'latest'
  );
  const [currentPage, setCurrentPage] = useState<number>(initialUrlState.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  // Modals & Drawers
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Query results and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(allCachedProducts.length);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentFacets, setCurrentFacets] = useState(initialFacets);

  // Sync state with URL hash updates (e.g. if user clicks back/forward or navigates from Navbar)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseUrlParams(window.location.hash);
      setFilters((prev) => ({
        ...prev,
        category: parsed.category || 'ALL',
        subCategory: parsed.subCategory || 'ALL',
        collection: parsed.collection || 'ALL',
        sizes: parsed.sizes || [],
        colors: parsed.colors || [],
        priceRange: parsed.priceRange || [0, 30000],
        inStockOnly: Boolean(parsed.inStockOnly),
        isSaleOnly: Boolean(parsed.isSaleOnly),
        isNewOnly: Boolean(parsed.isNewOnly),
        search: parsed.search || ''
      }));
      if (parsed.sortBy) setSortBy(parsed.sortBy);
      if (parsed.page) setCurrentPage(parsed.page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Execute Supabase / in-memory product queries with smooth loading state
  const executeQuery = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await queryShopProducts(
        {
          category: filters.category,
          subCategory: filters.subCategory,
          collection: filters.collection,
          search: filters.search,
          sizes: filters.sizes,
          colors: filters.colors,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          inStockOnly: filters.inStockOnly,
          isSale: filters.isSaleOnly,
          isNewArrival: filters.isNewOnly,
          isBestSeller: filters.isBestSellerOnly,
          sortBy,
          page: currentPage,
          limit: itemsPerPage
        },
        allCachedProducts
      );

      setDisplayProducts(result.products);
      setTotalProductsCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentFacets(result.facets);

      // Update URL query parameters seamlessly
      syncFiltersToUrl(filters, sortBy, currentPage);

      // Dynamic SEO Meta tags with ItemList structured data
      const seoMeta = getShopSEOMetadata(filters.category, filters.subCategory, filters.collection, result.products);
      applySEOMetadata(seoMeta);
    } catch (err) {
      console.warn('Error querying shop products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, currentPage, itemsPerPage, allCachedProducts]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  // Filter updates
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // reset to page 1 on filter changes
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'ALL',
      subCategory: 'ALL',
      collection: 'ALL',
      sizes: [],
      colors: [],
      priceRange: [0, 30000],
      inStockOnly: false,
      isSaleOnly: false,
      isNewOnly: false,
      isBestSellerOnly: false,
      search: ''
    });
    setSortBy('latest');
    setCurrentPage(1);
    window.location.hash = '#/shop';
  };

  const handleQuickAddProduct = (product: Product) => {
    const firstVariant = product.variants[0] || {
      size: 'M',
      color: 'Onyx Black',
      colorHex: '#0a0a0c'
    };
    addToCart(
      product,
      firstVariant.size as any,
      firstVariant.color,
      firstVariant.colorHex,
      1
    );
  };

  // Compute active filter chips for removable badges
  const activeChips: { label: string; onRemove: () => void }[] = [];

  if (filters.category !== 'ALL') {
    activeChips.push({
      label: `Category: ${filters.category}`,
      onRemove: () => handleFilterChange({ category: 'ALL', subCategory: 'ALL' })
    });
  }

  if (filters.subCategory !== 'ALL') {
    activeChips.push({
      label: `Subcategory: ${filters.subCategory}`,
      onRemove: () => handleFilterChange({ subCategory: 'ALL' })
    });
  }

  if (filters.collection !== 'ALL') {
    activeChips.push({
      label: `Collection: ${filters.collection}`,
      onRemove: () => handleFilterChange({ collection: 'ALL' })
    });
  }

  if (filters.search.trim() !== '') {
    activeChips.push({
      label: `Search: "${filters.search}"`,
      onRemove: () => handleFilterChange({ search: '' })
    });
  }

  filters.sizes.forEach((sz) => {
    activeChips.push({
      label: `Size: ${sz}`,
      onRemove: () => handleFilterChange({ sizes: filters.sizes.filter((s) => s !== sz) })
    });
  });

  filters.colors.forEach((col) => {
    activeChips.push({
      label: `Color: ${col}`,
      onRemove: () => handleFilterChange({ colors: filters.colors.filter((c) => c !== col) })
    });
  });

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 30000) {
    activeChips.push({
      label: `Price: LKR ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => handleFilterChange({ priceRange: [0, 30000] })
    });
  }

  if (filters.inStockOnly) {
    activeChips.push({
      label: 'In Stock Only',
      onRemove: () => handleFilterChange({ inStockOnly: false })
    });
  }

  if (filters.isSaleOnly) {
    activeChips.push({
      label: 'On Sale',
      onRemove: () => handleFilterChange({ isSaleOnly: false })
    });
  }

  if (filters.isNewOnly) {
    activeChips.push({
      label: 'New Drops',
      onRemove: () => handleFilterChange({ isNewOnly: false })
    });
  }

  return (
    <section id="valknut-shop-page" className="w-full min-h-screen bg-[#0A0A0A] py-8 sm:py-12 border-b border-white/10">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs & SEO Header */}
        <div className="mb-6 sm:mb-10 pb-6 border-b border-white/10">
          <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-3">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={12} className="text-slate-600" />
            <a href="#/shop" className={filters.category === 'ALL' ? 'text-[#D4AF37] font-bold' : 'hover:text-white transition-colors'}>Shop</a>
            {filters.category !== 'ALL' && (
              <>
                <ChevronRight size={12} className="text-slate-600" />
                <a href={`#/shop/${filters.category.toLowerCase()}`} className={filters.subCategory === 'ALL' ? 'text-[#D4AF37] font-bold' : 'hover:text-white transition-colors'}>
                  {filters.category}
                </a>
              </>
            )}
            {filters.subCategory !== 'ALL' && (
              <>
                <ChevronRight size={12} className="text-slate-600" />
                <span className="text-[#D4AF37] font-bold truncate">{filters.subCategory}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-black tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                VALKNUT ARCHITECTURAL STREETWEAR
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-syne">
                {filters.subCategory !== 'ALL' 
                  ? `${filters.category !== 'ALL' ? filters.category + ' ' : ''}${filters.subCategory}`
                  : filters.category === 'ALL' 
                  ? 'ALL COLLECTIONS' 
                  : `${filters.category} COLLECTION`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-2 font-sans">
                Engineered from 480GSM ultra-heavyweight combed organic cotton and military-spec Cordura. Designed in Colombo, Sri Lanka.
              </p>
            </div>

            {/* Product Counter Badge */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-[#12141F] border border-white/10 rounded-[2px] text-xs font-mono font-bold text-slate-300">
                <strong className="text-[#D4AF37]">{totalProductsCount}</strong> {totalProductsCount === 1 ? 'PRODUCT' : 'PRODUCTS'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Top Quick Category Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-white/5">
          {(['ALL', 'MEN', 'WOMEN', 'ESSENTIALS'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                handleFilterChange({ category: cat, subCategory: 'ALL' });
              }}
              className={`px-5 py-2.5 rounded-[2px] text-xs font-bold font-syne uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                filters.category === cat
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
                  : 'bg-[#12141F] text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{cat === 'ALL' ? 'SHOP ALL' : cat}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] ${
                filters.category === cat ? 'bg-black/20 text-black font-black' : 'bg-white/5 text-slate-400'
              }`}>
                {cat === 'ALL' ? initialFacets.categories.ALL : initialFacets.categories[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* 3. Controls & Action Bar */}
        <div className="bg-[#0E1017] border border-white/10 rounded-md p-3.5 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          
          {/* Left: Mobile Drawer Trigger & Search Input */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black text-xs font-extrabold tracking-wider uppercase rounded-[2px] flex items-center gap-2 shadow-md cursor-pointer flex-shrink-0"
            >
              <Filter size={14} />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-black text-[#D4AF37] text-[10px] font-mono font-black flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>

            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Search name, SKU, tags..."
                className="w-full bg-[#131520] border border-white/10 hover:border-white/20 focus:border-[#D4AF37] rounded-[2px] py-2 pl-10 pr-9 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange({ search: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort & Grid Layout */}
          <div className="flex items-center gap-3 sm:gap-4 justify-between md:justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase hidden sm:inline flex items-center gap-1">
                <ArrowUpDown size={13} className="text-[#D4AF37]" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#131520] border border-white/15 rounded-[2px] py-2 px-3 text-xs font-mono font-semibold text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="latest">Latest Drop Arrivals</option>
                <option value="popular">Best Sellers (Popularity)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Grid Density Switches (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 bg-[#131520] border border-white/10 p-1 rounded-[2px]">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-[2px] transition-colors ${
                  gridColumns === 3 ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="3 Columns Grid"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-[2px] transition-colors ${
                  gridColumns === 4 ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="4 Columns Grid"
              >
                <Grid3X3 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Removable Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6 p-3 bg-[#0E1017]/60 border border-white/5 rounded-[2px]">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              Active Filters:
            </span>
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#141724] border border-[#D4AF37]/30 text-white text-xs font-mono"
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.onRemove}
                  className="text-slate-400 hover:text-[#D4AF37] ml-0.5 p-0.5"
                  title="Remove filter"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono font-bold text-[#D4AF37] hover:underline ml-2 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* 5. Main 2-Column Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
          
          {/* Left Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-[#0E1017] border border-white/10 rounded-md p-5 sticky top-28 max-h-[85vh] overflow-y-auto scrollbar-thin shadow-2xl">
            <ShopSidebarFilters
              filters={filters}
              facets={currentFacets}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-3 xl:col-span-4 space-y-8">
            
            {/* Loading Skeletons */}
            {isLoading ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColumns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-4 sm:gap-6`}>
                <LoadingSkeleton variant="card" count={itemsPerPage} />
              </div>
            ) : displayProducts.length === 0 ? (
              /* Empty Results State */
              <div className="py-16 bg-[#0E1017] border border-white/10 rounded-md">
                <EmptyState
                  title="NO MATCHING VALKNUT PIECES"
                  description="We couldn't find any products matching your current filters and keywords. Try adjusting your filters or search terms."
                  actionText="RESET ALL FILTERS"
                  onAction={handleResetFilters}
                />
              </div>
            ) : (
              /* Product Grid */
              <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColumns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-4 sm:gap-6`}>
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                    onAddToCart={handleQuickAddProduct}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalProductsCount > 0 && (
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-400">
                  Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                  <strong className="text-white">{Math.min(currentPage * itemsPerPage, totalProductsCount)}</strong> of{' '}
                  <strong className="text-[#D4AF37]">{totalProductsCount}</strong> pieces
                </div>

                <div className="flex items-center gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-[#131520] border border-white/10 rounded-[2px] py-1 px-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value={8}>8 / page</option>
                      <option value={12}>12 / page</option>
                      <option value={24}>24 / page</option>
                      <option value={36}>36 / page</option>
                    </select>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      <ShopMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        facets={currentFacets}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        matchingCount={totalProductsCount}
      />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateToShop={(term) => {
          handleFilterChange({ search: term });
        }}
      />
    </section>
  );
};
