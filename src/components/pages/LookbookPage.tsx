import React, { useMemo } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  Box, Typography, Button, 
  Container, Card, CardContent, Breadcrumbs, Link, Zoom, Fade, Chip
} from '@mui/material';
interface LookbookItem {
  id: string;
  title: string;
  collection: string;
  image: string;
  productId: string;
  productName: string;
  price: number;
}

export const LookbookPage: React.FC = () => {
  const { products, setSelectedProduct } = useStore();

  const seoMetadata = {
    title: 'Editorial Lookbook 2026 | VALKNUT Official Sri Lanka',
    description: 'Explore the 2026 VALKNUT Official Streetwear Lookbook. 480GSM Sovereign Hoodies, acid wash oversized tees, and tactical utility wear documented on Colombo brutalist backdrops.',
    keywords: 'streetwear lookbook sri lanka, valknut editorial, fashion photography colombo, dark luxury streetwear aesthetic',
    canonicalUrl: 'https://valknutofficial.com/#/lookbook',
    ogTitle: 'Editorial Lookbook 2026 — VALKNUT Official',
    ogDescription: 'Documenting the collision of dark architectural minimalism and Colombo streetwear.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Editorial Lookbook', url: '/#/lookbook' }
      ])
    ]
  };

  const lookbookItems: LookbookItem[] = useMemo(() => {
    return products
      .filter(p => Array.isArray(p.images) && p.images.length > 0)
      .map((p, index) => ({
        id: `look-${p.id}`,
        title: `Look 0${index + 1}: ${p.name}`,
        collection: p.collection || 'VALKNUT ARCHIVE',
        image: p.images[0],
        productId: p.id,
        productName: p.name,
        price: p.salePrice || p.price
      }));
  }, [products]);

  const handleOpenProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: 0, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<Typography sx={{ color: 'var(--text-secondary)' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Editorial Lookbook 2026</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto', mb: { xs: 8, md: 12 } }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Sparkles size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>CAMPAIGN 2026 • DARK SOVEREIGN</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Editorial <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Lookbook</Box>
              </Typography>

              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
                Documenting the collision of dark architectural minimalism and Colombo streetwear culture. Shot on 35mm brutalist concrete backdrops.
              </Typography>
            </Box>
          </Fade>

          {/* Grid */}
          {lookbookItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 12, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                No Lookbook Garments Published Yet
              </Typography>
              <Button variant="outlined" color="primary" href="#/shop">
                Explore Main Catalog
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 6 }}>
              {lookbookItems.map((item, index) => (
              <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', '&:hover .lookbook-image': { transform: 'scale(1.08)' }, '&:hover .overlay-action': { opacity: 1, transform: 'translateY(0)' } }}>
                  <Box sx={{ position: 'relative', pt: '133%', overflow: 'hidden', bgcolor: '#000' }}>
                    <Box 
                      component="img"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="lookbook-image"
                      sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)', filter: 'brightness(0.95) contrast(1.1)' }}
                    />
                    
                    {/* Dark gradient overlay */}
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)', opacity: 0.8, transition: 'opacity 0.4s', '.MuiCard-root:hover &': { opacity: 0.95 } }} />

                    {/* Collection Tag */}
                    <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                      <Chip label={item.collection} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: '0.65rem', borderRadius: 1 }} />
                    </Box>

                    {/* Hover Action Button */}
                    <Box className="overlay-action" sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, opacity: 0, transform: 'translateY(15px)', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenProduct(item.productId)}
                        startIcon={<ShoppingBag size={18} />}
                        sx={{ py: 1.5, fontSize: '0.75rem' }}
                      >
                        VIEW GARMENT — LKR {item.price.toLocaleString()}
                      </Button>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, bgcolor: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, letterSpacing: '0.05em' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', letterSpacing: '0.1em' }}>
                      {item.productName}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        )}
          
        </Container>
      </Box>
    </>
  );
};
