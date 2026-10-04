import React from 'react';
import { Layers, Sparkles, Truck, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid, Button
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#0A0A0A', paper: '#10121D' },
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

export const BrandIntro: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 10, sm: 14 }, 
          bgcolor: 'background.default', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mx: 'auto' }}>
            
            {/* Eyebrow Tag with 3D Pill */}
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                px: 2, 
                py: 0.75, 
                background: 'linear-gradient(90deg, rgba(212,175,55,0.15), rgba(0,0,0,0.4), rgba(212,175,55,0.15))',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '50px',
                mb: 4,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(212,175,55,0.15)'
              }}
            >
              <Box sx={{ w: 8, h: 8, borderRadius: '50%', bgcolor: 'primary.main', width: 8, height: 8, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold', 
                  letterSpacing: { xs: '0.2em', sm: '0.25em' },
                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                }}
              >
                THE ARCHITECTURE OF VALKNUT
              </Typography>
            </Box>

            {/* Headline with 3D Depth */}
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.5rem', lg: '3.5rem' }, 
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                maxWidth: '900px',
                mb: 3,
                textShadow: '0 4px 20px rgba(0,0,0,0.9)'
              }}
            >
              BUILT FOR THOSE WHO COMMAND RESPECT THROUGH RESTRAINT.
            </Typography>

            {/* Narrative Body */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                maxWidth: '700px', 
                mx: 'auto',
                mb: 8,
                lineHeight: 1.8,
                fontWeight: 300,
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Rooted in the ancient Norse geometry of the bound knot and engineered in Colombo.
              VALKNUT creates high-density garments for individuals who choose substance over noise.
              No synthetic blends. No cheap prints. Pure heavyweight cotton tailored with uncompromising structure.
            </Typography>

            {/* 4 Feature Architecture Cards - 3D Floating Glass Slabs */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', textAlign: 'left', mb: 8 }}>
              
              {[
                { 
                  title: '480 GSM', 
                  subtitle: 'FABRIC WEIGHT', 
                  desc: 'HEAVY FRENCH TERRY', 
                  body: 'Ultra-dense combed cotton with permanent structural drape.',
                  icon: <Layers size={19} color="#D4AF37" />
                },
                { 
                  title: '100%', 
                  subtitle: 'PURITY GRADE', 
                  desc: 'COMBED COTTON', 
                  body: 'Zero synthetic polyester blends. Breathable and pre-shrunk.',
                  icon: <CheckCircle2 size={19} color="#D4AF37" />
                },
                { 
                  title: 'CUSTOM', 
                  subtitle: 'STUDIO GRAPHICS', 
                  desc: 'HIGH-DENSITY EMBROIDERY', 
                  body: 'Bespoke 3D puff rubber and metallic thread application.',
                  icon: <Sparkles size={19} color="#D4AF37" />
                },
                { 
                  title: 'COLOMBO', 
                  subtitle: 'ISLANDWIDE DISPATCH', 
                  desc: '1-3 DAYS DELIVERY', 
                  body: 'Tracked courier service across all 25 districts in Sri Lanka.',
                  icon: <Truck size={19} color="#D4AF37" />
                }
              ].map((card, idx) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 4, 
                      background: 'linear-gradient(180deg, rgba(24,26,40,0.85), rgba(16,18,29,0.9), rgba(11,12,20,1))',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderTopColor: 'rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.15)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      '&:hover': {
                        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.25)',
                        borderColor: 'rgba(212,175,55,0.6)',
                        transform: 'translateY(-8px)',
                        '& .iconBox': { transform: 'scale(1.1)' }
                      }
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography 
                          sx={{ 
                            fontSize: { xs: '1.5rem', sm: '1.875rem', lg: '2.25rem' }, 
                            fontFamily: '"Syne", sans-serif', 
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(to right, #f3e5ab, #D4AF37)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.4))'
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Box 
                          className="iconBox"
                          sx={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: 3, 
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(0,0,0,0.6))',
                            border: '1px solid rgba(212,175,55,0.5)',
                            boxShadow: '0 0 20px rgba(212,175,55,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s'
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: { xs: '0.625rem', sm: '0.6875rem' }, 
                          color: 'text.secondary', 
                          letterSpacing: '0.1em', 
                          display: 'block', 
                          mb: 0.5 
                        }}
                      >
                        {card.subtitle}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', fontFamily: '"Syne", sans-serif', color: 'white' }}>
                        {card.desc}
                      </Typography>
                    </Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.75rem', 
                        color: 'text.secondary', 
                        mt: 2, 
                        pt: 1.5, 
                        borderTop: '1px solid rgba(255,255,255,0.1)', 
                        lineHeight: 1.8, 
                        fontWeight: 300 
                      }}
                    >
                      {card.body}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Action Triggers with Modern 3D Buttons */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                onClick={() => (window.location.hash = '#/shop')}
                sx={{
                  px: 4, py: 2,
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
                EXPLORE APPAREL <Box component="span" sx={{ ml: 1, display: 'flex' }}><ArrowRight size={17} /></Box>
              </Button>
              <Button
                onClick={() => (window.location.hash = '#/custom-studio')}
                sx={{
                  px: 4, py: 2,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: 'white',
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
                <Box component="span" sx={{ mr: 1, display: 'flex' }}><Compass size={17} /></Box> CUSTOMIZE IN STUDIO
              </Button>
            </Box>

          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
