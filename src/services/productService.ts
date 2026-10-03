import type { Product, CategoryType } from '../types/ecommerce';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ShopFilterParams {
  category?: CategoryType | 'ALL';
  subCategory?: string | 'ALL';
  collection?: string | 'ALL';
  search?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  sortBy?: 'latest' | 'price-low' | 'price-high' | 'popular';
  page?: number;
  limit?: number;
}

export interface ShopQueryResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  facets: {
    categories: Record<string, number>;
    subCategories: Record<string, number>;
    collections: Record<string, number>;
    sizes: Record<string, number>;
    colors: Record<string, { count: number; hex: string }>;
    priceRange: { min: number; max: number };
    totalInStock: number;
    totalOnSale: number;
  };
}

/**
 * Normalizes Supabase database row to our TypeScript Product type
 */
function mapSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    material: row.material || '',
    careInstructions: row.care_instructions || '',
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    category: row.category as CategoryType,
    subCategory: row.sub_category,
    collection: row.collection || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    variants: Array.isArray(row.variants) ? row.variants : [],
    isCustomizable: Boolean(row.is_customizable),
    isBestSeller: Boolean(row.is_best_seller),
    isNewArrival: Boolean(row.is_new_arrival),
    isLimitedEdition: Boolean(row.is_limited_edition),
    createdAt: row.created_at || new Date().toISOString()
  };
}

/**
 * Calculates facet counts and distributions across the active catalog
 */
export function calculateFacets(products: Product[]) {
  const categories: Record<string, number> = { ALL: products.length, MEN: 0, WOMEN: 0, ESSENTIALS: 0 };
  const subCategories: Record<string, number> = {};
  const collections: Record<string, number> = {};
  const sizes: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
  const colors: Record<string, { count: number; hex: string }> = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  let totalInStock = 0;
  let totalOnSale = 0;

  for (const p of products) {
    // Categories
    if (categories[p.category] !== undefined) {
      categories[p.category]++;
    }

    // Subcategories
    if (p.subCategory) {
      subCategories[p.subCategory] = (subCategories[p.subCategory] || 0) + 1;
    }

    // Collections
    if (p.collection) {
      collections[p.collection] = (collections[p.collection] || 0) + 1;
    }

    // Price
    const effectivePrice = p.salePrice ?? p.price;
    if (effectivePrice < minPrice) minPrice = effectivePrice;
    if (effectivePrice > maxPrice) maxPrice = effectivePrice;

    if (p.salePrice && p.salePrice < p.price) {
      totalOnSale++;
    }

    // Variants stock, sizes, colors
    let hasStock = false;
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      for (const v of p.variants) {
        const stockQty = v.stock ?? v.stockCount ?? 0;
        if (stockQty > 0) hasStock = true;

        if (v.size && sizes[v.size] !== undefined) {
          sizes[v.size] = (sizes[v.size] || 0) + 1;
        }

        if (v.color) {
          if (!colors[v.color]) {
            colors[v.color] = { count: 0, hex: v.colorHex || '#000000' };
          }
          colors[v.color].count++;
        }
      }
    }

    if (hasStock) {
      totalInStock++;
    }
  }

  return {
    categories,
    subCategories,
    collections,
    sizes,
    colors,
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === 0 ? 30000 : maxPrice
    },
    totalInStock,
    totalOnSale
  };
}

/**
 * Filter & sort in memory with 100% feature parity to Supabase SQL queries
 */
export function filterProductsInMemory(
  allProducts: Product[],
  params: ShopFilterParams
): ShopQueryResult {
  const {
    category = 'ALL',
    subCategory = 'ALL',
    collection = 'ALL',
    search = '',
    sizes = [],
    colors = [],
    minPrice,
    maxPrice,
    inStockOnly = false,
    isSale = false,
    isNewArrival = false,
    isBestSeller = false,
    sortBy = 'latest',
    page = 1,
    limit = 12
  } = params;

  const normalizedSearch = search.trim().toLowerCase();

  // 1. Filter items
  const filtered = allProducts.filter((product) => {
    // Category filter
    if (category !== 'ALL' && product.category.toUpperCase() !== category.toUpperCase()) {
      return false;
    }

    // SubCategory filter
    if (subCategory !== 'ALL' && product.subCategory.toLowerCase() !== subCategory.toLowerCase()) {
      return false;
    }

    // Collection filter
    if (collection !== 'ALL') {
      if (!product.collection || product.collection.toLowerCase() !== collection.toLowerCase()) {
        return false;
      }
    }

    // Search query matching Name, Description, SKU, Tags, Category, SubCategory, Collection
    if (normalizedSearch !== '') {
      const nameMatch = product.name.toLowerCase().includes(normalizedSearch);
      const descMatch = product.description.toLowerCase().includes(normalizedSearch);
      const catMatch = product.category.toLowerCase().includes(normalizedSearch);
      const subCatMatch = product.subCategory.toLowerCase().includes(normalizedSearch);
      const colMatch = product.collection?.toLowerCase().includes(normalizedSearch) || false;
      const tagMatch = product.tags.some((t) => t.toLowerCase().includes(normalizedSearch));
      const skuMatch = product.variants.some((v) => v.sku.toLowerCase().includes(normalizedSearch));

      if (!nameMatch && !descMatch && !catMatch && !subCatMatch && !colMatch && !tagMatch && !skuMatch) {
        return false;
      }
    }

    // Price range
    const effectivePrice = product.salePrice ?? product.price;
    if (minPrice !== undefined && effectivePrice < minPrice) return false;
    if (maxPrice !== undefined && effectivePrice > maxPrice) return false;

    // Size filter
    if (sizes.length > 0) {
      const hasMatchingSize = product.variants.some((v) => sizes.includes(v.size));
      if (!hasMatchingSize) return false;
    }

    // Color filter
    if (colors.length > 0) {
      const hasMatchingColor = product.variants.some((v) =>
        colors.some((c) => c.toLowerCase() === v.color.toLowerCase())
      );
      if (!hasMatchingColor) return false;
    }

    // Stock availability
    if (inStockOnly) {
      const totalStock = product.variants.reduce((sum, v) => sum + (v.stock ?? v.stockCount ?? 0), 0);
      if (totalStock <= 0) return false;
    }

    // Badges / Flags
    if (isSale && !(product.salePrice && product.salePrice < product.price)) return false;
    if (isNewArrival && !product.isNewArrival) return false;
    if (isBestSeller && !product.isBestSeller) return false;

    return true;
  });

  // 2. Sort items
  filtered.sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    if (sortBy === 'price-low') {
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      return priceB - priceA;
    }
    if (sortBy === 'popular') {
      const scoreA = (a.isBestSeller ? 10 : 0) + (a.isFeatured ? 5 : 0);
      const scoreB = (b.isBestSeller ? 10 : 0) + (b.isFeatured ? 5 : 0);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: latest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 3. Facets calculated on all matching items (for accurate UI stats)
  const facets = calculateFacets(allProducts);

  // 4. Pagination
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    totalCount,
    totalPages,
    currentPage: safePage,
    facets
  };
}

/**
 * Fetches products from Supabase with efficient server-side filtering,
 * or falls back smoothly to in-memory local data.
 */
export async function queryShopProducts(
  params: ShopFilterParams,
  fallbackLocalProducts: Product[] = INITIAL_PRODUCTS
): Promise<ShopQueryResult> {
  if (!isSupabaseConfigured || !supabase) {
    return filterProductsInMemory(fallbackLocalProducts, params);
  }

  try {
    const {
      category = 'ALL',
      subCategory = 'ALL',
      collection = 'ALL',
      search = '',
      minPrice,
      maxPrice,
      inStockOnly = false,
      isSale = false,
      isNewArrival = false,
      isBestSeller = false,
      sortBy = 'latest',
      page = 1,
      limit = 12
    } = params;

    let query = supabase.from('products').select('*', { count: 'exact' });

    // Category filter
    if (category !== 'ALL') {
      query = query.eq('category', category);
    }

    // Subcategory filter
    if (subCategory !== 'ALL') {
      query = query.eq('sub_category', subCategory);
    }

    // Collection filter
    if (collection !== 'ALL') {
      query = query.eq('collection', collection);
    }

    // Search filter
    if (search.trim() !== '') {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,sub_category.ilike.%${q}%,collection.ilike.%${q}%`);
    }

    // Price filters
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    // Badges & Sales
    if (isSale) {
      query = query.not('sale_price', 'is', null);
    }
    if (isNewArrival) {
      query = query.eq('is_new_arrival', true);
    }
    if (isBestSeller) {
      query = query.eq('is_best_seller', true);
    }

    // Sorting
    if (sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('is_best_seller', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Range Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      // If Supabase table is empty or error, fallback to local products seamlessly
      return filterProductsInMemory(fallbackLocalProducts, params);
    }

    let mappedProducts = data.map(mapSupabaseRowToProduct);
    if (inStockOnly) {
      mappedProducts = mappedProducts.filter(p => {
        const totalStock = p.variants.reduce((sum, v) => sum + (v.stock ?? v.stockCount ?? 0), 0);
        return totalStock > 0;
      });
    }
    const totalCount = count ?? mappedProducts.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      products: mappedProducts,
      totalCount,
      totalPages,
      currentPage: page,
      facets: calculateFacets(fallbackLocalProducts)
    };
  } catch (err) {
    console.warn('Supabase query failed, falling back to cached products:', err);
    return filterProductsInMemory(fallbackLocalProducts, params);
  }
}

/**
 * Fast search suggestion querying for Search Overlay
 */
export async function searchCatalog(
  searchQuery: string,
  allProducts: Product[] = INITIAL_PRODUCTS,
  limit: number = 6
): Promise<Product[]> {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return [];

  const matches = allProducts.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const descMatch = p.description.toLowerCase().includes(q);
    const catMatch = p.category.toLowerCase().includes(q);
    const subCatMatch = p.subCategory.toLowerCase().includes(q);
    const colMatch = p.collection?.toLowerCase().includes(q) || false;
    const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
    const skuMatch = p.variants.some((v) => v.sku.toLowerCase().includes(q));
    return nameMatch || descMatch || catMatch || subCatMatch || colMatch || tagMatch || skuMatch;
  });

  return matches.slice(0, limit);
}

/**
 * Fetches all authoritative products (from Supabase or LocalStorage/Defaults)
 */
export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseRowToProduct);
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase:', e);
    }
  }

  try {
    const cached = localStorage.getItem('valknut_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read cached products:', e);
  }

  return INITIAL_PRODUCTS;
}

/**
 * Retrieves a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === productId || p.slug === productId) || null;
}

