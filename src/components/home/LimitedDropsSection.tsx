import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#0A0A0A' },
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

export const LimitedDropsSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const limitedProducts = products.filter(p => p.isLimitedEdition).slice(0, 2);
  
  // Countdown timer - set to 5 days from now
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, mins: 31, secs: 7 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs -= 1;
        if (secs < 0) { secs = 59; mins -= 1; }
        if (mins < 0) { mins = 59; hours -= 1; }
        if (hours < 0) { hours = 23; days -= 1; }
        if (days < 0) { days = 0; hours = 0; mins = 0; secs = 0; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (limitedProducts.length === 0) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, sm: 12, lg: 16 }, 
          bgcolor: 'background.default', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, lg: 12 }} sx={{ alignItems: 'center' }}>
            
            {/* Left - Text + Countdown */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                <Box>
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
                    NUMBERED RUNS
                  </Typography>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, 
                      letterSpacing: '-0.02em',
                      lineHeight: 0.95,
                      mb: 3,
                      textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                  >
                    LIMITED DROPS
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      maxWidth: '400px', 
                      lineHeight: 1.8,
                      mb: 4
                    }}
                  >
                    Made once, never repeated. Club members get 24 hours of early access before public release.
                  </Typography>
                </Box>
                
                {/* 3D Countdown Timer */}
                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 } }}>
                  {[
                    { val: timeLeft.days.toString().padStart(2, '0'), label: 'DAYS' },
                    { val: timeLeft.hours.toString().padStart(2, '0'), label: 'HOURS' },
                    { val: timeLeft.mins.toString().padStart(2, '0'), label: 'MINS' },
                    { val: timeLeft.secs.toString().padStart(2, '0'), label: 'SECS' },
                  ].map(({ val, label }) => (
                    <Box 
                      key={label} 
                      sx={{ 
                        width: { xs: 64, sm: 80 }, 
                        height: { xs: 80, sm: 100 }, 
                        bgcolor: '#12141E', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 2, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.05)',
                        background: 'linear-gradient(180deg, rgba(24,26,40,1) 0%, rgba(16,18,29,1) 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Glass glare effect */}
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
                      
                      <Typography 
                        sx={{ 
                          color: 'primary.main', 
                          fontSize: { xs: '1.75rem', sm: '2.5rem' }, 
                          fontWeight: 900, 
                          fontFamily: '"Syne", sans-serif',
                          lineHeight: 1,
                          textShadow: '0 4px 10px rgba(212,175,55,0.3)',
                          zIndex: 1
                        }}
                      >
                        {val}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: { xs: '0.55rem', sm: '0.65rem' }, 
                          fontWeight: 'bold', 
                          letterSpacing: '0.15em', 
                          textTransform: 'uppercase',
                          mt: 1,
                          zIndex: 1
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right - Limited Product Cards using proper ProductCard component */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
                {limitedProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={product.id}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -8,
                          background: 'linear-gradient(135deg, rgba(212,175,55,0.2), transparent 50%)',
                          borderRadius: 4,
                          zIndex: 0,
                          opacity: 0,
                          transition: 'opacity 0.3s'
                        },
                        '&:hover::before': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* Floating Limited Badge */}
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          left: 12, 
                          zIndex: 20, 
                          background: 'linear-gradient(90deg, #9333ea, #7e22ce)', 
                          color: 'white', 
                          px: 1.5, 
                          py: 0.5, 
                          fontSize: '0.65rem', 
                          fontWeight: 900, 
                          letterSpacing: '0.12em', 
                          textTransform: 'uppercase', 
                          borderRadius: 1,
                          boxShadow: '0 4px 12px rgba(147,51,234,0.4)',
                          fontFamily: '"JetBrains Mono", sans-serif'
                        }}
                      >
                        LIMITED DROP
                      </Box>
                      
                      <Box sx={{ position: 'relative', zIndex: 10 }}>
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
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
