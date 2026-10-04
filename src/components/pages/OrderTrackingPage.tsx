import React, { useState, useEffect } from 'react';
import { Search, Truck, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Order } from '../../types/ecommerce';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  createTheme, ThemeProvider, Box, Typography, Button, 
  Container, Breadcrumbs, Link, Zoom, Fade, Paper, Chip, TextField, InputAdornment, Avatar
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
          padding: '12px 24px',
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
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(19, 21, 32, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(212,175,55,0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4AF37',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 15px rgba(212,175,55,0.2), inset 0 2px 5px rgba(0,0,0,0.3)',
            }
          }
        }
      }
    }
  }
});

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const seoMetadata = {
    title: 'Live Order Tracking & AWB Courier Status | VALKNUT Official',
    description: 'Track your VALKNUT Official streetwear parcel in real-time. Enter your order number or AWB tracking code for live dispatch and delivery updates in Sri Lanka.',
    keywords: 'track order valknut, streetwear package tracking, pronto lanka tracking, valknut courier status',
    canonicalUrl: 'https://valknutofficial.com/#/track-order',
    ogTitle: 'Live Order Tracking — VALKNUT Official',
    ogDescription: 'Live islandwide shipment tracking for your VALKNUT luxury garments.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Track Order', url: '/#/track-order' }
      ])
    ]
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryParams = new URLSearchParams(hash.split('?')[1]);
      const orderParam = queryParams.get('order');
      if (orderParam) {
        setSearchInput(orderParam);
        const term = orderParam.trim().toUpperCase();
        const found = orders.find(
          o => o.orderNumber.toUpperCase() === term || 
               (o.awbNumber && o.awbNumber.toUpperCase() === term)
        );
        if (found) {
          setSearchedOrder(found);
          setHasSearched(true);
        }
      }
    }
  }, [orders]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const term = searchInput.trim().toUpperCase();
    const found = orders.find(
      o => o.orderNumber.toUpperCase() === term || 
           (o.awbNumber && o.awbNumber.toUpperCase() === term)
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Payment Pending':
        return 1;
      case 'Payment Confirmed':
        return 2;
      case 'Processing':
        return 3;
      case 'Packed':
        return 4;
      case 'Shipped':
        return 5;
      case 'Delivered':
        return 6;
      default:
        return 2;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<Typography sx={{ color: 'text.secondary' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Live Order Tracking</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Truck size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>EXPRESS SRI LANKA LOGISTICS</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Track Your <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>VALKNUT Order</Box>
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '500px', mx: 'auto', lineHeight: 1.8 }}>
                Enter your VALKNUT Order ID (e.g. <Box component="code" sx={{ color: 'primary.main' }}>VK-2026-8801</Box>) or Courier Air Waybill (AWB) number.
              </Typography>
            </Box>
          </Fade>

          {/* Search Input Box */}
          <Fade in={true} timeout={1200}>
            <Paper elevation={24} sx={{ p: { xs: 4, md: 6 }, mb: 8 }}>
              <Box component="form" onSubmit={handleTrack} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. VK-2026-8801 or PRN-99882103"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><Search size={20} className="text-slate-400" /></InputAdornment>,
                      sx: { fontFamily: 'monospace', textTransform: 'uppercase', height: '100%' }
                    }
                  }}
                  sx={{ flex: 1 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  endIcon={<ArrowRight />}
                  sx={{ py: { xs: 2, sm: 0 }, px: 5 }}
                >
                  TRACK PACKAGE
                </Button>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 2, typography: 'caption', color: 'text.secondary', fontFamily: 'monospace' }}>
                <Typography variant="caption">Quick Demo IDs:</Typography>
                <Link component="button" onClick={() => setSearchInput('VK-2026-8801')} underline="always" sx={{ color: 'primary.main', '&:hover': { color: 'white' } }}>
                  VK-2026-8801 (Shipped)
                </Link>
                <Typography variant="caption">•</Typography>
                <Link component="button" onClick={() => setSearchInput('VK-2026-8802')} underline="always" sx={{ color: 'primary.main', '&:hover': { color: 'white' } }}>
                  VK-2026-8802 (Processing)
                </Link>
              </Box>
            </Paper>
          </Fade>

          {/* Results */}
          {hasSearched && (
            <Zoom in={true} timeout={500}>
              <Box>
                {searchedOrder ? (
                  <Paper elevation={12} sx={{ p: { xs: 4, sm: 6 }, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Header info */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 4, pb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>Order Reference</Typography>
                        <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>{searchedOrder.orderNumber}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>Status</Typography>
                        <Chip label={searchedOrder.orderStatus} sx={{ bgcolor: 'primary.main', color: '#000', fontWeight: 'bold', fontFamily: 'monospace' }} />
                      </Box>
                    </Box>

                    {/* Stepper */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
                      {[
                        { step: 2, icon: CheckCircle2, label: 'Confirmed', sub: 'Payment verified' },
                        { step: 3, icon: Clock, label: 'Processing', sub: 'Precision tailoring' },
                        { step: 5, icon: Truck, label: 'Shipped', sub: 'In transit' },
                        { step: 6, icon: MapPin, label: 'Delivered', sub: 'Recipient verified' },
                      ].map((item, idx) => {
                        const isActive = getStatusStep(searchedOrder.orderStatus) >= item.step;
                        return (
                          <Paper key={idx} elevation={isActive ? 8 : 0} sx={{ p: 3, textAlign: 'center', border: '1px solid', borderColor: isActive ? 'primary.main' : 'rgba(255,255,255,0.1)', bgcolor: isActive ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
                            <Box sx={{ color: isActive ? 'primary.main' : 'text.secondary', mb: 2, display: 'flex', justifyContent: 'center' }}>
                              <item.icon size={28} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 0.5 }}>{item.label}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.sub}</Typography>
                          </Paper>
                        )
                      })}
                    </Box>

                    {/* Courier Details */}
                    {searchedOrder.awbNumber && (
                      <Paper elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.5)', p: 4, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 1 }}>Courier Partner & AWB</Typography>
                          <Typography variant="h6">
                            {searchedOrder.courierName || 'Pronto Express'} — <Box component="span" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{searchedOrder.awbNumber}</Box>
                          </Typography>
                        </Box>
                        {searchedOrder.trackingLink && (
                          <Button variant="outlined" color="primary" href={searchedOrder.trackingLink} target="_blank" size="small">
                            Open Courier Portal
                          </Button>
                        )}
                      </Paper>
                    )}

                    {/* Order Items Preview */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', mb: 3 }}>
                        Items in This Shipment ({searchedOrder.items.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {searchedOrder.items.map((item: any, idx: number) => {
                          const img = item.customization?.finalPreviewDataUrl || item.imageUrl || item.product?.images?.[0] || '';
                          const name = item.productName || item.product?.name || 'Garment';
                          const size = item.size || item.selectedSize || 'M';
                          const color = item.color || item.selectedColor || '';

                          return (
                            <Paper key={idx} elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              {img && (
                                <Avatar variant="rounded" src={img} sx={{ width: 60, height: 60, bgcolor: 'background.default' }} />
                              )}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 0.5 }}>{name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>Size: {size} {color ? `| Color: ${color}` : ''} | Qty: {item.quantity}</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'primary.main' }}>
                                LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                              </Typography>
                            </Paper>
                          );
                        })}
                      </Box>
                    </Box>

                  </Paper>
                ) : (
                  <Paper elevation={12} sx={{ p: 8, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ color: 'primary.main', mb: 3, display: 'flex', justifyContent: 'center' }}>
                      <AlertCircle size={48} />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2 }}>No Order Found</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '400px', mx: 'auto' }}>
                      We couldn't find an order matching "<Box component="strong" sx={{ color: 'white' }}>{searchInput}</Box>". Please double check your order confirmation SMS/email or contact WhatsApp support (+94 77 123 4567).
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Zoom>
          )}

        </Container>
      </Box>
    </ThemeProvider>
  );
};
