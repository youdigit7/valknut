import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid, Button
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#0A0C12' },
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

interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  itemCount: string;
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, imageUrl, itemCount, href }) => {
  return (
    <Box 
      component="a"
      href={href}
      sx={{ 
        display: 'block',
        position: 'relative',
        aspectRatio: '4/5',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)',
        transform: 'perspective(1000px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: '#0a0b12',
        '&:hover': {
          borderColor: 'rgba(212,175,55,0.6)',
          boxShadow: '0 30px 70px rgba(212,175,55,0.25), inset 0 1px 0 rgba(212,175,55,0.5)',
          transform: 'perspective(1000px) translateY(-8px)',
          '& .bg-img': {
            transform: 'scale(1.1)',
            filter: 'brightness(0.9) contrast(1.15)',
          },
          '& .cat-title': {
            background: 'linear-gradient(to right, #ffffff, #F3E5AB, #D4AF37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
          '& .cat-action': {
            color: '#D4AF37'
          },
          '& .cat-arrow-box': {
            bgcolor: '#D4AF37',
            transform: 'translateX(6px)'
          },
          '& .cat-arrow': {
            color: 'black'
          }
        }
      }}
    >
      <Box 
        component="img"
        className="bg-img"
        src={imageUrl}
        alt={`VALKNUT ${title} Collection`}
        loading="lazy"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.72) contrast(1.15)',
          transition: 'all 0.7s ease-out'
        }}
      />
      
      {/* Gradients */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,11,18,1) 0%, rgba(10,11,18,0.5) 50%, transparent 100%)', zIndex: 1 }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)', zIndex: 1, opacity: 0.8 }} />

      {/* Pill */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            bgcolor: 'rgba(0,0,0,0.8)', 
            border: '1px solid rgba(212,175,55,0.4)', 
            px: 2, 
            py: 0.75, 
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.7)'
          }}
        >
          <Box sx={{ animation: 'pulse 2s infinite', display: 'flex' }}><Sparkles size={11} color="#D4AF37" /></Box>
          <Typography sx={{ color: 'primary.main', fontSize: '0.6875rem', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {itemCount}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ position: 'absolute', inset: 0, p: { xs: 3, sm: 4 }, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Typography 
          variant="h3" 
          className="cat-title"
          sx={{ 
            color: 'white', 
            fontSize: { xs: '1.5rem', sm: '2rem' }, 
            letterSpacing: '0.05em', 
            mb: 1,
            transition: 'all 0.3s ease' 
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          sx={{ 
            color: 'rgba(203,213,225,0.9)', 
            fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
            fontWeight: 300, 
            lineHeight: 1.6,
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {subtitle}
        </Typography>

        <Box 
          className="cat-action"
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1.5, 
            color: 'white', 
            transition: 'color 0.3s ease'
          }}
        >
          <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            DISCOVER {title}
          </Typography>
          <Box 
            className="cat-arrow-box"
            sx={{ 
              w: 28, 
              h: 28, 
              width: 28,
              height: 28,
              borderRadius: '50%', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowRight size={14} className="cat-arrow" style={{ transition: 'color 0.3s ease' }} />
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export const ShopByCategory: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          py: { xs: 10, sm: 14 }, 
          bgcolor: 'background.default', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Ambient 3D Glow */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '700px', 
            height: '350px', 
            bgcolor: 'rgba(212,175,55,0.05)', 
            filter: 'blur(120px)', 
            borderRadius: '50%',
            pointerEvents: 'none' 
          }} 
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
          
          {/* Centered Section Header */}
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
              CURATED PIECES
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
              PRODUCT CATEGORIES
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
              Engineered for distinct fits and heavy layering. Select your discipline.
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
              VIEW ALL CATEGORIES
            </Button>
          </Box>

          <Grid container spacing={{ xs: 3, sm: 4, lg: 5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard 
                title="MEN"
                subtitle="480GSM Boxy Hoodies, Oversized Graphic Tees, Tactical Cargos"
                itemCount="14 PIECES"
                imageUrl="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"
                href="#/category/men"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard 
                title="WOMEN"
                subtitle="Sculpted Heavyweight Crop Tops, Wide-Leg Fleece Pants, Oversized Outerwear"
                itemCount="9 PIECES"
                imageUrl="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                href="#/category/women"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CategoryCard 
                title="ESSENTIALS"
                subtitle="Embroidered Caps, Stainless Steel Vacuum Bottles, Dark Silver Hardware"
                itemCount="7 PIECES"
                imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
                href="#/category/essentials"
              />
            </Grid>
          </Grid>

        </Container>
      </Box>
    </ThemeProvider>
  );
};
