import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { 
  createTheme, ThemeProvider, Box, Typography, Button, IconButton 
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
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    caption: { fontFamily: '"JetBrains Mono", sans-serif' },
  }
});

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleShopNow = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  const handleExploreCollection = () => {
    const el = document.getElementById('featured-collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#/shop';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          minHeight: { xs: '92vh', sm: '95vh', lg: '100vh' },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: 'background.default',
          pb: { xs: 5, sm: 8, lg: 10 },
          pt: { xs: 14, sm: 16 }
        }}
      >
        {/* Background Image & Overlays */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Box component="picture">
            <source
              media="(max-width: 768px)"
              srcSet="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85"
            />
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90"
              alt="VALKNUT Official Editorial Campaign"
              loading="eager"
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'top', 
                filter: 'brightness(0.55) contrast(1.2)' 
              }}
            />
          </Box>
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A, rgba(10,10,10,0.55), transparent)' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent, transparent)' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #0A0A0A 120%)', opacity: 0.7 }} />
        </Box>

        {/* 3D Glow Core */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: { xs: 350, sm: 650, lg: 950 }, 
            height: { xs: 350, sm: 500 }, 
            bgcolor: 'rgba(212,175,55,0.1)', 
            filter: { xs: 'blur(150px)', sm: 'blur(220px)' }, 
            pointerEvents: 'none',
            zIndex: 0
          }} 
        />

        <Box sx={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1024px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Eyebrow Tag */}
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1.5, 
              px: 2, 
              py: 1, 
              bgcolor: 'rgba(0,0,0,0.6)', 
              border: '1px solid rgba(212,175,55,0.5)', 
              borderRadius: '50px',
              mb: { xs: 2, sm: 3 },
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px rgba(212,175,55,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', animation: 'pulse 2s infinite' }}><Sparkles size={13} color="#D4AF37" /></Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.25em', fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
              DROP 04 / DARK SOVEREIGN
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'inline-block' }, w: 6, h: 6, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.6)' }} />
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline-block' }, color: 'text.secondary', letterSpacing: '0.25em', fontSize: '0.625rem' }}>
              COLOMBO ARCHIVES
            </Typography>
          </Box>

          {/* Headline with 3D Depth */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: 'clamp(2.2rem, 5.5vw + 0.5rem, 5.25rem)', 
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              mb: { xs: 1.5, sm: 2.5 },
              maxWidth: '900px',
              textShadow: '0 10px 35px rgba(0,0,0,0.95)'
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'block',
                background: 'linear-gradient(to right, #e6c042, #D4AF37, #aa8010)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 25px rgba(212,175,55,0.35))'
              }}
            >
              OWN YOUR MIND.
            </Box>
            <Box component="span" sx={{ display: 'block', color: 'white', mt: 1, textShadow: '0 8px 30px rgba(0,0,0,0.9)' }}>
              CONTROL YOUR WORLD.
            </Box>
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(226,232,240,0.9)', 
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, 
              lineHeight: 1.8,
              maxWidth: '600px',
              mx: 'auto',
              mb: { xs: 3, sm: 4 },
              fontWeight: 300,
              textShadow: '0 3px 15px rgba(0,0,0,0.9)',
              px: 1.5
            }}
          >
            Engineered in Colombo. 480GSM heavyweight cotton, architectural boxy fits,
            and dark luxury minimalism crafted for those who command their destiny.
          </Typography>

          {/* Action Triggers with Modern 3D Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: { xs: 1.5, sm: 2.5 }, width: { xs: '100%', sm: 'auto' }, px: 1, maxWidth: { xs: '400px', sm: 'none' }, mx: 'auto', mb: { xs: 4, sm: 5 } }}>
            <Button
              onClick={handleShopNow}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                px: { xs: 4, sm: 5 }, py: { xs: 2, sm: 2 },
                background: 'linear-gradient(90deg, #e6c042, #D4AF37, #aa8010)',
                color: 'black',
                fontWeight: 900,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                letterSpacing: '0.18em',
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(212,175,55,0.4), inset 0 1px 1px rgba(255,255,255,0.7)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 45px rgba(212,175,55,0.6), inset 0 1px 1px rgba(255,255,255,0.7)',
                  '& .iconRight': { transform: 'translateX(4px)' }
                }
              }}
            >
              SHOP COLLECTION <Box component="span" className="iconRight" sx={{ ml: 1, display: 'flex', transition: 'transform 0.3s' }}><ArrowRight size={17} /></Box>
            </Button>
            <Button
              onClick={handleExploreCollection}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                px: { xs: 4, sm: 5 }, py: { xs: 2, sm: 2 },
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                letterSpacing: '0.18em',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.18)',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.75)',
                  borderColor: 'rgba(212,175,55,0.6)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.2)',
                  '& .iconSpin': { transform: 'rotate(45deg)' }
                }
              }}
            >
              <Box component="span" className="iconSpin" sx={{ mr: 1, display: 'flex', color: 'primary.main', transition: 'transform 0.3s' }}><Compass size={17} /></Box> EXPLORE PIECES
            </Button>
          </Box>

          <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 }, px: { xs: 2, sm: 3 }, py: 1.5, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 10px 25px rgba(0,0,0,0.7)' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', letterSpacing: '0.1em', fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
              <ShieldCheck size={13} color="#D4AF37" /> 480GSM French Terry
            </Typography>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' }, color: 'rgba(255,255,255,0.2)' }}>•</Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', letterSpacing: '0.1em', fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>✓</Box> Islandwide Delivery
            </Typography>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' }, color: 'rgba(255,255,255,0.2)' }}>•</Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', letterSpacing: '0.1em', fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>✓</Box> Koko 3x Instalments
            </Typography>
          </Box>

        </Box>

        <IconButton
          href="https://wa.me/94770000000?text=Hello%20VALKNUT%20Official"
          target="_blank"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 50,
            bgcolor: '#25D366',
            color: 'white',
            borderRadius: '50px',
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            boxShadow: '0 4px 15px rgba(37,211,102,0.4)',
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: '#1da851',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 20px rgba(37,211,102,0.6)'
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            WHATSAPP US
          </Typography>
        </IconButton>

      </Box>
    </ThemeProvider>
  );
};
