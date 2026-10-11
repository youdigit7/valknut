import React, { useState } from 'react';
import type { Product } from '../../types/ecommerce';
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
  ShieldCheck 
} from 'lucide-react';
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Button, Chip } from '@mui/material';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {

  const { addToCart, setIsCartOpen, setIsCheckoutOpen, setCustomStudioProduct, showToast } = useStore();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color || 'Onyx Black');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const selectedVariant = product?.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  ) || product?.variants[0];

  const selectedColorHex = selectedVariant?.colorHex || '#000000';
  const stockCount = selectedVariant?.stock ?? 10;
  const isOutOfStock = stockCount <= 0;

  const availableColors = Array.from(new Set(product?.variants.map(v => v.color) || []));
  const availableSizes = Array.from(new Set(product?.variants.map(v => v.size) || []));

  if (!product) return null;
  const handleAddToCart = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      selectedColorHex,
      quantity
    );
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleOpenStudio = () => {
    setCustomStudioProduct(product);
    onClose();
    const studioEl = document.getElementById('custom-studio-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <>
      <Modal
        open={!!product}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }
          },
        }}
      >
        <Fade in={!!product}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 1000, maxHeight: '92vh', bgcolor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 2, boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', outline: 'none' }}>
            
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20, bgcolor: 'rgba(0,0,0,0.6)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(0,0,0,0.8)' } }}
              aria-label="Close modal"
            >
              <X size={20} />
            </IconButton>

            {/* Left Column: Image Gallery */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, bgcolor: 'var(--bg-main)', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderBottom: { xs: '1px solid var(--border-subtle)', md: 'none' }, borderRight: { md: '1px solid var(--border-subtle)' } }}>
              {/* Main Featured Image */}
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                <Box
                  component="img"
                  src={product.images[activeImgIndex] || product.images[0]}
                  alt={product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {product.images.map((img, idx) => (
                    <Box
                      component="button"
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      sx={{
                        position: 'relative', width: 64, height: 64, borderRadius: 1, overflow: 'hidden', border: '2px solid', transition: 'all 0.3s ease', flexShrink: 0, cursor: 'pointer',
                        ...(activeImgIndex === idx ? { borderColor: 'primary.main', opacity: 1 } : { borderColor: 'transparent', opacity: 0.6, '&:hover': { opacity: 1 } })
                      }}
                    >
                      <Box component="img" src={img} alt={`Thumbnail ${idx}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Column: Details & Actions */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', maxHeight: { xs: '50vh', md: '92vh' }, gap: 3 }}>
              <Box>
                {/* Collection / Subcategory */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 900, letterSpacing: '0.25em', color: 'primary.main', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>
                    {product.collection || product.category}
                  </Typography>

                  <Button 
                    onClick={handleShare} 
                    startIcon={<Share2 size={14} />}
                    sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', p: 0, minWidth: 'auto', textTransform: 'none', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
                  >
                    Share
                  </Button>
                </Box>

                {/* Title & Price */}
                <Typography 
                  variant="h2"
                  onClick={() => {
                    onClose();
                    window.location.hash = `#/product/${product.slug}`;
                  }}
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 2, cursor: 'pointer', transition: 'color 0.3s ease', '&:hover': { color: 'primary.main' } }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)' }}>
                    LKR {(product.salePrice ?? product.price).toLocaleString()}
                  </Typography>
                  {product.salePrice && (
                    <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      LKR {product.price.toLocaleString()}
                    </Typography>
                  )}
                  {product.salePrice && (
                    <Chip label={`SAVE LKR ${(product.price - product.salePrice).toLocaleString()}`} sx={{ bgcolor: 'rgba(220,38,38,0.2)', color: '#f87171', border: '1px solid rgba(220,38,38,0.4)', fontSize: '0.6875rem', fontWeight: 'bold', height: 24, ml: 1, borderRadius: '6px' }} />
                  )}
                </Box>

                {/* Installment Info */}
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', mb: 2.5 }}>
                  Or 3 payments of <Box component="strong" sx={{ color: 'var(--text-primary)' }}>LKR {Math.round((product.salePrice ?? product.price) / 3).toLocaleString()}</Box> with <Box component="span" sx={{ color: '#e879f9', fontWeight: 700 }}>KOKO</Box> or <Box component="span" sx={{ color: '#2dd4bf', fontWeight: 700 }}>mintpay</Box>
                </Typography>

                {/* Stock Status Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isOutOfStock ? 'error.main' : stockCount <= 5 ? 'warning.main' : 'success.main', animation: stockCount <= 5 && !isOutOfStock ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {isOutOfStock ? 'Out of Stock' : stockCount <= 5 ? `Low Stock — Only ${stockCount} Left!` : 'In Stock & Ready to Ship'}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, mb: 3, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {product.description}
                </Typography>

                {/* Color Selector */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', mb: 1 }}>
                    Select Colour: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{selectedColor}</Box>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                    {availableColors.map((colorName) => {
                      const variantMatch = product.variants.find(v => v.color === colorName);
                      const hex = variantMatch?.colorHex || '#000000';
                      const isSelected = selectedColor === colorName;

                      return (
                        <Button
                          key={colorName}
                          onClick={() => setSelectedColor(colorName)}
                          sx={{
                            px: 1.5, py: 0.75, borderRadius: '10px', border: '1px solid', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.3s ease', textTransform: 'none',
                            ...(isSelected ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.12)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-main)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } })
                          }}
                        >
                          <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', bgcolor: hex }} />
                          <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{colorName}</Typography>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

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
                      return (
                        <Button
                          key={sz}
                          onClick={() => setSelectedSize(sz as any)}
                          sx={{
                            width: 48, height: 46, borderRadius: '10px', fontWeight: 800, fontSize: '0.8125rem', fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', transition: 'all 0.3s ease', minWidth: 'auto', p: 0,
                            ...(isSelected ? { borderColor: 'primary.main', bgcolor: 'primary.main', color: 'black', boxShadow: '0 8px 16px rgba(212,175,55,0.3)', transform: 'scale(1.05)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-main)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } })
                          }}
                        >
                          {sz}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                {/* Quantity Stepper */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '10px', bgcolor: 'var(--bg-main)', height: 42 }}>
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ width: 38, height: 38, color: 'var(--text-primary)', borderRadius: '10px', '&:hover': { bgcolor: 'var(--border-subtle)' } }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>-</Typography>
                    </IconButton>
                    <Typography sx={{ width: 38, textAlign: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
                      {quantity}
                    </Typography>
                    <IconButton onClick={() => setQuantity(q => q + 1)} sx={{ width: 38, height: 38, color: 'var(--text-primary)', borderRadius: '10px', '&:hover': { bgcolor: 'var(--border-subtle)' } }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>+</Typography>
                    </IconButton>
                  </Box>
                </Box>

                {/* Custom Studio Promo if Product is Customizable */}
                {product.isCustomizable && (
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

              {/* Specs & Shipping Accordions */}
              <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} color="#d4af37" />
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Material:</Box> {product.material}</Typography>
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

      {/* Size Chart Modal Component */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </>
  );
};
