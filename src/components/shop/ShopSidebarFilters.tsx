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
import {
  Box, Typography, Button, Checkbox, Slider, Collapse
} from '@mui/material';

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
  className = '',
  isMobileDrawer = false,
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
    <Box component="aside" className={className} sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: isMobileDrawer ? 2 : 0 }}>
      {/* Filters Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SlidersHorizontal size={16} color="#D4AF37" />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)' }}>
            FILTERS
          </Typography>
          {activeFilterCount > 0 && (
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', color: 'black', fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeFilterCount}
            </Box>
          )}
        </Box>

        {hasActiveFilters && (
          <Button
            onClick={onReset}
            variant="text"
            startIcon={<RotateCcw size={12} />}
            sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
          >
            Reset All
          </Button>
        )}
      </Box>

      {/* 1. Category & Subcategory Filter */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
        <Button
          fullWidth
          onClick={() => toggleSection('categories')}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tag size={13} color="#D4AF37" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Category & Department</Typography>
          </Box>
          {openSections.categories ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </Button>

        <Collapse in={openSections.categories}>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Top Categories */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {(['ALL', 'MEN', 'WOMEN', 'ESSENTIALS'] as const).map((cat) => {
                const isSelected = filters.category === cat;
                const count = cat === 'ALL' ? facets.categories.ALL : facets.categories[cat] || 0;
                return (
                  <Button
                    key={cat}
                    onClick={() => onChange({ category: cat, subCategory: 'ALL' })}
                    sx={{
                      justifyContent: 'space-between', py: 1, px: 1.5, borderRadius: 1, textTransform: 'none', border: '1px solid',
                      ...(isSelected ? {
                        bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main', boxShadow: '0 2px 5px rgba(212,175,55,0.3)'
                      } : {
                        bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }
                      })
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold' }}>{cat}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: isSelected ? 'rgba(0,0,0,0.8)' : 'text.disabled', fontWeight: isSelected ? 'bold' : 'normal' }}>{count}</Typography>
                  </Button>
                );
              })}
            </Box>

            {/* Subcategories */}
            {Object.keys(facets.subCategories).length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.disabled', mb: 1 }}>SUBCATEGORY</Typography>
                <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Button
                    onClick={() => onChange({ subCategory: 'ALL' })}
                    sx={{
                      justifyContent: 'space-between', py: 0.5, px: 1, borderRadius: 1, textTransform: 'none',
                      ...(filters.subCategory === 'ALL' ? { color: 'primary.main', bgcolor: 'rgba(212,175,55,0.1)', fontWeight: 'bold' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.05)' } })
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem' }}>All Subcategories</Typography>
                  </Button>
                  {Object.entries(facets.subCategories).map(([subCat, count]) => {
                    const isSelected = filters.subCategory.toLowerCase() === subCat.toLowerCase();
                    return (
                      <Button
                        key={subCat}
                        onClick={() => onChange({ subCategory: isSelected ? 'ALL' : subCat })}
                        sx={{
                          justifyContent: 'space-between', py: 0.5, px: 1, borderRadius: 1, textTransform: 'none',
                          ...(isSelected ? { color: 'primary.main', bgcolor: 'rgba(212,175,55,0.1)', fontWeight: 'bold' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.05)' } })
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', }}>{subCat}</Typography>
                        <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'text.disabled' }}>({count})</Typography>
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* 2. Collection Filters */}
      {Object.keys(facets.collections).length > 0 && (
        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          <Button
            fullWidth
            onClick={() => toggleSection('collections')}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Sparkles size={13} color="#D4AF37" />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Capsule Collections</Typography>
            </Box>
            {openSections.collections ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </Button>

          <Collapse in={openSections.collections}>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Button
                onClick={() => onChange({ collection: 'ALL' })}
                sx={{
                  justifyContent: 'space-between', py: 0.5, px: 1, borderRadius: 1, textTransform: 'none',
                  ...(filters.collection === 'ALL' ? { color: 'primary.main', bgcolor: 'rgba(212,175,55,0.1)', fontWeight: 'bold' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.05)' } })
                }}
              >
                <Typography sx={{ fontSize: '0.75rem' }}>All Collections</Typography>
              </Button>
              {Object.entries(facets.collections).map(([col, count]) => {
                const isSelected = filters.collection.toLowerCase() === col.toLowerCase();
                return (
                  <Button
                    key={col}
                    onClick={() => onChange({ collection: isSelected ? 'ALL' : col })}
                    sx={{
                      justifyContent: 'space-between', py: 0.5, px: 1, borderRadius: 1, textTransform: 'uppercase',
                      ...(isSelected ? { color: 'primary.main', bgcolor: 'rgba(212,175,55,0.1)', fontWeight: 'bold' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.05)' } })
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', }}>{col}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'text.disabled' }}>({count})</Typography>
                  </Button>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* 3. Price Filter (Dual Slider & Preset Chips) */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
        <Button
          fullWidth
          onClick={() => toggleSection('price')}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DollarSign size={13} color="#D4AF37" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Price Range (LKR)</Typography>
          </Box>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </Button>

        <Collapse in={openSections.price}>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.4)', p: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main' }}>LKR {filters.priceRange[0].toLocaleString()}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>—</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main' }}>LKR {filters.priceRange[1].toLocaleString()}</Typography>
            </Box>

            <Slider
              min={facets.priceRange.min || 0}
              max={facets.priceRange.max || 30000}
              step={500}
              value={filters.priceRange[1]}
              onChange={(_, newValue) => {
                const val = newValue as number;
                onChange({ priceRange: [filters.priceRange[0], Math.max(val, filters.priceRange[0])] });
              }}
              color="primary"
              sx={{ py: 1 }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                { label: '< 6K', min: 0, max: 6000 },
                { label: '6K - 10K', min: 6000, max: 10000 },
                { label: '10K - 15K', min: 10000, max: 15000 },
                { label: '15K+', min: 15000, max: 30000 }
              ].map((bracket) => {
                const isActive = filters.priceRange[0] === bracket.min && filters.priceRange[1] === bracket.max;
                return (
                  <Button
                    key={bracket.label}
                    onClick={() => onChange({ priceRange: [bracket.min, bracket.max] })}
                    sx={{
                      py: 0.5, px: 1, borderRadius: 1, minWidth: 'auto', border: '1px solid',
                      ...(isActive ? { bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main' } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } })
                    }}
                  >
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold' }}>{bracket.label}</Typography>
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* 4. Size Filter (S, M, L, XL, XXL) */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
        <Button
          fullWidth
          onClick={() => toggleSection('sizes')}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Maximize2 size={13} color="#D4AF37" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Size Selection</Typography>
          </Box>
          {openSections.sizes ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </Button>

        <Collapse in={openSections.sizes}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, pt: 2 }}>
            {ALL_SIZES.map((size) => {
              const isSelected = filters.sizes.includes(size);
              const count = facets.sizes[size] || 0;
              return (
                <Box
                  component="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  sx={{
                    py: 1, px: 0.5, borderRadius: 1, border: '1px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
                    ...(isSelected ? {
                      bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main', boxShadow: '0 5px 15px rgba(212,175,55,0.3)', transform: 'scale(1.05)'
                    } : {
                      bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', borderColor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'var(--text-primary)', borderColor: 'rgba(255,255,255,0.2)' }
                    })
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 900 }}>{size}</Typography>
                  <Typography sx={{ fontSize: '0.5625rem', color: isSelected ? 'rgba(0,0,0,0.8)' : 'text.disabled' }}>{count}</Typography>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      </Box>

      {/* 5. Color Swatches Filter */}
      {Object.keys(facets.colors).length > 0 && (
        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          <Button
            fullWidth
            onClick={() => toggleSection('colors')}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Palette size={13} color="#D4AF37" />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Colour Palette</Typography>
            </Box>
            {openSections.colors ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </Button>

          <Collapse in={openSections.colors}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, pt: 2 }}>
              {Object.entries(facets.colors).map(([colorName, { count, hex }]) => {
                const isSelected = filters.colors.includes(colorName);
                return (
                  <Box
                    component="button"
                    key={colorName}
                    onClick={() => toggleColor(colorName)}
                    sx={{
                      p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left',
                      ...(isSelected ? {
                        bgcolor: 'rgba(212,175,55,0.15)', borderColor: 'primary.main', color: 'var(--text-primary)'
                      } : {
                        bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' }
                      })
                    }}
                  >
                    <Box
                      sx={{
                        width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', bgcolor: hex, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {isSelected && <Check size={10} color={hex.toLowerCase().includes('fff') || hex.toLowerCase().includes('ede') ? 'black' : 'white'} />}
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', flex: 1,  fontFamily: '"Inter", sans-serif', fontWeight: isSelected ? 'bold' : 'normal' }}>{colorName}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: 'text.disabled' }}>({count})</Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* 6. Availability & Special States */}
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
        <Button
          fullWidth
          onClick={() => toggleSection('availability')}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Stock & Drops</Typography>
          </Box>
          {openSections.availability ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </Button>

        <Collapse in={openSections.availability}>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* In Stock Only */}
            <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
              <Checkbox
                checked={filters.inStockOnly}
                onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                sx={{ p: 0.5, color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: 'primary.main' } }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>In Stock Ready to Ship ({facets.totalInStock})</Typography>
            </Box>

            {/* Sale Items Only */}
            <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
              <Checkbox
                checked={filters.isSaleOnly}
                onChange={(e) => onChange({ isSaleOnly: e.target.checked })}
                sx={{ p: 0.5, color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: 'primary.main' } }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'error.main', fontWeight: 'bold' }}>Special Offers & Sale ({facets.totalOnSale})</Typography>
            </Box>

            {/* New Arrivals Only */}
            <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
              <Checkbox
                checked={filters.isNewOnly}
                onChange={(e) => onChange({ isNewOnly: e.target.checked })}
                sx={{ p: 0.5, color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: 'primary.main' } }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>New Drop Arrivals Only</Typography>
            </Box>

            {/* Best Sellers */}
            <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
              <Checkbox
                checked={filters.isBestSellerOnly}
                onChange={(e) => onChange({ isBestSellerOnly: e.target.checked })}
                sx={{ p: 0.5, color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: 'primary.main' } }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Best Sellers Restocked</Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
