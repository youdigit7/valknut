import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  Box, Typography, Container, 
  Breadcrumbs, Link, Zoom, Fade, Paper, ToggleButton, ToggleButtonGroup, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

export const SizeGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERSIZED_TEE' | 'HOODIES' | 'JOGGERS'>('OVERSIZED_TEE');
  const [unit, setUnit] = useState<'cm' | 'inches'>('inches');

  const seoMetadata = {
    title: 'Streetwear Size Chart & Fit Guide | VALKNUT Official Sri Lanka',
    description: 'Find your perfect oversized streetwear fit. Precise measurement charts in inches and cm for 480GSM Sovereign Hoodies, boxy t-shirts, and tactical joggers.',
    keywords: 'streetwear size guide, oversized t shirt measurements, hoodie size chart sri lanka, valknut fit guide',
    canonicalUrl: 'https://valknutofficial.com/#/size-guide',
    ogTitle: 'Streetwear Size Chart & Fit Guide — VALKNUT Official',
    ogDescription: 'Precise dimensional charts for intentional boxy and oversized street drape.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    jsonLd: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/#/' },
        { name: 'Size Guide', url: '/#/size-guide' }
      ])
    ]
  };

  const handleTabChange = (_event: React.MouseEvent<HTMLElement>, newTab: 'OVERSIZED_TEE' | 'HOODIES' | 'JOGGERS' | null) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const handleUnitChange = (_event: React.MouseEvent<HTMLElement>, newUnit: 'cm' | 'inches' | null) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <SEOHead metadata={seoMetadata} />
        
        {/* Ambient Background Effects */}
        <Box sx={{ position: 'absolute', top: 100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumbs */}
          <Breadcrumbs separator={<Typography sx={{ color: 'var(--text-secondary)' }}>/</Typography>} sx={{ mb: 6, '& .MuiBreadcrumbs-ol': { textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontFamily: 'monospace' } }}>
            <Link href="#/" underline="hover" sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } }}>Home</Link>
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Size Guide & Garment Care</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: 'center', maxWidth: 'md', mx: 'auto', mb: { xs: 8, md: 12 } }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', bgcolor: 'rgba(212,175,55,0.1)', color: 'primary.main', mb: 4 }}>
                <Ruler size={14} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>PRECISION TAILORING</Typography>
              </Box>
              
              <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Size Guide & <Box component="span" sx={{ background: 'linear-gradient(to right, #D4AF37, #FFF5D1, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Care Standard</Box>
              </Typography>

              <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
                VALKNUT garments feature intentional boxy, dropped-shoulder silhouettes. Follow our dimensional charts to achieve your desired drape.
              </Typography>
            </Box>
          </Fade>

          {/* Controls */}
          <Fade in={true} timeout={1200}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 4, mb: 6, pb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={handleTabChange}
                aria-label="garment category"
                size="small"
                sx={{ bgcolor: 'rgba(0,0,0,0.5)', '& .MuiToggleButton-root': { px: { xs: 2, md: 4 }, py: 1.5, fontSize: { xs: '0.7rem', md: '0.8rem' } } }}
              >
                <ToggleButton value="OVERSIZED_TEE" aria-label="oversized tees">
                  Oversized Tees (280-310 GSM)
                </ToggleButton>
                <ToggleButton value="HOODIES" aria-label="hoodies">
                  Sovereign Hoodies (480 GSM)
                </ToggleButton>
                <ToggleButton value="JOGGERS" aria-label="joggers">
                  Tactical Cargo Joggers
                </ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                value={unit}
                exclusive
                onChange={handleUnitChange}
                aria-label="measurement unit"
                size="small"
                sx={{ bgcolor: 'rgba(0,0,0,0.5)', '& .MuiToggleButton-root': { px: 3, py: 1, fontFamily: 'monospace' } }}
              >
                <ToggleButton value="inches" aria-label="inches">
                  Inches (in)
                </ToggleButton>
                <ToggleButton value="cm" aria-label="centimeters">
                  Centimeters (cm)
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Fade>

          {/* Measurement Table */}
          <Zoom in={true} timeout={600} key={activeTab + unit}>
            <Paper elevation={12} sx={{ mb: 12, overflow: 'hidden' }}>
              <TableContainer sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}>
                <Table aria-label="size guide table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Size</TableCell>
                      <TableCell>{activeTab === 'JOGGERS' ? 'Waist' : 'Chest Width'}</TableCell>
                      <TableCell>{activeTab === 'JOGGERS' ? 'Outseam Length' : 'Body Length'}</TableCell>
                      <TableCell>{activeTab === 'JOGGERS' ? 'Thigh' : 'Shoulder Width'}</TableCell>
                      <TableCell>Recommended Height</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTab === 'OVERSIZED_TEE' && (
                      <React.Fragment>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (Small)</TableCell>
                          <TableCell>{unit === 'inches' ? '44"' : '112 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '28.5"' : '72 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '21"' : '53 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'4" - 5'7" (162-170cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (Medium)</TableCell>
                          <TableCell>{unit === 'inches' ? '46"' : '117 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '29.5"' : '75 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '22"' : '56 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'8" - 5'11" (172-180cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>L (Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '48"' : '122 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '30.5"' : '77 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '23"' : '58 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'0" - 6'2" (182-188cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>XL (Extra Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '50"' : '127 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '31.5"' : '80 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '24"' : '61 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'2"+ (188cm+)</TableCell>
                        </TableRow>
                      </React.Fragment>
                    )}

                    {activeTab === 'HOODIES' && (
                      <React.Fragment>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (Small)</TableCell>
                          <TableCell>{unit === 'inches' ? '46"' : '117 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '27"' : '69 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '22"' : '56 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'4" - 5'7"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (Medium)</TableCell>
                          <TableCell>{unit === 'inches' ? '48"' : '122 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '28"' : '71 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '23"' : '58 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'8" - 5'11"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>L (Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '50"' : '127 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '29"' : '74 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '24"' : '61 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'0" - 6'2"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>XL (Extra Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '52"' : '132 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '30"' : '76 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '25"' : '63 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'2"+</TableCell>
                        </TableRow>
                      </React.Fragment>
                    )}

                    {activeTab === 'JOGGERS' && (
                      <React.Fragment>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (28-30)</TableCell>
                          <TableCell>{unit === 'inches' ? '28-30"' : '71-76 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '39"' : '99 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '24"' : '61 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>Standard Fit</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (31-33)</TableCell>
                          <TableCell>{unit === 'inches' ? '31-33"' : '78-84 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '40"' : '101 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '25"' : '63 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>Standard Fit</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>L (34-36)</TableCell>
                          <TableCell>{unit === 'inches' ? '34-36"' : '86-91 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '41"' : '104 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '26"' : '66 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>Standard Fit</TableCell>
                        </TableRow>
                      </React.Fragment>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Zoom>

          {/* Official Care Label */}
          <Fade in={true} timeout={1500}>
            <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 8 }}>
              <Paper elevation={24} sx={{ p: 4, bgcolor: 'black', border: '2px solid rgba(255,255,255,0.15)', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: 'primary.main', color: 'black', px: 2, py: 0.5, typography: 'caption', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                  CERTIFIED CARE
                </Box>
                <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
                  <Typography variant="h4" sx={{ letterSpacing: '0.15em', mb: 1 }}>VALKNUT</Typography>
                  <Typography variant="caption" sx={{ letterSpacing: '0.2em', color: 'var(--text-secondary)' }}>— ESSENTIAL —</Typography>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'primary.main', letterSpacing: '0.1em', fontWeight: 'bold', mb: 4 }}>
                  “OWN YOUR MIND. CONTROL YOUR WORLD.”
                </Typography>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2, mb: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>
                    100% COTTON • MADE IN SRI LANKA
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 3, fontFamily: 'sans-serif' }}>
                  CARE INSTRUCTIONS
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, fontFamily: 'sans-serif' }}>
                  {[
                    'Machine Wash Cold (30°C)',
                    'Wash With Similar Colours',
                    'Do Not Bleach',
                    'Do Not Tumble Dry',
                    'Iron Low Heat (Reverse)',
                    'Do Not Dry Clean'
                  ].map((instruction, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{instruction}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Fade>

        </Container>
      </Box>
    </>
  );
};
