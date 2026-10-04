import React from 'react';
import { Sparkles, Shield, Flame, Compass, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  createTheme, ThemeProvider, Box, Typography, Button, 
  Container, Card, CardContent, Breadcrumbs, Link, Zoom, Fade, Paper, Chip
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#0A0A0A', paper: '#0E1017' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 700, textTransform: 'uppercase' },
    body1: { fontFamily: '"JetBrains Mono", sans-serif' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    button: { fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 800 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '16px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          color: '#000000',
          background: 'linear-gradient(145deg, #e3bc3b, #bf9d31)',
          boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)',
          '&:hover': {
            background: 'linear-gradient(145deg, #f2c83e, #ccaa34)',
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.2)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3), inset 0 2px 5px rgba(0,0,0,0.3)',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(145deg, #131520, #0E1017)',
          boxShadow: '8px 8px 20px rgba(0,0,0,0.5), -4px -4px 15px rgba(255,255,255,0.02)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '12px 12px 30px rgba(0,0,0,0.7), -6px -6px 20px rgba(255,255,255,0.03), 0 0 15px rgba(212,175,55,0.2)',
            borderColor: 'rgba(212,175,55,0.3)',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(212,175,55,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(145deg, #11131c, #0a0c12)',
        }
      }
    }
  }
});

export const BrandStoryPage: React.FC = () => {
  const { setActiveCategory } = useStore();

  const seoMetadata = {
    title: 'Brand Story & Philosophy | VALKNUT Official Sri Lanka',
    description: 'Learn about VALKNUT Official, Sri Lanka’s premier dark luxury streetwear house. Rooted in ancient Norse discipline and modern architectural garment engineering.',
    keywords: 'valknut brand story, streetwear philosophy, dark luxury brand colombo, clothing brand sri lanka, own your mind control your world',
    canonicalUrl: 'https://valknutofficial.com/#/brand-story',
    ogTitle: 'Brand Story & Philosophy — VALKNUT Official',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. Built for those who think different.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Brand Story', url: '/#/brand-story' }
      ])
    ]
  };

  const handleShop = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  const pillars = [
    { icon: Sparkles, title: 'MIND', sub: 'Clarity & Vision', text: 'Every creation starts in the psyche. We engineer apparel that sharpens your mental focus and asserts quiet dominance.' },
    { icon: Shield, title: 'CONTROL', sub: 'Mastery of Self', text: 'True power is internal governance. Master your reactions, dictate your path, and take absolute command of your realm.' },
    { icon: Flame, title: 'DISCIPLINE', sub: 'Relentless Execution', text: 'The bridge between vision and reality. Consistent, uncompromising dedication woven into every stitch and seam.' },
    { icon: Compass, title: 'FREEDOM', sub: 'Limitless Expression', text: 'Liberation from generic trends. An authentic, timeless aesthetic that stays sharp across years, not seasons.' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<Typography sx={{ color: 'text.secondary' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Brand Story</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto', mb: 12 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Sparkles size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>ESTABLISHED 2026 • COLOMBO</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                We Design More Than Clothes. <br />
                <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                  We Create Identity.
                </Box>
              </Typography>

              <Typography variant="h6" sx={{ color: 'primary.main', letterSpacing: '0.15em', mb: 3 }}>
                “OWN YOUR MIND. CONTROL YOUR WORLD.”
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
                Built for those who think different. Rooted in ancient Norse symbolism of the nine interlocked realms and modernized for contemporary dark luxury streetwear.
              </Typography>
            </Box>
          </Fade>

          {/* Pillars */}
          <Box sx={{ mb: 15 }}>
            <Fade in={true} timeout={1200}>
              <Typography variant="h3" sx={{ textAlign: 'center', mb: 8, letterSpacing: '0.1em' }}>
                The Four Pillars of VALKNUT
              </Typography>
            </Fade>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
              {pillars.map((pillar, index) => (
                <Box key={pillar.title}>
                  <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card sx={{ height: '100%', borderTop: '2px solid #D4AF37' }}>
                      <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 3, transition: 'transform 0.3s', '.MuiCard-root:hover &': { transform: 'scale(1.15) rotate(5deg)', boxShadow: '0 0 20px rgba(212,175,55,0.4)' } }}>
                          <pillar.icon size={32} />
                        </Box>
                        <Typography variant="h5" sx={{ mb: 1 }}>{pillar.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', letterSpacing: '0.1em', display: 'block', mb: 2 }}>{pillar.sub}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{pillar.text}</Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Sri Lankan Craftsmanship */}
          <Fade in={true} timeout={1600}>
            <Paper elevation={24} sx={{ p: { xs: 4, md: 8 }, mb: 12, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(30px)' }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 8, alignItems: 'center' }}>
                <Box>
                  <Chip label="100% ETHICAL APPAREL" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', mb: 3, fontFamily: 'monospace', letterSpacing: '0.1em' }} />
                  <Typography variant="h2" sx={{ mb: 4, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    Made in Sri Lanka. <br />
                    <Box component="span" sx={{ color: 'primary.main' }}>Crafted for the World.</Box>
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                    Sri Lanka is globally recognized for high-caliber garment engineering and textile excellence. VALKNUT harnesses this artisan heritage to construct heavyweight streetwear fabrics with zero compromise.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    From our pre-shrunk reactive dyeing process to reinforced architectural neckline ribs, every single piece undergoes meticulous quality inspection before dispatch.
                  </Typography>
                </Box>
                
                <Box>
                  <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 3, border: '1px solid rgba(212,175,55,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(212,175,55,0.1)' }}>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'primary.main', fontFamily: 'serif' }}>VK</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ letterSpacing: '0.1em', mb: 1 }}>VALKNUT ESSENTIAL</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', display: 'block', mb: 3 }}>Sri Lanka • Est 2026</Typography>
                    <Box sx={{ display: 'inline-block', py: 1, px: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, typography: 'caption', fontFamily: 'monospace', color: 'text.secondary' }}>
                      valknutofficial.com
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* CTA */}
          <Fade in={true} timeout={2000}>
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleShop}
                endIcon={<ArrowRight />}
              >
                EXPLORE VALKNUT ESSENTIALS
              </Button>
            </Box>
          </Fade>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

