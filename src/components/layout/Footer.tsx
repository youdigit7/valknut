import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { 
  Box, Typography, Container, 
  Grid, Link, IconButton, Paper, TextField, Button
} from '@mui/material';
import darkLogo from '../../assets/logos/symbol-dark.png';



export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <>
      <Box component="footer" sx={{ bgcolor: 'var(--bg-main)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Top Editorial Banner */}
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-surface)', py: { xs: 6, sm: 8 }, borderBottom: '1px solid rgba(255,255,255,0.05)', borderRadius: 0 }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 4, textAlign: { xs: 'center', lg: 'left' } }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 1 }}>
                  THE VALKNUT CREED
                </Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, letterSpacing: '-0.02em' }}>
                  “OWN YOUR MIND. CONTROL YOUR WORLD.”
                </Typography>
              </Box>

              {/* Newsletter Form */}
              <Box sx={{ width: '100%', maxWidth: { xs: '400px', lg: '500px' } }}>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: '250px', '& .MuiInputBase-input': { fontSize: '0.75rem', color: 'var(--text-primary)' } }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ py: 1.5, px: 3, flexShrink: 0, minWidth: { xs: '100%', sm: 'auto' } }}
                  >
                    {subscribed ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Check size={16} /> JOINED
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        JOIN CLUB <ArrowRight size={14} />
                      </Box>
                    )}
                  </Button>
                </form>
                {subscribed && (
                  <Typography variant="caption" sx={{ color: 'primary.main', mt: 1, display: 'block' }}>
                    ✓ You have been added to the VIP drop list.
                  </Typography>
                )}
              </Box>
            </Box>
          </Container>
        </Paper>

        {/* Main Footer Links */}
        <Container maxWidth="xl" sx={{ py: { xs: 8, sm: 10 } }}>
          <Grid container spacing={6}>
            
            {/* Col 1: Brand & Socials */}
            <Grid size={{ xs: 12, md: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box 
                  component="img"
                  src={darkLogo}
                  alt="Valknut Logo"
                  sx={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.4))' }} 
                />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.2em', fontFamily: '"Outfit", sans-serif' }}>VALKNUT</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8, mb: 4, maxWidth: '400px' }}>
                High-end streetwear rooted in Norse symbolism and modern minimalism. Designed in Sri Lanka and engineered for the world.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { href: 'https://instagram.com/valknutofficial1', label: 'Instagram', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" /></svg> },
                  { href: 'https://tiktok.com/@valknutofficial5', label: 'TikTok', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.18 8.18 0 004.76 1.52V7.05a4.82 4.82 0 01-1-.36z"/></svg> },
                  { href: 'https://facebook.com/valknutofficial', label: 'Facebook', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { href: 'https://wa.me/94770000000', label: 'WhatsApp', color: '#25D366', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> }
                ].map((social, idx) => (
                  <IconButton 
                    key={idx} 
                    href={social.href} 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label={social.label}
                    sx={{ 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: 1, 
                      color: 'var(--text-secondary)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        color: social.color || 'primary.main',
                        borderColor: social.color ? `${social.color}66` : 'rgba(212,175,55,0.4)',
                        bgcolor: 'rgba(255,255,255,0.05)'
                      }
                    }}
                  >
                    {social.svg}
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* Col 2: Shop */}
            <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.2em', mb: 3, display: 'block' }}>SHOP</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'All Products', href: '#/shop' },
                  { label: 'Men Collection', href: '#/category/men' },
                  { label: 'Women Collection', href: '#/category/women' },
                  { label: 'Essentials & Accessories', href: '#/category/essentials' },
                  { label: 'Custom Studio', href: '#/custom-studio', highlight: true },
                  { label: 'New Drops', href: '#/shop' }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} underline="none" sx={{ color: link.highlight ? 'primary.main' : 'text.secondary', fontWeight: link.highlight ? 'bold' : 'normal', fontSize: '0.8rem', transition: 'color 0.2s', '&:hover': { color: link.highlight ? 'primary.dark' : 'white' } }}>
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Col 3: Brand */}
            <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.2em', mb: 3, display: 'block' }}>BRAND</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'About VALKNUT', href: '#/brand-story' },
                  { label: 'Brand Story', href: '#/brand-story' },
                  { label: 'Lookbook 2024', href: '#/lookbook' },
                  { label: 'Sri Lanka Streetwear', href: '#/sri-lanka-streetwear' },
                  { label: 'Contact Us', href: '#/brand-story' }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} underline="none" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', transition: 'color 0.2s', '&:hover': { color: 'var(--text-primary)' } }}>
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Col 4: Customer Service */}
            <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.2em', mb: 3, display: 'block' }}>CUSTOMER SERVICE</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Track Your Order', href: '#/track-order' },
                  { label: 'Size Guide & Fit', href: '#/size-guide' },
                  { label: 'Shipping Information', href: '#/shipping-returns' },
                  { label: 'Exchange & Returns', href: '#/shipping-returns' },
                  { label: 'FAQs', href: '#/shipping-returns' }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} underline="none" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', transition: 'color 0.2s', '&:hover': { color: 'var(--text-primary)' } }}>
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Col 5: Policies */}
            <Grid size={{ xs: 6, sm: 6, lg: 2 }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.2em', mb: 3, display: 'block' }}>POLICIES & LEGAL</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Privacy Policy', href: '#/shipping-returns' },
                  { label: 'Terms of Service', href: '#/shipping-returns' },
                  { label: 'Return Policy', href: '#/shipping-returns' },
                  { label: 'Payment Security', href: '#/shipping-returns' },
                  { label: '✦ Executive Admin', href: '#/admin', highlightAdmin: true }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} underline="none" sx={{ color: link.highlightAdmin ? 'rgba(212,175,55,0.7)' : 'text.secondary', fontSize: link.highlightAdmin ? '0.75rem' : '0.8rem', fontFamily: link.highlightAdmin ? '"Inter", sans-serif' : 'inherit', mt: link.highlightAdmin ? 1 : 0, transition: 'color 0.2s', '&:hover': { color: link.highlightAdmin ? 'primary.main' : 'white' } }}>
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
            
          </Grid>
        </Container>

        {/* Bottom Copyright & Payment Methods */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'var(--bg-main)' }}>
          <Container maxWidth="xl" sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
              &copy; {new Date().getFullYear()} VALKNUT Official. All rights reserved. Built in Colombo.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.65rem', mr: 1 }}>ACCEPTED:</Typography>
              {['Visa', 'Mastercard', 'Koko', 'MintPay', 'Bank Transfer', 'COD'].map(method => (
                <Box key={method} sx={{ px: 1.5, py: 0.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, bgcolor: '#12141E' }}>
                  <Typography variant="caption" sx={{ color: '#e2e8f0', fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                    {method}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

      </Box>
    </>
  );
};
