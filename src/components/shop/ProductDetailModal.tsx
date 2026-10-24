import React, { useState, useEffect, useMemo } from 'react';
import type { Product, ProductSize } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { SizeChartModal } from './SizeChartModal';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Ruler, 
  Truck, 
  RefreshCw, 
  Share2, 
  ShieldCheck,
  Heart,
  ExternalLink,
  Minus,
  Plus
} from 'lucide-react';
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Button, Chip } from '@mui/material';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen, setCustomStudioProduct, showToast } = useStore();

  // Cache display product so exit animation runs smoothly
  const [displayProduct, setDisplayProduct] = useState<Product | null>(product);

  useEffect(() => {
    if (product) {
      setDisplayProduct(product);
    }
  }, [product]);

  const activeProduct = product || displayProduct;

  const variants = useMemo(() => {
    return Array.isArray(activeProduct?.variants) ? activeProduct.variants : [];
  }, [activeProduct]);

  const images = useMemo(() => {
    if (Array.isArray(activeProduct?.images) && activeProduct.images.length > 0) {
      return activeProduct.images;
    }
    return ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'];
  }, [activeProduct]);

  // Selections
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Onyx Black');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reinitialize state whenever a new product is selected
  useEffect(() => {
    if (!product) return;
    const firstVariant = product.variants?.[0];
    const initialColor = firstVariant?.color || 'Onyx Black';
    const initialSize = (firstVariant?.size as ProductSize) || 'M';

    setSelectedColor(initialColor);
    setSelectedSize(initialSize);
    setActiveImgIndex(0);
    setQuantity(1);

    // Sync wishlist status
    try {
      const saved = localStorage.getItem('valknut_wishlist');
      const list: string[] = saved ? JSON.parse(saved) : [];
      setIsWishlisted(list.includes(product.id));
    } catch {
      setIsWishlisted(false);
    }
  }, [product?.id]);

  // Available unique colors with fallback
  const availableColors = useMemo(() => {
    return Array.from(new Set(variants.map(v => v.color)));
  }, [variants]);

  // Handle color change and auto-adjust size if selectedSize is not available for new color
  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    const variantsForNewColor = variants.filter(v => v.color === newColor);
    const sizeStillAvailable = variantsForNewColor.some(v => v.size === selectedSize);
    if (!sizeStillAvailable && variantsForNewColor.length > 0) {
      setSelectedSize(variantsForNewColor[0].size);
    }
  };

  // Exact matching variant
  const selectedVariant = useMemo(() => {
    return variants.find(
      v => v.size === selectedSize && v.color.toLowerCase() === selectedColor.toLowerCase()
    );
  }, [variants, selectedSize, selectedColor]);

  // Stock & Availability
  const stockCount = selectedVariant 
    ? (selectedVariant.stock ?? selectedVariant.stockCount ?? 0) 
    : 0;
  const isOutOfStock = !selectedVariant || stockCount <= 0;

  // Selected color hex code
  const selectedColorHex = selectedVariant?.colorHex 
    || variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase())?.colorHex 
    || '#000000';

  // Pricing calculations (support variant pricing fallback to product base price)
  const currentPrice = selectedVariant?.price ?? activeProduct?.price ?? 0;
  const currentSalePrice = selectedVariant?.salePrice ?? activeProduct?.salePrice;
  const hasSale = Boolean(currentSalePrice && currentSalePrice < currentPrice);
  const displayPrice = currentSalePrice ?? currentPrice;

  const allPossibleSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const isApparel = Boolean(activeProduct && (activeProduct.category === 'MEN' || activeProduct.category === 'WOMEN' || activeProduct.isCustomizable));
  const availableSizes = useMemo(() => {
    const fromVariants = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
    if (fromVariants.length > 0) {
      const hasCustom = fromVariants.some(sz => !allPossibleSizes.includes(sz as any));
      if (hasCustom) return fromVariants;
    }
    if (isApparel) return allPossibleSizes;
    return fromVariants.length > 0 ? fromVariants : allPossibleSizes;
  }, [variants, isApparel]);

  if (!activeProduct) return null;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Selected size is out of stock. Please select an available size.', 'error');
      return;
    }
    addToCart(
      activeProduct,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast('Selected size is out of stock. Please select an available size.', 'error');
      return;
    }
    addToCart(
      activeProduct,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleOpenStudio = () => {
    setCustomStudioProduct(activeProduct);
    onClose();
    window.location.hash = '#/custom-studio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFullPage = () => {
    onClose();
    window.location.hash = `#/product/${activeProduct.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/product/${activeProduct.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeProduct.name} | VALKNUT Official`,
          text: `Check out ${activeProduct.name} at VALKNUT Official`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareUrl);
    showToast('Product link copied to clipboard!', 'info');
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(prev => {
      const next = !prev;
      try {
        const saved = localStorage.getItem('valknut_wishlist');
        let list: string[] = saved ? JSON.parse(saved) : [];
        list = next ? [...list, activeProduct.id] : list.filter(id => id !== activeProduct.id);
        localStorage.setItem('valknut_wishlist', JSON.stringify(list));
      } catch (e) {
        console.warn('Wishlist storage error', e);
      }
      showToast(next ? `Saved "${activeProduct.name}" to wishlist` : 'Removed from wishlist', 'info');
      return next;
    });
  };

  return (
    <>
      <Modal
        open={Boolean(product)}
        onClose={onClose}
        closeAfterTransition
        disableRestoreFocus
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }
          },
        }}
      >
        <Fade in={Boolean(product)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '94%', 
            maxWidth: 1000, 
            maxHeight: '92vh', 
            bgcolor: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 2, 
            boxShadow: 'var(--shadow-card)', 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            overflow: 'hidden', 
            outline: 'none' 
          }}>
            
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 20, 
                bgcolor: 'rgba(0,0,0,0.6)', 
                color: 'var(--text-secondary)', 
                border: '1px solid var(--border-subtle)', 
                backdropFilter: 'blur(10px)', 
                '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(0,0,0,0.8)' } 
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </IconButton>

            {/* Left Column: Image Gallery */}
            <Box sx={{ 
              width: { xs: '100%', md: '50%' }, 
              bgcolor: 'var(--bg-main)', 
              p: { xs: 2.5, md: 4 }, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              borderBottom: { xs: '1px solid var(--border-subtle)', md: 'none' }, 
              borderRight: { md: '1px solid var(--border-subtle)' } 
            }}>
              {/* Main Featured Image */}
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 1.5, overflow: 'hidden', mb: 2, bgcolor: 'var(--bg-card-inner)' }}>
                <Box
                  component="img"
                  src={images[activeImgIndex] || images[0]}
                  alt={activeProduct.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                />
                
                {/* Wishlist Button floating over image */}
                <IconButton
                  onClick={handleToggleWishlist}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    color: isWishlisted ? '#ef4444' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ef4444',
                      bgcolor: 'rgba(0,0,0,0.85)',
                      transform: 'scale(1.1)'
                    }
                  }}
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
                </IconButton>
              </Box>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {images.map((img, idx) => (
                    <Box
                      component="button"
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      aria-label={`View thumbnail ${idx + 1}`}
                      sx={{
                        position: 'relative', width: 62, height: 62, borderRadius: 1, overflow: 'hidden', border: '2px solid', transition: 'all 0.25s ease', flexShrink: 0, cursor: 'pointer', p: 0,
                        ...(activeImgIndex === idx ? { borderColor: 'primary.main', opacity: 1, transform: 'scale(1.02)' } : { borderColor: 'transparent', opacity: 0.5, '&:hover': { opacity: 0.9 } })
                      }}
                    >
                      <Box component="img" src={img} alt={`Thumbnail ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Column: Details & Actions */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', maxHeight: { xs: '55vh', md: '92vh' }, gap: 3 }}>
              <Box>
                {/* Collection / Subcategory & Action row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 900, letterSpacing: '0.25em', color: 'primary.main', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>
                    {activeProduct.collection || activeProduct.category}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button 
                      onClick={handleShare} 
                      startIcon={<Share2 size={13} />}
                      sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', p: 0.5, minWidth: 'auto', textTransform: 'none', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
                    >
                      Share
                    </Button>
                    <Typography sx={{ color: 'var(--border-subtle)', fontSize: '0.75rem' }}>|</Typography>
                    <Button
                      onClick={handleViewFullPage}
                      endIcon={<ExternalLink size={12} />}
                      sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, p: 0.5, minWidth: 'auto', textTransform: 'none', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                      Full Page
                    </Button>
                  </Box>
                </Box>

                {/* Title */}
                <Typography 
                  variant="h2"
                  onClick={handleViewFullPage}
                  sx={{ fontSize: { xs: '1.375rem', sm: '1.625rem' }, fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 1.5, cursor: 'pointer', transition: 'color 0.2s ease', '&:hover': { color: 'primary.main' } }}
                >
                  {activeProduct.name}
                </Typography>

                {/* Pricing row */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)' }}>
                    LKR {displayPrice.toLocaleString()}
                  </Typography>
                  {hasSale && (
                    <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      LKR {currentPrice.toLocaleString()}
                    </Typography>
                  )}
                  {hasSale && (
                    <Chip 
                      label={`SAVE LKR ${(currentPrice - (currentSalePrice || 0)).toLocaleString()}`} 
                      sx={{ bgcolor: 'rgba(220,38,38,0.2)', color: '#f87171', border: '1px solid rgba(220,38,38,0.4)', fontSize: '0.6875rem', fontWeight: 'bold', height: 24, ml: 1, borderRadius: '6px' }} 
                    />
                  )}
                </Box>

                {/* Installment Info */}
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', mb: 2 }}>
                  Or 3 payments of <Box component="strong" sx={{ color: 'var(--text-primary)' }}>LKR {Math.round(displayPrice / 3).toLocaleString()}</Box> with <Box component="span" sx={{ color: '#e879f9', fontWeight: 700 }}>KOKO</Box> or <Box component="span" sx={{ color: '#2dd4bf', fontWeight: 700 }}>mintpay</Box>
                </Typography>

                {/* Stock Status Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: isOutOfStock ? 'error.main' : stockCount <= 5 ? 'warning.main' : 'success.main', 
                    animation: stockCount <= 5 && !isOutOfStock ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' 
                  }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {isOutOfStock ? 'Out of Stock in this combination' : stockCount <= 5 ? `Low Stock — Only ${stockCount} Left!` : 'In Stock & Ready to Ship'}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, mb: 3, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {activeProduct.description}
                </Typography>

                {/* Color Selector */}
                {availableColors.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', mb: 1 }}>
                      Select Colour: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{selectedColor}</Box>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                      {availableColors.map((colorName) => {
                        const variantMatch = variants.find(v => v.color.toLowerCase() === colorName.toLowerCase());
                        const hex = variantMatch?.colorHex || '#000000';
                        const isSelected = selectedColor.toLowerCase() === colorName.toLowerCase();

                        return (
                          <Button
                            key={colorName}
                            onClick={() => handleColorChange(colorName)}
                            sx={{
                              px: 1.5, py: 0.75, borderRadius: '10px', border: '1px solid', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.25s ease', textTransform: 'none',
                              ...(isSelected 
                                ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.12)', color: 'var(--text-primary)', boxShadow: '0 0 10px rgba(212,175,55,0.2)' } 
                                : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-main)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } })
                            }}
                          >
                            <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', bgcolor: hex }} />
                            <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{colorName}</Typography>
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Size Selector + Size Chart Link */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                      Select Size: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{selectedSize}</Box>
                    </Typography>
                    <Button
                      onClick={() => setIsSizeChartOpen(true)}
                      startIcon={<Ruler size={13} />}
                      sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                      Size Guide
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                    {availableSizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      const sizeVariant = variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === sz);
                      const sizeStock = sizeVariant ? (sizeVariant.stock ?? sizeVariant.stockCount ?? 0) : 0;
                      const isSizeOutOfStock = !sizeVariant || sizeStock <= 0;

                      return (
                        <Button
                          key={sz}
                          onClick={() => setSelectedSize(sz as any)}
                          sx={{
                            width: 50, height: 46, borderRadius: '10px', fontWeight: 800, fontSize: '0.8125rem', fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid', transition: 'all 0.25s ease', minWidth: 'auto', p: 0,
                            ...(isSelected 
                              ? { borderColor: 'primary.main', bgcolor: 'primary.main', color: 'black', boxShadow: '0 8px 16px rgba(212,175,55,0.3)', transform: 'scale(1.05)' } 
                              : isSizeOutOfStock
                              ? { borderColor: 'var(--border-subtle)', bgcolor: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)', opacity: 0.45, '&:hover': { borderColor: 'var(--border-strong)', opacity: 0.8 } }
                              : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-main)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } })
                          }}
                        >
                          {sz}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                {/* Quantity Stepper with Stock Limit Enforcement */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '10px', bgcolor: 'var(--bg-main)', height: 42 }}>
                    <IconButton 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      disabled={quantity <= 1 || isOutOfStock}
                      sx={{ width: 38, height: 38, color: 'var(--text-primary)', borderRadius: '10px', '&:hover': { bgcolor: 'var(--border-subtle)' }, '&.Mui-disabled': { opacity: 0.3 } }}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Typography sx={{ width: 38, textAlign: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
                      {quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => setQuantity(q => Math.min(stockCount > 0 ? stockCount : 1, q + 1))} 
                      disabled={quantity >= stockCount || isOutOfStock}
                      sx={{ width: 38, height: 38, color: 'var(--text-primary)', borderRadius: '10px', '&:hover': { bgcolor: 'var(--border-subtle)' }, '&.Mui-disabled': { opacity: 0.3 } }}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Box>
                  {stockCount > 0 && stockCount <= 5 && (
                    <Typography sx={{ fontSize: '0.6875rem', color: 'warning.main', fontWeight: 600 }}>
                      Max {stockCount} items
                    </Typography>
                  )}
                </Box>

                {/* Custom Studio Promo if Product is Customizable */}
                {activeProduct.isCustomizable && (
                  <Box sx={{ p: 1.5, background: 'linear-gradient(to right, rgba(212,175,55,0.15), transparent)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                      <Sparkles size={16} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>CUSTOMIZE IN 3D STUDIO</Typography>
                    </Box>
                    <Button onClick={handleOpenStudio} sx={{ px: 1.5, py: 0.5, bgcolor: 'primary.main', color: 'black', fontWeight: 800, fontSize: '0.625rem', textTransform: 'uppercase', borderRadius: '8px', transition: 'transform 0.3s ease', '&:hover': { bgcolor: '#e2b714', transform: 'scale(1.05)' } }}>
                      OPEN STUDIO
                    </Button>
                  </Box>
                )}

                {/* Primary Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    startIcon={<ShoppingBag size={18} />}
                    sx={{ width: '100%', height: 50, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', letterSpacing: '0.12em', transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(212,175,55,0.25)', '&:hover': { bgcolor: '#e2b714', transform: 'translateY(-2px)' }, '&.Mui-disabled': { bgcolor: 'var(--border-subtle)', color: 'text.disabled' } }}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    sx={{ width: '100%', height: 50, bgcolor: 'var(--text-primary)', color: 'var(--bg-main)', fontWeight: 900, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', letterSpacing: '0.12em', transition: 'all 0.3s ease', boxShadow: 'var(--shadow-card)', '&:hover': { opacity: 0.9 }, '&.Mui-disabled': { opacity: 0.5 } }}
                  >
                    BUY IT NOW
                  </Button>
                </Box>
              </Box>

              {/* Specs & Shipping */}
              <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} color="#d4af37" />
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Material:</Box> {activeProduct.material}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                  <Truck size={16} color="#d4af37" />
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Shipping:</Box> Islandwide Express Delivery (1-3 Days)</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                  <RefreshCw size={16} color="#d4af37" />
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Returns:</Box> 7-Day Hassle Free Exchanges Guaranteed</Typography>
                </Box>
              </Box>

            </Box>

          </Box>
        </Fade>
      </Modal>

      {/* Size Chart Modal Component with category awareness */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
        subCategory={activeProduct.subCategory}
      />
    </>
  );
};
