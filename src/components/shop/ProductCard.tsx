import React, { useState } from 'react';
import type { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Eye, Sparkles, ShoppingBag } from 'lucide-react';
import { Box, Typography, IconButton, Button } from '@mui/material';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setCustomStudioProduct, addToCart } = useStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  if (!product) return null;

  const hasSale = Boolean(product?.salePrice && product.salePrice < product.price);
  const displayPrice = product?.salePrice ?? product?.price ?? 0;
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const images = Array.isArray(product?.images) ? product.images : [];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstVariant = variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
    addToCart(
      product, 
      firstVariant.size as any, 
      firstVariant.color, 
      firstVariant.colorHex, 
      1
    );
  };

  const handleCustomStudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomStudioProduct(product);
    window.location.hash = '#/custom-studio';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      onClick={() => setSelectedProduct(product)}
      sx={{
        position: 'relative',
        bgcolor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'rgba(212,175,55,0.6)',
          boxShadow: '0 10px 30px rgba(212,175,55,0.15)',
          transform: 'translateY(-4px)',
          '& .img-overlay': { opacity: 1 },
          '& .product-img': { transform: 'scale(1.05)' },
          '& .product-title': { color: 'primary.main' }
        }
      }}
    >
      {/* Product Image Area */}
      <Box 
        sx={{ position: 'relative', width: '100%', aspectRatio: '4/5', bgcolor: 'var(--bg-card-inner)', overflow: 'hidden' }}
        onMouseEnter={() => images.length > 1 && setCurrentImgIndex(1)}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <Box
          component="img"
          src={images[currentImgIndex] || images[0] || ''} 
          alt={product?.name || 'VALKNUT Apparel'}
          className="product-img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.7s ease-out'
          }}
        />

        {/* Top Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 10 }}>
          {hasSale && (
            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'rgba(69,10,10,0.8)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.625rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
              SALE
            </Box>
          )}
          {product.isBestSeller && (
            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)', color: 'primary.main', fontSize: '0.625rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
              BEST SELLER
            </Box>
          )}
          {product.isNewArrival && (
            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', fontSize: '0.625rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
              NEW
            </Box>
          )}
        </Box>

        {/* Custom Studio Badge Top Right */}
        {product.isCustomizable && (
          <IconButton
            onClick={handleCustomStudio}
            title="Customize in Studio"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'primary.main',
              border: '1px solid rgba(212,175,55,0.5)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease',
              zIndex: 10,
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'black'
              }
            }}
          >
            <Sparkles size={16} />
          </IconButton>
        )}

        {/* Hover Action Overlay */}
        <Box 
          className="img-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            top: 'auto',
            p: 1.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Button 
            onClick={handleQuickAdd}
            sx={{
              flex: 1,
              py: 1,
              bgcolor: 'var(--text-primary)',
              color: 'black',
              fontWeight: 900,
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              minWidth: 0,
              '&:hover': {
                bgcolor: 'primary.main'
              }
            }}
          >
            <ShoppingBag size={14} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>QUICK ADD</Box>
          </Button>

          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            title="Quick View"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'var(--text-primary)',
              borderRadius: 1,
              backdropFilter: 'blur(4px)',
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <Eye size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Details Box */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', letterSpacing: '0.2em', color: 'primary.main', textTransform: 'uppercase', mb: 0.5 }}>
            {product.subCategory}
          </Typography>
          <Typography className="product-title" sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', transition: 'colors 0.3s', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </Typography>
        </Box>

        {/* Price & Variant Swatches */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid var(--border-subtle)' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              LKR {displayPrice.toLocaleString()}
            </Typography>
            {hasSale && (
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                LKR {product.price.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Color Swatch Dots */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {Array.from(new Set(variants.map(v => v.colorHex || '#000000'))).slice(0, 3).map((hex, i) => (
              <Box 
                key={i} 
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                  bgcolor: hex
                }}
              />
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
