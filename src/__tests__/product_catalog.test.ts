import { describe, it, expect } from 'vitest';
import { 
  mapSupabaseRowToProduct, 
  filterProductsInMemory, 
  calculateFacets, 
  searchCatalog 
} from '../services/productService';
import type { Product } from '../types/ecommerce';

describe('Product Catalog & Service QA Suite', () => {
  const sampleRealProduct: Product = {
    id: '11111111-2222-3333-4444-555555555555',
    name: 'VALKNUT Heavyweight Sovereign Hoodie',
    slug: 'valknut-heavyweight-sovereign-hoodie',
    description: '480GSM luxury fleece hoodie with embroidered sigils.',
    material: '100% Cotton Fleece',
    careInstructions: 'Machine wash cold',
    price: 12500,
    salePrice: 10500,
    category: 'MEN',
    subCategory: 'Hoodies',
    collection: 'SHADOW OPS 2026',
    images: ['https://res.cloudinary.com/ofrariny/image/upload/v1/valknut/test.jpg'],
    tags: ['Heavyweight', 'Streetwear', '480GSM'],
    variants: [
      { id: 'v-1', size: 'M', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-M', stock: 15 },
      { id: 'v-2', size: 'L', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-L', stock: 0 }
    ],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    isLimitedEdition: false,
    createdAt: '2026-10-16T12:00:00Z'
  };

  const sampleLegacyProduct: Product = {
    id: 'prod-1',
    name: 'Dummy Mock Tee',
    slug: 'dummy-mock-tee',
    description: 'Legacy test item',
    price: 5000,
    category: 'MEN',
    subCategory: 'Oversized T-Shirts',
    images: [],
    tags: ['Mock'],
    variants: [],
    material: 'Cotton',
    careInstructions: 'Machine wash',
    createdAt: '2026-01-01T00:00:00Z'
  };

  it('maps Supabase row to canonical Product type safely without crashing when variants are missing', () => {
    const rawRow = {
      id: '2fa21dc4-f38d-4665-95c6-37eb788cc098',
      name: 'Oversized Raw Edge Tee',
      slug: 'oversized-raw-edge-tee',
      price: 8500,
      category: 'MEN',
      sub_category: 'Oversized T-Shirts',
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1/valknut/test.jpg']
    };

    const mapped = mapSupabaseRowToProduct(rawRow);
    expect(mapped.id).toBe(rawRow.id);
    expect(mapped.name).toBe(rawRow.name);
    expect(mapped.price).toBe(8500);
    expect(Array.isArray(mapped.variants)).toBe(true);
    expect(mapped.variants.length).toBeGreaterThan(0);
    expect(mapped.variants[0].size).toBe('S');
  });

  it('filters products in memory and strictly excludes legacy prod-* dummy items', () => {
    const catalog = [sampleRealProduct, sampleLegacyProduct];
    const result = filterProductsInMemory(catalog, { category: 'MEN' });

    expect(result.products.length).toBe(1);
    expect(result.products[0].id).toBe(sampleRealProduct.id);
    expect(result.products.some(p => p.id.startsWith('prod-'))).toBe(false);
  });

  it('filters by size and stock availability correctly', () => {
    const catalog = [sampleRealProduct];

    // In stock size M
    const sizeMResult = filterProductsInMemory(catalog, { sizes: ['M'], inStockOnly: true });
    expect(sizeMResult.products.length).toBe(1);

    // Filter by size L with inStockOnly (Size L has 0 stock)
    const inStockLResult = filterProductsInMemory(catalog, { sizes: ['L'], inStockOnly: true });
    // Product total stock is 15 (M:15 + L:0), but size L variant is checked
    expect(inStockLResult.products.length).toBe(1);
  });

  it('calculates catalog facets including subcategories, colors, and price range', () => {
    const facets = calculateFacets([sampleRealProduct]);
    expect(facets.categories['MEN']).toBe(1);
    expect(facets.subCategories['Hoodies']).toBe(1);
    expect(facets.collections['SHADOW OPS 2026']).toBe(1);
    expect(facets.priceRange.min).toBe(10500);
    expect(facets.priceRange.max).toBe(10500);
    expect(facets.totalInStock).toBe(1);
  });

  it('searches catalog by name, tag, and SKU with case-insensitivity', async () => {
    const matchesByName = await searchCatalog('sovereign', [sampleRealProduct]);
    expect(matchesByName.length).toBe(1);

    const matchesBySku = await searchCatalog('vk-hd-blk-m', [sampleRealProduct]);
    expect(matchesBySku.length).toBe(1);

    const matchesByTag = await searchCatalog('480gsm', [sampleRealProduct]);
    expect(matchesByTag.length).toBe(1);

    const noMatches = await searchCatalog('nonexistent-item-xyz', [sampleRealProduct]);
    expect(noMatches.length).toBe(0);
  });
});
