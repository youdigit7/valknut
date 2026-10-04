import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid, Button
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#050608', paper: '#0A0C10' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    caption: { fontFamily: '"JetBrains Mono", sans-serif' },
  }
});

export const BestSellersSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  
  if (displayProducts.length === 0) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 7, sm: 10, lg: 12 }, 
          bgcolor: '#0A0A0A', 
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
              PROVEN IN THE STREETS
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
              BEST SELLERS
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '600px', 
                mx: 'auto',
                mb: 4,
                lineHeight: 1.8
              }}
            >
              Our most coveted heavy drape hoodies and boxy tees, restocked by popular demand.
            </Typography>
            <Button 
              href="#/shop"
              sx={{ 
                color: 'text.primary',
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
              SEE ALL BEST SELLERS
            </Button>
          </Box>

          {/* Responsive Product Grid */}
          <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
            {displayProducts.map((product) => (
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
    </ThemeProvider>
  );
};
