import React from 'react';
import { ShieldCheck, Zap, Sparkles, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  Box, Typography, Container, 
  Breadcrumbs, Link, Zoom, Fade, Paper, Button
} from '@mui/material';

export const StreetwearSriLankaSEO: React.FC = () => {
  const { setActiveCategory } = useStore();

  const seoMetadata = {
    title: 'Streetwear & Oversized Clothing Sri Lanka | VALKNUT Official',
    description: 'Discover Sri Lanka’s premier dark luxury streetwear brand. 480GSM heavyweight hoodies, boxy oversized graphic t-shirts, tactical cargo joggers, and custom apparel made in Colombo.',
    keywords: 'streetwear sri lanka, oversized t shirts colombo, luxury streetwear brand lk, heavyweight hoodies sri lanka, koko pay clothing, custom print tshirts sri lanka',
    canonicalUrl: 'https://valknutofficial.com/#/sri-lanka-streetwear',
    ogTitle: 'Streetwear & Oversized Clothing Sri Lanka | VALKNUT Official',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. Heavyweight 480GSM luxury streetwear engineered in Colombo.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Sri Lanka Streetwear', url: '/#/sri-lanka-streetwear' }
      ])
    ]
  };

  const handleShopNow = () => {
    setActiveCategory('ALL');
    window.location.hash = '#/shop';
  };

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: 200, left: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', zIndex: 0 }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs for SEO */}
          <Breadcrumbs separator={<Typography sx={{ color: 'var(--text-secondary)' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Sri Lanka Streetwear Culture</Typography>
          </Breadcrumbs>

          {/* Hero Heading for SEO */}
          <Fade in={true} timeout={800}>
            <Box component="header" sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto', mb: { xs: 8, md: 12 } }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Sparkles size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>COLOMBO STREETWEAR REVOLUTION</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                The Ultimate <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Streetwear & Oversized</Box> Clothing Brand in Sri Lanka
              </Typography>

              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxWidth: '700px', mx: 'auto', lineHeight: 1.8 }}>
                Engineered in Colombo. Crafted from ultra-heavyweight 100% organic cotton (up to 480 GSM). 
                VALKNUT Official redefines modern luxury streetwear with boxy silhouettes, dark aesthetics, and uncompromising discipline.
              </Typography>
            </Box>
          </Fade>

          {/* Grid of Key Pillars */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 12 }}>
            {[
              { icon: Zap, title: '480 GSM Heavyweight Cotton', desc: 'Unlike mass-market flimsy t-shirts, every VALKNUT garment is crafted using premium high-density Sri Lankan organic cotton, built for durability and structured boxy drape.' },
              { icon: MapPin, title: 'Islandwide Delivery', desc: 'Fast express courier delivery across Colombo, Kandy, Galle, Gampaha, Kurunegala, Jaffna, and all 25 districts in Sri Lanka with live AWB tracking and SMS alerts.' },
              { icon: ShieldCheck, title: 'Buy Now Pay Later with Koko', desc: 'Split your order into 3 interest-free installments via Koko, or pay securely via OnePay, Visa/MasterCard, and Cash on Delivery.' }
            ].map((pillar, idx) => (
              <Zoom in={true} style={{ transitionDelay: `${200 + (idx * 150)}ms` }} key={idx}>
                <Paper elevation={12} sx={{ p: 5, borderLeft: '3px solid #D4AF37', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 25px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(212,175,55,0.05)', borderColor: '#FFF5D1' } }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 4, border: '1px solid rgba(212,175,55,0.2)' }}>
                    <pillar.icon size={28} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, letterSpacing: '0.05em' }}>{pillar.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{pillar.desc}</Typography>
                </Paper>
              </Zoom>
            ))}
          </Box>

          {/* SEO Long Form Content & Keywords */}
          <Fade in={true} timeout={1200}>
            <Paper elevation={24} sx={{ p: { xs: 4, sm: 8 }, mb: 12, bgcolor: 'rgba(0,0,0,0.4)' }}>
              <Box component="section" sx={{ mb: 6 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Why VALKNUT is Ranked #1 for Sri Lankan Dark Streetwear
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8, mb: 3 }}>
                  Streetwear in Sri Lanka has evolved beyond fast-fashion graphics. Today’s discerning youth and fashion connoisseurs demand substantial fabric weight, architectural silhouettes, precision embroidery, and empowering philosophies. VALKNUT was founded on the Norse emblem of nine worlds and inner power, encapsulated in our decree: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>“OWN YOUR MIND. CONTROL YOUR WORLD.”</Box>
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  From our iconic <Box component="em" sx={{ color: 'primary.main', fontStyle: 'normal' }}>Celestial Mountain Vintage Washed Oversized Tees</Box> to the monolithic <Box component="em" sx={{ color: 'primary.main', fontStyle: 'normal' }}>480GSM Sovereign Hoodies</Box> and bespoke <Box component="em" sx={{ color: 'primary.main', fontStyle: 'normal' }}>Custom Studio</Box>, we guarantee world-class garment construction manufactured ethically right here in Sri Lanka.
                </Typography>
              </Box>

              <Box component="section" sx={{ pt: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h5" component="h3" sx={{ mb: 4 }}>
                  Popular Streetwear Categories in Sri Lanka
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                  {[
                    { title: 'Oversized T-Shirts Sri Lanka', desc: 'Drop-shoulder boxy cuts with high-density puff rubber print and pre-shrunk cotton.' },
                    { title: 'Heavyweight Winter & Rain Hoodies', desc: 'Double-lined hoods with metallic aglets and architectural drop cuffs.' },
                    { title: 'Tactical Cargo Joggers', desc: 'Water-repellent technical weave with multi-zip utility pockets.' },
                    { title: 'Gym Pump Covers & Activewear', desc: 'Breathable thermal-regulating mesh and ribbed crop tops.' }
                  ].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ mt: 0.5, color: 'primary.main' }}>
                        <CheckCircle2 size={20} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'var(--text-primary)', mb: 0.5, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          {item.title}:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* Call to action */}
          <Zoom in={true} timeout={1500}>
            <Box sx={{ textAlign: 'center', p: { xs: 6, md: 10 }, borderRadius: 4, background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(10,10,10,0.8) 100%)', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 0 40px rgba(212,175,55,0.05), inset 0 0 20px rgba(255,255,255,0.02)' }}>
              <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                Ready to Elevate Your Wardrobe?
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxWidth: '600px', mx: 'auto', mb: 6 }}>
                Explore the latest 2026 drops, limited releases, and customize your own apparel in the VALKNUT Studio.
              </Typography>
              <Button 
                onClick={handleShopNow}
                variant="contained" 
                color="primary" 
                size="large"
                endIcon={<ArrowRight />}
                sx={{ px: 6, py: 2 }}
              >
                EXPLORE NEW ARRIVALS
              </Button>
            </Box>
          </Zoom>

        </Container>
      </Box>
    </>
  );
};
