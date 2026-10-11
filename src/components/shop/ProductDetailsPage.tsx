import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { ProductVariant } from '../../types/ecommerce';
import { ProductImageGallery } from './ProductImageGallery';
import { SizeChartModal } from './SizeChartModal';
import { ProductCard } from '../ui/ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { getProductSEOMetadata, applySEOMetadata } from '../../utils/seo';
import { 
  ShoppingBag, 
  CreditCard, 
  Sparkles, 
  Ruler, 
  Truck, 
  RefreshCw, 
  Share2, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ChevronRight, 
  Heart, 
  Copy, 
  MessageCircle 
} from 'lucide-react';
import { 
  Box, Typography, Container, Grid, Button, IconButton, Chip, Divider
} from '@mui/material';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { 
    products, 
    addToCart, 
    setIsCartOpen, 
    setIsCheckoutOpen, 
    setCustomStudioProduct, 
    showToast 
  } = useStore();

  // Find product by slug (or fallback by ID if slug not found)
  const product = useMemo(() => {
    return products.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug
    ) || null;
  }, [products, slug]);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('valknut_wishlist');
      const list: string[] = saved ? JSON.parse(saved) : [];
      return product ? list.includes(product.id) : false;
    } catch {
      return false;
    }
  });

  // Size chart modal state
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize selected color and size from product variants
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVar = product.variants[0];
      setSelectedColor(firstVar.color);
      setSelectedSize(firstVar.size as any);
      setQuantity(1);
    }
  }, [product]);

  // Dynamic SEO & Structured Data updates
  useEffect(() => {
    if (product) {
      const seoMeta = getProductSEOMetadata(product);
      applySEOMetadata(seoMeta, product);
    }
  }, [product]);

  if (!product) {
    return (
      <>
        <Box sx={{ width: '100%', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10, px: 2, bgcolor: 'var(--bg-main)' }}>
          <Box sx={{ maxWidth: 450, width: '100%', bgcolor: 'var(--bg-surface)', p: 4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, textAlign: 'center' }}>
            <EmptyState
              title="PRODUCT NOT FOUND"
              description="The streetwear piece you are looking for might have sold out or been moved to a new collection."
              actionText="EXPLORE ALL PRODUCTS"
              onAction={() => {
                window.location.hash = '#/shop';
              }}
            />
          </Box>
        </Box>
      </>
    );
  }

  // Get available colors with unique hexes
  const availableColors = Array.from(
    new Map(
      product.variants.map((v) => [v.color, { color: v.color, colorHex: v.colorHex || '#000000', image: v.image }])
    ).values()
  );

  // Available sizes across product
  const allPossibleSizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Current active variant matching current color + size
  const activeVariant: ProductVariant | undefined = product.variants.find(
    (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === selectedSize
  );

  // Variant stock & availability status
  const currentStock = activeVariant?.stock ?? activeVariant?.stockCount ?? 0;
  const isOutOfStock = !activeVariant || currentStock <= 0;

  // Pricing (Support variant-specific price or base product price)
  const currentPrice = activeVariant?.price ?? product.price;
  const currentSalePrice = activeVariant?.salePrice ?? product.salePrice;
  const hasSale = Boolean(currentSalePrice && currentSalePrice < currentPrice);
  const displayPrice = currentSalePrice ?? currentPrice;
  const discountPercent = hasSale ? Math.round(((currentPrice - (currentSalePrice || 0)) / currentPrice) * 100) : 0;

  // SKU display
  const activeSku = activeVariant?.sku || `VK-${product.slug.toUpperCase().slice(0, 10)}`;

  // Related & Recommended products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  const recommendedProducts = products
    .filter((p) => p.id !== product.id && p.collection === product.collection && !relatedProducts.some((r) => r.id === p.id))
    .slice(0, 4);

  const displayRecommendations = recommendedProducts.length >= 2 ? recommendedProducts : products.filter((p) => p.id !== product.id).slice(0, 4);

  // Cart operations
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const colorHex = activeVariant?.colorHex || '#000000';
    addToCart(product, selectedSize, selectedColor, colorHex, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const colorHex = activeVariant?.colorHex || '#000000';
    addToCart(product, selectedSize, selectedColor, colorHex, quantity);
    setIsCheckoutOpen(true);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem('valknut_wishlist');
        let list: string[] = saved ? JSON.parse(saved) : [];
        list = next ? [...list, product.id] : list.filter((id) => id !== product.id);
        localStorage.setItem('valknut_wishlist', JSON.stringify(list));
      } catch (e) {
        console.warn('Wishlist storage error', e);
      }
      showToast(next ? `Saved "${product.name}" to wishlist` : `Removed from wishlist`, 'info');
      return next;
    });
  };

  const handleOpenCustomStudio = () => {
    setCustomStudioProduct(product);
    window.location.hash = '#/custom-studio';
  };

  // Social sharing
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'success');
    setIsShareDropdownOpen(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out ${product.name} at VALKNUT Official: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setIsShareDropdownOpen(false);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Own your mind with ${product.name} from @valknutofficial. ${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setIsShareDropdownOpen(false);
  };

  return (
    <>
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 4, md: 8 }, WebkitFontSmoothing: 'antialiased' }}>
        <Container maxWidth="xl">
          
          {/* Breadcrumbs */}
          <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 4, pb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box component="a" href="#/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' } }}>Home</Box>
            <ChevronRight size={12} />
            <Box component="a" href="#/shop" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' } }}>Shop</Box>
            <ChevronRight size={12} />
            <Box component="a" href={`#/shop/${product.category.toLowerCase()}`} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' } }}>{product.category}</Box>
            <ChevronRight size={12} />
            <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: 'inherit' }}>{product.name}</Typography>
          </Box>

          <Grid container spacing={{ xs: 6, lg: 10 }}>
            
            {/* Left: Image Gallery */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                activeColorImage={activeVariant?.image}
              />
            </Grid>

            {/* Right: Product Info & Actions */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 120 }}>
                
                {/* Header & Badges */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    {hasSale && <Chip label="SALE" sx={{ bgcolor: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171', fontSize: '0.625rem', fontWeight: 'bold', height: 24 }} />}
                    {product.isBestSeller && <Chip label="BEST SELLER" sx={{ bgcolor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: 'primary.main', fontSize: '0.625rem', fontWeight: 'bold', height: 24 }} />}
                    {product.isNewArrival && <Chip label="NEW DROP" sx={{ bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', fontSize: '0.625rem', fontWeight: 'bold', height: 24 }} />}
                  </Box>

                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', letterSpacing: '0.2em', color: 'primary.main', textTransform: 'uppercase', mb: 1 }}>
                    {product.subCategory}
                  </Typography>

                  <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 2, color: 'var(--text-primary)' }}>
                    {product.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 3 }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      LKR {displayPrice.toLocaleString()}
                    </Typography>
                    {hasSale && (
                      <>
                        <Typography sx={{ fontSize: '1rem', color: 'var(--text-secondary)', textDecoration: 'line-through', mb: 0.5 }}>
                          LKR {currentPrice.toLocaleString()}
                        </Typography>
                        <Chip label={`SAVE ${discountPercent}%`} sx={{ bgcolor: 'rgba(212,175,55,0.2)', color: 'primary.main', fontSize: '0.625rem', fontWeight: 'bold', height: 20, mb: 1 }} />
                      </>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      SKU: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{activeSku}</Box>
                    </Typography>
                    <IconButton 
                      onClick={handleToggleWishlist}
                      sx={{ color: isWishlisted ? 'error.main' : 'text.secondary', transition: 'all 0.3s ease', '&:hover': { color: 'error.main', transform: 'scale(1.1)' } }}
                    >
                      <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* 1. Color Selector */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                      Color: <Box component="span" sx={{ color: 'var(--text-secondary)', fontWeight: 'normal', ml: 0.5 }}>{selectedColor}</Box>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {availableColors.map((c) => {
                      const isSelected = selectedColor === c.color;
                      return (
                        <Box
                          component="button"
                          key={c.color}
                          onClick={() => setSelectedColor(c.color)}
                          title={c.color}
                          sx={{
                            width: 40, height: 40, borderRadius: '50%', p: 0.5, border: '1px solid',
                            borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.2)',
                            cursor: 'pointer', transition: 'all 0.3s ease', bgcolor: 'transparent',
                            ...(isSelected && { boxShadow: '0 0 10px rgba(212,175,55,0.4)' }),
                            '&:hover': { borderColor: isSelected ? 'primary.main' : 'white' }
                          }}
                        >
                          <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', bgcolor: c.colorHex, border: '1px solid rgba(255,255,255,0.1)' }} />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* 2. Size Selector */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                      Size: <Box component="span" sx={{ color: 'var(--text-secondary)', fontWeight: 'normal', ml: 0.5 }}>{selectedSize}</Box>
                    </Typography>
                    <Button
                      onClick={() => setIsSizeChartOpen(true)}
                      sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', p: 0, minWidth: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    >
                      <Ruler size={12} /> Size Guide
                    </Button>
                  </Box>
                  <Grid container spacing={1}>
                    {allPossibleSizes.map((sz) => {
                      const isAvailableForSize = product.variants.some((v) => v.color === selectedColor && v.size === sz && (v.stock > 0 || v.stockCount! > 0));
                      const isSelected = selectedSize === sz;
                      return (
                        <Grid size={{ xs: 2.4 }} key={sz}>
                          <Box
                            component="button"
                            disabled={!isAvailableForSize}
                            onClick={() => { setSelectedSize(sz); setQuantity(1); }}
                            sx={{
                              width: '100%', py: 1.5, borderRadius: 1, border: '1px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: isAvailableForSize ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                              ...(isSelected ? {
                                bgcolor: 'primary.main', color: 'black', borderColor: 'primary.main', boxShadow: '0 10px 20px rgba(212,175,55,0.3)', transform: 'scale(1.02)'
                              } : isAvailableForSize ? {
                                bgcolor: '#12141F', color: 'var(--text-primary)', borderColor: 'rgba(255,255,255,0.1)', '&:hover': { borderColor: 'rgba(255,255,255,0.3)' }
                              } : {
                                bgcolor: 'rgba(255,255,255,0.02)', color: 'text.disabled', borderColor: 'rgba(255,255,255,0.05)', textDecoration: 'line-through'
                              })
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, fontFamily: '"Inter", sans-serif' }}>{sz}</Typography>
                            <Typography sx={{ fontSize: '0.5rem', fontFamily: '"Inter", sans-serif', color: isSelected ? 'rgba(0,0,0,0.7)' : isAvailableForSize ? 'text.secondary' : 'error.main', fontWeight: 'bold' }}>
                              {isAvailableForSize ? 'IN STOCK' : 'OUT'}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                {/* 3. Quantity & Action Buttons */}
                <Box sx={{ pt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    
                    {/* Quantity Control */}
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#12141F', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, p: 0.5 }}>
                      <IconButton
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        sx={{ width: 32, height: 32, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.1)' } }}
                      >
                        <Minus size={14} />
                      </IconButton>
                      <Typography sx={{ width: 40, textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => setQuantity((q) => Math.min(Math.min(currentStock || 10, 10), q + 1))}
                        disabled={quantity >= (currentStock || 10) || isOutOfStock}
                        sx={{ width: 32, height: 32, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.1)' } }}
                      >
                        <Plus size={14} />
                      </IconButton>
                    </Box>

                    {/* Add to Cart CTA */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      sx={{
                        flex: 1, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(212,175,55,0.3)',
                        '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)', boxShadow: '0 15px 35px rgba(212,175,55,0.4)' },
                        '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'text.disabled' }
                      }}
                    >
                      <ShoppingBag size={16} />
                      {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                    </Button>
                  </Box>

                  {/* Buy Now Direct CTA */}
                  {!isOutOfStock && (
                    <Button
                      onClick={handleBuyNow}
                      sx={{
                        w: '100%', width: '100%', py: 1.5, bgcolor: 'var(--text-primary)', color: 'black', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, transition: 'all 0.3s ease', mb: 2,
                        '&:hover': { bgcolor: '#e2e8f0' }
                      }}
                    >
                      <CreditCard size={16} /> BUY IT NOW
                    </Button>
                  )}

                  {/* Bespoke Custom Studio Entry if available */}
                  {product.isCustomizable && (
                    <Button
                      onClick={handleOpenCustomStudio}
                      sx={{
                        w: '100%', width: '100%', py: 1.5, bgcolor: 'transparent', color: 'primary.main', border: '1px solid rgba(212,175,55,0.5)', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' }
                      }}
                    >
                      <Sparkles size={14} /> CUSTOMIZE GRAPHICS IN 3D STUDIO (+LKR 1,500)
                    </Button>
                  )}
                </Box>

                {/* Sharing & Trust Strip */}
                <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldCheck size={14} color="#D4AF37" /> 100% Guaranteed Authentic
                  </Typography>

                  {/* Share Menu */}
                  <Box sx={{ position: 'relative' }}>
                    <Button
                      onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                      sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', minWidth: 'auto', p: 0, textTransform: 'none', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
                    >
                      <Share2 size={12} /> Share Drop
                    </Button>

                    {isShareDropdownOpen && (
                      <Box sx={{ position: 'absolute', right: 0, bottom: '100%', mb: 1, bgcolor: '#12141F', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, p: 1, minWidth: 170, boxShadow: '0 25px 50px rgba(0,0,0,0.8)', zIndex: 30, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Button onClick={handleCopyLink} sx={{ justifyContent: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', p: 1, textTransform: 'none', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }} startIcon={<Copy size={12} />}>Copy Link</Button>
                        <Button onClick={handleShareWhatsApp} sx={{ justifyContent: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', p: 1, textTransform: 'none', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }} startIcon={<MessageCircle size={12} />}>WhatsApp</Button>
                        <Button onClick={handleShareTwitter} sx={{ justifyContent: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', p: 1, textTransform: 'none', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }} startIcon={<Share2 size={12} />}>X / Twitter</Button>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Accordion Specs: Description, Material, Shipping, Returns */}
                <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', mb: 1 }}>Product Overview & Story</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{product.description}</Typography>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', mb: 1 }}>Material & Care Instructions</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', mb: 0.5 }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Fabric:</Box> {product.material}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Care:</Box> {product.careInstructions}</Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><Truck size={14} color="#D4AF37" /> DELIVERY</Typography>
                        <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>2-3 days in Colombo. Islandwide 3-5 days. Free over LKR 25,000.</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><RefreshCw size={14} color="#D4AF37" /> 7-DAY RETURN</Typography>
                        <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>Hassle-free size exchange within 7 days of delivery.</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                </Box>

              </Box>
            </Grid>

          </Grid>

          {/* Related Drops & Recommended Streetwear */}
          {displayRecommendations.length > 0 && (
            <Box sx={{ pt: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 }, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase', mb: 1 }}>
                    COMPLETE YOUR WARDROBE
                  </Typography>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'var(--text-primary)' }}>
                    RELATED PIECES & CAPSULES
                  </Typography>
                </Box>

                <Button href="#/shop" sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }} endIcon={<ChevronRight size={14} />}>
                  Browse All Shop
                </Button>
              </Box>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {displayRecommendations.map((rec) => (
                  <Grid size={{ xs: 6, md: 3 }} key={rec.id}>
                    <ProductCard product={rec} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

        </Container>

        <SizeChartModal
          isOpen={isSizeChartOpen}
          onClose={() => setIsSizeChartOpen(false)}
        />
      </Box>
    </>
  );
};
