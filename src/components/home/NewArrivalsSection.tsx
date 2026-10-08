import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';
import { 
  Box, Typography, Container, Grid, Button
} from '@mui/material';

export const NewArrivalsSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const displayItems = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 7, sm: 10, lg: 12 }, 
          bgcolor: 'var(--bg-main)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          
          {/* Centered Section Header with 3D Aesthetic */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold', 
                letterSpacing: '0.25em', 
                display: 'block', 
                mb: 2 
              }}
            >
              FRESH OFF THE LOOM
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, 
                letterSpacing: '-0.02em',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              NEW ARRIVALS
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--text-secondary)', 
                maxWidth: '600px', 
                mx: 'auto',
                mb: 4,
                lineHeight: 1.8
              }}
            >
              The latest oversized silhouettes and tactical essentials released for Spring/Summer 2026.
            </Typography>
            <Button 
              href="#/shop"
              sx={{ 
                color: 'var(--text-primary)',
                borderBottom: '1px solid',
                borderColor: 'primary.main',
                pb: 0.5,
                borderRadius: 0,
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                fontWeight: 'bold',
                fontFamily: '"JetBrains Mono", sans-serif',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.2)'
                }
              }}
            >
              VIEW ALL NEW DROPS
            </Button>
          </Box>

          {/* Responsive Product Grid */}
          <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
            {displayItems.map((product) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={product.id}>
                <ProductCard 
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => {
                    const firstVariant = p.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
                    addToCart(p, firstVariant.size as any, firstVariant.color, firstVariant.colorHex, 1);
                    showToast(`Added ${p.name} to your bag!`);
                  }}
                  onToggleWishlist={(p) => {
                    showToast(`Added ${p.name} to your wishlist!`);
                  }}
                />
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>
    </>
  );
};
