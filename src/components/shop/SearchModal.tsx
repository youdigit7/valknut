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
import { Modal, Backdrop, Fade, Box, InputBase, IconButton, Typography, Button, CircularProgress } from '@mui/material';

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
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setResults([]);
      setSelectedTag(null);
    }
  }, [isOpen]);

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
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }
        },
      }}
      sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: { xs: 8, sm: 12 }, px: 2, overflowY: 'auto' }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 768,
            bgcolor: 'var(--bg-surface)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 2,
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            mb: 6
          }}
        >
          {/* Header & Input */}
          <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: '1px solid var(--border-subtle)', bgcolor: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'var(--bg-card)', border: '1px solid rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', flexShrink: 0 }}>
              <Search size={18} />
            </Box>

            <Box sx={{ flex: 1, position: 'relative' }}>
              <InputBase
                inputRef={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleViewAllResults();
                  }
                }}
                placeholder="Search collection, product name, or SKU..."
                sx={{ width: '100%', color: 'var(--text-primary)', '& input': { p: 0, '&::placeholder': { color: 'var(--text-secondary)', opacity: 1 } }, fontSize: { xs: '0.875rem', sm: '1rem' }, fontFamily: '"Inter", sans-serif' }}
              />
            </Box>

            {query && (
              <IconButton
                onClick={() => setQuery('')}
                sx={{ p: 1, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'var(--border-subtle)' } }}
                title="Clear input"
              >
                <X size={16} />
              </IconButton>
            )}

            <Button
              onClick={onClose}
              sx={{ px: 2, py: 1, borderRadius: 10, bgcolor: 'var(--border-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'var(--border-strong)' }, minWidth: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
              aria-label="Close search"
            >
              <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold' }}>ESC</Typography>
              <X size={14} />
            </Button>
          </Box>

          {/* Quick Filter Tags */}
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1, flexShrink: 0 }}>
              <Layers size={12} color="#D4AF37" />
              <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>QUICK:</Typography>
            </Box>
            {['All', 'Hoodies', 'Oversized Tees', 'Joggers', 'Accessories', 'Men', 'Women'].map((tag) => {
              const isActive = (tag === 'All' && !selectedTag) || selectedTag === tag;
              return (
                <Button
                  key={tag}
                  onClick={() => setSelectedTag(tag === 'All' || selectedTag === tag ? null : tag)}
                  sx={{
                    px: 1.5, py: 0.5, borderRadius: 10, minWidth: 'auto', flexShrink: 0, fontSize: '0.6875rem', fontWeight: isActive ? 'bold' : 'normal', textTransform: 'none', border: '1px solid', transition: 'all 0.3s ease',
                    ...(isActive ? { background: 'linear-gradient(to right, #e6c042, #D4AF37, #aa8010)', color: '#000000', borderColor: 'transparent', boxShadow: '0 2px 5px rgba(212,175,55,0.3)' } : { bgcolor: 'var(--bg-main)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'var(--border-subtle)' } })
                  }}
                >
                  {tag}
                </Button>
              );
            })}
          </Box>

          {/* Body Content */}
          <Box sx={{ p: { xs: 2.5, sm: 3 }, maxHeight: '58vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {isLoading && (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <CircularProgress size={28} sx={{ color: 'primary.main' }} />
                <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Searching archives...</Typography>
              </Box>
            )}

            {!isLoading && (query.trim() !== '' || selectedTag) && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, mb: 2, borderBottom: '1px solid var(--border-subtle)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                    Found {results.length} {results.length === 1 ? 'Product' : 'Products'}
                  </Typography>
                  {results.length > 0 && (
                    <Button
                      onClick={handleViewAllResults}
                      endIcon={<ArrowRight size={13} />}
                      sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#f3e5ab' } }}
                    >
                      Explore all in Shop
                    </Button>
                  )}
                </Box>

                {results.length === 0 ? (
                  <Box sx={{ py: 7, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Package size={36} color="var(--text-secondary)" />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No matching pieces found</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.6 }}>Try searching with broader terms like &ldquo;hoodie&rdquo;, &ldquo;tee&rdquo;, or select from the quick categories above.</Typography>
                    <Button
                      onClick={() => { setQuery(''); setSelectedTag(null); }}
                      sx={{ mt: 1, px: 2.5, py: 1, bgcolor: 'var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 10, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', '&:hover': { bgcolor: 'var(--border-strong)' } }}
                    >
                      Clear Search Query
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    {results.map((product) => {
                      const totalStock = product.variants.reduce((s, v) => s + (v.stock ?? v.stockCount ?? 0), 0);
                      const isSoldOut = totalStock === 0;
                      const hasSale = Boolean(product.salePrice && product.salePrice < product.price);

                      return (
                        <Box
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, bgcolor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'var(--bg-card-inner)', borderColor: 'var(--border-gold)', transform: 'translateY(-2px)', '& h4': { color: 'primary.main' }, '& .eye-icon': { color: 'var(--text-primary)', bgcolor: 'var(--border-subtle)' } } }}
                        >
                          <Box sx={{ width: 64, height: 80, bgcolor: 'var(--bg-card-inner)', borderRadius: 1, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                            {product.images[0] ? (
                              <Box component="img" src={product.images[0]} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', fontWeight: 'bold', fontSize: '0.75rem' }}>V</Box>
                            )}
                            {isSoldOut && (
                              <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(1px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ fontSize: '0.5rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'error.light', textTransform: 'uppercase' }}>Sold Out</Typography>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.subCategory}</Typography>
                              {product.collection && (
                                <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', textTransform: 'uppercase',  maxWidth: 120 }}>• {product.collection}</Typography>
                              )}
                            </Box>

                            <Typography component="h4" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif',  transition: 'color 0.3s ease' }}>
                              {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', color: 'var(--text-primary)' }}>
                                LKR {(product.salePrice ?? product.price).toLocaleString()}
                              </Typography>
                              {hasSale && (
                                <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                                  LKR {product.price.toLocaleString()}
                                </Typography>
                              )}
                            </Box>

                            {product.variants[0]?.sku && (
                              <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', }}>
                                SKU: {product.variants[0].sku}
                              </Typography>
                            )}
                          </Box>

                          <Box className="eye-icon" sx={{ p: 1, borderRadius: '50%', color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}>
                            <Eye size={16} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {!query.trim() && !selectedTag && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1.5 }}>
                    <TrendingUp size={14} />
                    <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular Searches</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {TRENDING_SEARCHES.map((term) => (
                      <Button
                        key={term}
                        onClick={() => handleApplyTrending(term)}
                        startIcon={<Tag size={11} color="rgba(212,175,55,0.7)" />}
                        sx={{ px: 2, py: 1, bgcolor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', textTransform: 'none', transition: 'all 0.3s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'var(--border-subtle)', borderColor: 'primary.main', color: 'var(--text-primary)' } }}
                      >
                        {term}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ pt: 2, borderTop: '1px solid var(--border-subtle)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)', mb: 1.5 }}>
                    <Sparkles size={12} color="#D4AF37" />
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FEATURED VALKNUT DROPS</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                    {[
                      { name: 'DARK SOVEREIGN 2026', desc: '480GSM Sovereign Fleece' },
                      { name: 'ESSENTIAL SIGNATURE', desc: 'Boxy Combed Jersey Tees' },
                      { name: 'STEALTH LABS', desc: 'Cordura Tactical Bags & Joggers' }
                    ].map((drop) => (
                      <Box
                        key={drop.name}
                        onClick={() => { setQuery(drop.name); }}
                        sx={{ p: 2, borderRadius: 1, bgcolor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'var(--bg-card-inner)', borderColor: 'primary.main', transform: 'translateY(-2px)' } }}
                      >
                        <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main', fontWeight: 'bold', mb: 0.5, textTransform: 'uppercase' }}>COLLECTION</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)',  fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase' }}>{drop.name}</Typography>
                        <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)',  mt: 0.5 }}>{drop.desc}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'var(--bg-main)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyItems: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, color: 'var(--text-secondary)', flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>Press</Typography>
              <CornerDownLeft size={13} color="#D4AF37" />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>to search catalog</Typography>
            </Box>

            <Button
              onClick={handleViewAllResults}
              endIcon={<ArrowRight size={14} />}
              sx={{ width: { xs: '100%', sm: 'auto' }, px: 3, py: 1.25, background: 'linear-gradient(to right, #e6c042, #D4AF37, #aa8010)', color: '#000000', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(212,175,55,0.3)', '&:hover': { transform: 'translateY(-2px)', background: 'linear-gradient(to right, #f4d455, #E2B714, #c99616)' } }}
            >
              {query.trim() ? `Search "${query.trim()}" in Shop` : 'Browse Complete Shop'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
