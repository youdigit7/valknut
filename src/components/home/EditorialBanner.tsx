import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { 
  Box, Typography, Container, Button 
} from '@mui/material';

export const EditorialBanner: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          py: { xs: 12, sm: 16, lg: 24 },
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'var(--bg-main)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Background Graphic & Texture (Photo untouched) */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=85"
            alt="VALKNUT Custom Studio Craftsmanship"
            loading="lazy"
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center', 
              filter: 'brightness(0.25) contrast(1.25)' 
            }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0A0A0A, rgba(10,10,10,0.7), #0A0A0A)' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A, transparent, #0A0A0A)' }} />
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
          <Box sx={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 4 } }}>
            
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                px: 2, 
                py: 1, 
                bgcolor: 'rgba(212,175,55,0.1)', 
                border: '1px solid rgba(212,175,55,0.3)', 
                borderRadius: '50px',
                alignSelf: 'flex-start',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(212,175,55,0.15)'
              }}
            >
              <Sparkles size={14} color="#D4AF37" />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold', 
                  letterSpacing: '0.2em',
                  fontSize: { xs: '0.625rem', sm: '0.6875rem' }
                }}
              >
                BESPOKE APPAREL ENGINEERING
              </Typography>
            </Box>

            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2.25rem', sm: '3.5rem', lg: '4.5rem' }, 
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}
            >
              MAKE IT YOUR ARMOR.<br />
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block',
                  mt: 1,
                  background: 'linear-gradient(to right, #f3e5ab, #D4AF37, #e2b714)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 15px rgba(212,175,55,0.3))'
                }}
              >
                CUSTOM STUDIO LIVE.
              </Box>
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--text-secondary)', 
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }, 
                lineHeight: 1.8,
                maxWidth: '600px',
                fontWeight: 300
              }}
            >
              Upload your signature graphics or render high-density puff rubber lettering on our 480GSM heavy blanks. Live real-time placement, multiple print techniques, and local master craftsmanship.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, pt: 2 }}>
              <Button
                onClick={() => (window.location.hash = '#/custom-studio')}
                sx={{
                  px: { xs: 4, sm: 5 }, py: { xs: 2, sm: 2.5 },
                  background: 'linear-gradient(90deg, #e2b714, #D4AF37, #aa8010)',
                  color: 'black',
                  fontWeight: 900,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  letterSpacing: '0.16em',
                  borderRadius: 3,
                  boxShadow: '0 12px 30px rgba(212,175,55,0.45), inset 0 1px 1px rgba(255,255,255,0.6)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 35px rgba(212,175,55,0.6), inset 0 1px 1px rgba(255,255,255,0.6)',
                  }
                }}
              >
                LAUNCH CUSTOM STUDIO <Box component="span" sx={{ ml: 1, display: 'flex' }}><ArrowRight size={17} /></Box>
              </Button>
              <Button
                onClick={() => (window.location.hash = '#/lookbook')}
                sx={{
                  px: { xs: 4, sm: 5 }, py: { xs: 2, sm: 2.5 },
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)',
                  fontWeight: 900,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  letterSpacing: '0.16em',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.14)',
                    borderColor: 'rgba(212,175,55,0.5)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 14px 30px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2)',
                  }
                }}
              >
                VIEW LOOKBOOK
              </Button>
            </Box>

          </Box>
        </Container>
      </Box>
    </>
  );
};
