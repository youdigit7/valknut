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

import { Box, Typography, Button, TextField, Select, MenuItem, InputAdornment, IconButton, Chip, Container } from '@mui/material';
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
    <Box id="valknut-shop-page" sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 4, sm: 6 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="xl">

        {/* 1. Breadcrumbs & SEO Header */}
        <Box sx={{ mb: { xs: 3, sm: 5 }, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 3 }}>
            <Box component="a" href="#/" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Home</Box>
            <ChevronRight size={12} />
            <Box component="a" href="#/shop" sx={{ textDecoration: 'none', transition: 'color 0.3s', color: filters.category === 'ALL' ? 'primary.main' : 'text.secondary', fontWeight: filters.category === 'ALL' ? 'bold' : 'normal', '&:hover': { color: 'var(--text-primary)' } }}>Shop</Box>
            {filters.category !== 'ALL' && (
              <>
                <ChevronRight size={12} />
                <Box component="a" href={`#/shop/${filters.category.toLowerCase()}`} sx={{ textDecoration: 'none', transition: 'color 0.3s', color: filters.subCategory === 'ALL' ? 'primary.main' : 'text.secondary', fontWeight: filters.subCategory === 'ALL' ? 'bold' : 'normal', '&:hover': { color: 'var(--text-primary)' } }}>
                  {filters.category}
                </Box>
              </>
            )}
            {filters.subCategory !== 'ALL' && (
              <>
                <ChevronRight size={12} />
                <Typography sx={{ fontSize: 'inherit', color: 'primary.main', fontWeight: 'bold' }}>{filters.subCategory}</Typography>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                VALKNUT ARCHITECTURAL STREETWEAR
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem', lg: '3rem' }, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: '"Syne", sans-serif' }}>
                {filters.subCategory !== 'ALL'
                  ? `${filters.category !== 'ALL' ? filters.category + ' ' : ''}${filters.subCategory}`
                  : filters.category === 'ALL'
                    ? 'ALL COLLECTIONS'
                    : `${filters.category} COLLECTION`}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { md: 'right' } }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>
                {totalProductsCount}
              </Typography>
              <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Total Pieces
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 2. Top-Level Category Sub-Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, pb: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {(['ALL', 'MEN', 'WOMEN', 'ESSENTIALS'] as const).map((cat) => {
            const isActive = filters.category === cat;
            return (
              <Button
                key={cat}
                onClick={() => handleFilterChange({ category: cat as CategoryType | 'ALL', subCategory: 'ALL' })}
                sx={{
                  px: 2.5, py: 1.25, borderRadius: 0.5, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Syne", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s', flexShrink: 0,
                  ...(isActive ? { bgcolor: 'primary.main', color: 'black', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' } : { bgcolor: '#12141F', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } })
                }}
              >
                {cat === 'ALL' ? 'SHOP ALL' : cat}
                <Box component="span" sx={{ ml: 1, px: 0.75, py: 0.25, borderRadius: 0.5, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', ...(isActive ? { bgcolor: 'rgba(0,0,0,0.2)', color: 'black' } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }) }}>
                  {cat === 'ALL' ? initialFacets.categories.ALL : initialFacets.categories[cat] || 0}
                </Box>
              </Button>
            );
          })}
        </Box>

        {/* 3. Controls & Action Bar */}
        <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 1.5, sm: 2 }, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Button
              onClick={() => setIsMobileFilterOpen(true)}
              sx={{ display: { lg: 'none' }, px: 2, py: 1.25, bgcolor: 'primary.main', color: 'black', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 0.5, flexShrink: 0, boxShadow: '0 2px 10px rgba(212,175,55,0.2)', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <Filter size={14} style={{ marginRight: 6 }} /> Filters
              {activeChips.length > 0 && (
                <Box component="span" sx={{ ml: 1, width: 20, height: 20, borderRadius: '50%', bgcolor: 'black', color: 'primary.main', fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeChips.length}
                </Box>
              )}
            </Button>
            <TextField
              fullWidth
              placeholder="Search name, SKU, tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              variant="outlined"
              size="small"
              sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { bgcolor: '#131520', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } } }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Search size={16} color="#64748b" /></InputAdornment>,
                  endAdornment: filters.search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleFilterChange({ search: '' })} sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}><X size={14} /></IconButton>
                    </InputAdornment>
                  ) : null
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'row', md: 'row' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <ArrowUpDown size={13} color="#D4AF37" /> Sort:
              </Typography>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{ bgcolor: '#131520', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }}
              >
                <MenuItem value="latest" sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Latest Drop Arrivals</MenuItem>
                <MenuItem value="popular" sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Best Sellers (Popularity)</MenuItem>
                <MenuItem value="price-low" sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Price: Low to High</MenuItem>
                <MenuItem value="price-high" sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Price: High to Low</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5, bgcolor: '#131520', border: '1px solid rgba(255,255,255,0.1)', p: 0.5, borderRadius: 0.5 }}>
              <IconButton onClick={() => setGridColumns(3)} size="small" sx={{ borderRadius: 0.5, p: 0.5, bgcolor: gridColumns === 3 ? 'primary.main' : 'transparent', color: gridColumns === 3 ? 'black' : 'text.secondary', '&:hover': { bgcolor: gridColumns === 3 ? 'primary.main' : 'rgba(255,255,255,0.1)', color: gridColumns === 3 ? 'black' : 'white' } }}>
                <LayoutGrid size={15} />
              </IconButton>
              <IconButton onClick={() => setGridColumns(4)} size="small" sx={{ borderRadius: 0.5, p: 0.5, bgcolor: gridColumns === 4 ? 'primary.main' : 'transparent', color: gridColumns === 4 ? 'black' : 'text.secondary', '&:hover': { bgcolor: gridColumns === 4 ? 'primary.main' : 'rgba(255,255,255,0.1)', color: gridColumns === 4 ? 'black' : 'white' } }}>
                <Grid3X3 size={15} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* 4. Removable Active Filter Chips */}
        {activeChips.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 4, p: 1.5, bgcolor: 'rgba(14,16,23,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 0.5 }}>
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', mr: 1 }}>
              Active Filters:
            </Typography>
            {activeChips.map((chip, idx) => (
              <Chip
                key={idx}
                label={chip.label}
                onDelete={chip.onRemove}
                deleteIcon={<X size={12} />}
                sx={{ bgcolor: '#141724', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', borderRadius: 0.5, height: 24, '& .MuiChip-deleteIcon': { color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } } }}
              />
            ))}
            <Button onClick={handleResetFilters} startIcon={<RotateCcw size={12} />} sx={{ minWidth: 'auto', p: 0, ml: 1, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}>
              Clear All
            </Button>
          </Box>
        )}

        {/* 5. Main 2-Column Layout */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 0, lg: 4 } }}>

          {/* Left Desktop Filter Sidebar */}
          <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 280, flexShrink: 0, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: 3, position: 'sticky', top: 112, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 } }}>
            <ShopSidebarFilters filters={filters} facets={currentFacets} onChange={handleFilterChange} onReset={handleResetFilters} />
          </Box>

          {/* Right Product Grid Column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {isLoading ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', xl: gridColumns === 4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
                <LoadingSkeleton variant="card" count={itemsPerPage} />
              </Box>
            ) : displayProducts.length === 0 ? (
              <Box sx={{ py: 8, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <EmptyState title="NO MATCHING VALKNUT PIECES" description="We couldn't find any products matching your current filters and keywords. Try adjusting your filters or search terms." actionText="RESET ALL FILTERS" onAction={handleResetFilters} />
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', xl: gridColumns === 4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={(p) => setSelectedProduct(p)} onAddToCart={handleQuickAddProduct} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
                ))}
              </Box>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalProductsCount > 0 && (
              <Box sx={{ pt: 4, mt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                  Showing <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{(currentPage - 1) * itemsPerPage + 1}</Box> to <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{Math.min(currentPage * itemsPerPage, totalProductsCount)}</Box> of <Box component="strong" sx={{ color: 'primary.main' }}>{totalProductsCount}</Box> pieces
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                    <Typography component="span">Show:</Typography>
                    <Select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} size="small" sx={{ bgcolor: '#131520', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                      <MenuItem value={8}>8 / page</MenuItem>
                      <MenuItem value={12}>12 / page</MenuItem>
                      <MenuItem value={24}>24 / page</MenuItem>
                      <MenuItem value={36}>36 / page</MenuItem>
                    </Select>
                  </Box>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Mobile Filters Drawer */}
      <ShopMobileFilterDrawer isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)} filters={filters} facets={currentFacets} onChange={handleFilterChange} onReset={handleResetFilters} matchingCount={totalProductsCount} />

      {/* Search Overlay Modal */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} onNavigateToShop={(term) => handleFilterChange({ search: term })} />
    </Box>
  );
};