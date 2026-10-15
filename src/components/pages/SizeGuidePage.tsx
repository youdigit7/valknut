import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { 
  Box, Typography, Container, 
  Breadcrumbs, Link, Zoom, Fade, Paper, ToggleButton, ToggleButtonGroup, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useAppTheme } from '../../context/ThemeContext';

export const SizeGuidePage: React.FC = () => {
  const { mode } = useAppTheme();
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 4, mb: 6, pb: 4, borderBottom: '1px solid var(--border-subtle)' }}>
              <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={handleTabChange}
                aria-label="garment category"
                size="small"
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  p: 0.5,
                  '& .MuiToggleButton-root': {
                    px: { xs: 2, md: 3 },
                    py: 1.2,
                    fontSize: { xs: '0.7rem', md: '0.78rem' },
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '6px !important',
                    '&.Mui-selected': {
                      bgcolor: mode === 'dark' ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.22)',
                      color: mode === 'dark' ? '#D4AF37' : '#997300',
                      fontWeight: 900,
                    }
                  }
                }}
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
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  p: 0.5,
                  '& .MuiToggleButton-root': {
                    px: 3,
                    py: 1,
                    fontFamily: 'monospace',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '6px !important',
                    '&.Mui-selected': {
                      bgcolor: mode === 'dark' ? 'rgba(212,175,55,0.18)' : 'rgba(212,175,55,0.22)',
                      color: mode === 'dark' ? '#D4AF37' : '#997300',
                      fontWeight: 900,
                    }
                  }
                }}
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
            <Paper
              elevation={12}
              sx={{
                mb: 12,
                overflow: 'hidden',
                bgcolor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <TableContainer sx={{ bgcolor: 'transparent' }}>
                <Table aria-label="size guide table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 800 }}>Size</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 800 }}>{activeTab === 'JOGGERS' ? 'Waist' : 'Chest Width'}</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 800 }}>{activeTab === 'JOGGERS' ? 'Outseam Length' : 'Body Length'}</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 800 }}>{activeTab === 'JOGGERS' ? 'Thigh' : 'Shoulder Width'}</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 800 }}>Recommended Height</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTab === 'OVERSIZED_TEE' && (
                      <React.Fragment>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (Small)</TableCell>
                          <TableCell>{unit === 'inches' ? '44"' : '112 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '28.5"' : '72 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '21"' : '53 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'4" - 5'7" (162-170cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (Medium)</TableCell>
                          <TableCell>{unit === 'inches' ? '46"' : '117 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '29.5"' : '75 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '22"' : '56 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'8" - 5'11" (172-180cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>L (Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '48"' : '122 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '30.5"' : '77 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '23"' : '58 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'0" - 6'2" (182-188cm)</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
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
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (Small)</TableCell>
                          <TableCell>{unit === 'inches' ? '46"' : '117 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '27"' : '69 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '22"' : '56 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'4" - 5'7"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (Medium)</TableCell>
                          <TableCell>{unit === 'inches' ? '48"' : '122 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '28"' : '71 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '23"' : '58 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>5'8" - 5'11"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>L (Large)</TableCell>
                          <TableCell>{unit === 'inches' ? '50"' : '127 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '29"' : '74 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '24"' : '61 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>6'0" - 6'2"</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
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
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>S (28-30)</TableCell>
                          <TableCell>{unit === 'inches' ? '28-30"' : '71-76 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '39"' : '99 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '24"' : '61 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>Standard Fit</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                          <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>M (31-33)</TableCell>
                          <TableCell>{unit === 'inches' ? '31-33"' : '78-84 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '40"' : '101 cm'}</TableCell>
                          <TableCell>{unit === 'inches' ? '25"' : '63 cm'}</TableCell>
                          <TableCell sx={{ color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>Standard Fit</TableCell>
                        </TableRow>
                        <TableRow hover sx={{ '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
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
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 3, sm: 5 },
                  bgcolor: 'var(--bg-surface)',
                  border: mode === 'dark' ? '2px solid rgba(212,175,55,0.35)' : '2px solid rgba(212,175,55,0.45)',
                  borderRadius: 2,
                  boxShadow: mode === 'dark'
                    ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.08)'
                    : '0 16px 45px rgba(0, 0, 0, 0.08), 0 0 30px rgba(212, 175, 55, 0.12)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#D4AF37',
                    color: '#000000',
                    px: 2.5,
                    py: 0.6,
                    typography: 'caption',
                    fontWeight: 900,
                    letterSpacing: '0.22em',
                    borderRadius: '4px',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                  }}
                >
                  CERTIFIED CARE
                </Box>
                <Box sx={{ textAlign: 'center', mb: 3.5, mt: 1.5 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      letterSpacing: '0.18em',
                      fontWeight: 900,
                      mb: 0.5,
                      color: 'var(--text-primary)',
                      fontFamily: '"Outfit", sans-serif',
                    }}
                  >
                    VALKNUT
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      letterSpacing: '0.25em',
                      color: 'var(--text-secondary)',
                      fontWeight: 700,
                      display: 'block',
                    }}
                  >
                    — ESSENTIAL —
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    color: mode === 'dark' ? '#D4AF37' : '#997300',
                    letterSpacing: '0.12em',
                    fontWeight: 800,
                    mb: 3.5,
                    fontSize: '0.85rem',
                  }}
                >
                  “OWN YOUR MIND. CONTROL YOUR WORLD.”
                </Typography>

                <Box
                  sx={{
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    py: 2,
                    mb: 3.5,
                    textAlign: 'center',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      fontFamily: '"Outfit", sans-serif',
                      color: 'var(--text-primary)',
                      fontSize: '0.825rem',
                    }}
                  >
                    100% COTTON • MADE IN SRI LANKA
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    color: mode === 'dark' ? '#D4AF37' : '#997300',
                    mb: 2.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                  }}
                >
                  CARE INSTRUCTIONS
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2.5,
                    fontFamily: 'sans-serif',
                  }}
                >
                  {[
                    'Machine Wash Cold (30°C)',
                    'Wash With Similar Colours',
                    'Do Not Bleach',
                    'Do Not Tumble Dry',
                    'Iron Low Heat (Reverse)',
                    'Do Not Dry Clean'
                  ].map((instruction, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: '#D4AF37',
                          boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {instruction}
                      </Typography>
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
