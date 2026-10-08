import React from 'react';
import { Truck, RefreshCw, CreditCard } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  Box, Typography, Container, 
  Breadcrumbs, Link, Zoom, Fade, Paper, Divider 
} from '@mui/material';

export const ShippingPolicyPage: React.FC = () => {
  const seoMetadata = {
    title: 'Shipping, Islandwide Delivery & Exchange Policy | VALKNUT Official',
    description: 'Islandwide delivery across Colombo and all 25 districts in Sri Lanka. Free shipping on orders over LKR 10,000, 7-day size exchange guarantee, Koko 3x instalments.',
    keywords: 'streetwear shipping sri lanka, clothing delivery colombo, koko pay delivery, valknut returns and exchanges',
    canonicalUrl: 'https://valknutofficial.com/#/shipping-returns',
    ogTitle: 'Shipping, Islandwide Delivery & Exchange Policy — VALKNUT Official',
    ogDescription: 'Islandwide delivery, Koko 3x instalments, and 7-day size exchange guarantee.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Shipping & Exchanges', url: '/#/shipping-returns' }
      ])
    ]
  };

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: '10%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<Typography sx={{ color: 'var(--text-secondary)' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Shipping, Payments & Returns</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto', mb: { xs: 8, md: 12 } }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Truck size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>ISLANDWIDE LOGISTICS</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Shipping, Payments & <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Exchange Policy</Box>
              </Typography>

              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
                Transparent, secure, and expedited. We partner with Sri Lanka’s premier courier fleets to ensure your package arrives in pristine condition.
              </Typography>
            </Box>
          </Fade>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            
            {/* 1. Delivery Timelines & Rates */}
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
              <Paper elevation={12} sx={{ p: { xs: 4, sm: 6 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Truck size={24} />
                  </Box>
                  <Typography variant="h5" sx={{ letterSpacing: '0.05em' }}>1. Delivery Timelines & Rates</Typography>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                  <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', p: 4, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1 }}>Greater Colombo & Suburbs</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>1 to 2 business days</Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />
                    <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold' }}>Standard Rate: LKR 450 | FREE above LKR 10,000</Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', p: 4, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1 }}>All Islandwide Outstations</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>2 to 4 business days</Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />
                    <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold' }}>Standard Rate: LKR 450 | FREE above LKR 10,000</Typography>
                  </Paper>
                </Box>
              </Paper>
            </Zoom>

            {/* 2. Approved Payment Options */}
            <Zoom in={true} style={{ transitionDelay: '350ms' }}>
              <Paper elevation={12} sx={{ p: { xs: 4, sm: 6 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <CreditCard size={24} />
                  </Box>
                  <Typography variant="h5" sx={{ letterSpacing: '0.05em' }}>2. Approved Payment Options</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4 }}>
                  <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#4ade80', mb: 2, fontSize: '1.1rem' }}>Koko BNPL</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>Split your total bill into 3 equal monthly payments with 0% interest and zero hidden charges using your debit or credit card.</Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2, fontSize: '1.1rem' }}>OnePay Gateway</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>Bank-grade 256-bit encrypted card processing for Visa, MasterCard, UnionPay, and direct LankaQR instant mobile payments.</Typography>
                  </Paper>
                  
                  <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 2, fontSize: '1.1rem' }}>Cash on Delivery</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>Pay in cash directly to the courier agent upon receiving and inspecting your parcel packaging.</Typography>
                  </Paper>
                </Box>
              </Paper>
            </Zoom>

            {/* 3. Exchanges */}
            <Zoom in={true} style={{ transitionDelay: '500ms' }}>
              <Paper elevation={12} sx={{ p: { xs: 4, sm: 6 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <RefreshCw size={24} />
                  </Box>
                  <Typography variant="h5" sx={{ letterSpacing: '0.05em' }}>3. 7-Day Size Exchange Guarantee</Typography>
                </Box>
                
                <Box sx={{ maxWidth: '800px' }}>
                  <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8, mb: 3 }}>
                    If your chosen size does not fit your desired drape, you can request an exchange within 7 days of delivery. The item must be unwashed, unworn, with all original VALKNUT hangtags and packaging intact.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', display: 'block' }}>
                    *Customized products created in the VALKNUT Studio are non-refundable unless manufacturing defects occur.
                  </Typography>
                </Box>
              </Paper>
            </Zoom>

          </Box>
        </Container>
      </Box>
    </>
  );
};
