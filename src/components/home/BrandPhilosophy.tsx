import React from 'react';
import { Shield, Zap, Lock } from 'lucide-react';
import { 
  Box, Typography, Container, Grid 
} from '@mui/material';
import standardImg from '../../assets/background-images/The Valknut Standard.png';

export const BrandPhilosophy: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 10, sm: 14, lg: 16 }, 
          bgcolor: 'var(--bg-main)', 
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, lg: 10 }} sx={{ alignItems: 'center' }}>
            
            {/* Left Column: Brand Philosophy Visual (3D Polaroid Effect) */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  p: 1.5, 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.8))',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)',
                  transform: 'perspective(1000px) rotateY(5deg)',
                  transition: 'transform 0.5s',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }
                }}
              >
                <Box 
                  component="img"
                  src={standardImg} 
                  alt="VALKNUT Brand Craftsmanship - The Valknut Standard" 
                  loading="lazy"
                  sx={{ 
                    width: '100%', 
                    height: { xs: 320, sm: 460, lg: 540 }, 
                    objectFit: 'cover', 
                    borderRadius: 3, 
                    filter: 'contrast(1.05) brightness(0.95)' 
                  }}
                />
                
                {/* 3D Glass Overlay Box */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: { xs: 24, sm: 40 }, 
                    left: { xs: 24, sm: 40 }, 
                    right: { xs: 24, sm: 40 }, 
                    p: { xs: 3, sm: 4 }, 
                    bgcolor: 'rgba(10,12,16,0.85)', 
                    border: '1px solid rgba(212,175,55,0.4)', 
                    borderRadius: 3, 
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 1px 1px rgba(212,175,55,0.2)'
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 900, 
                      letterSpacing: '0.25em', 
                      display: 'block', 
                      mb: 1.5 
                    }}
                  >
                    THE VALKNUT CODE
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'var(--text-primary)', 
                      fontSize: { xs: '1rem', sm: '1.25rem' }, 
                      fontWeight: 900, 
                      fontFamily: '"Outfit", sans-serif', 
                      textTransform: 'uppercase', 
                      lineHeight: 1.2 
                    }}
                  >
                    “WE DO NOT FOLLOW TRENDS. WE ARCHITECT THE STANDARD.”
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Text & Pillars */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                
                <Box>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      px: 2, 
                      py: 1, 
                      bgcolor: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: 10,
                      mb: 3
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.25em' }}>
                      BRAND PHILOSOPHY
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }, 
                      letterSpacing: '-0.02em', 
                      lineHeight: 1.1,
                      mb: 3,
                      textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                  >
                    DESIGNED FOR THOSE WHO COMMAND THEIR DESTINY.
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: { xs: '0.875rem', sm: '1rem' }, 
                      lineHeight: 1.8, 
                      fontWeight: 300 
                    }}
                  >
                    VALKNUT Official was founded on a singular principle: true power starts within the mind. 
                    Our garments are built not merely as apparel, but as armor for the relentless—combining 
                    architectural heavy drape fabrics, precision tailoring, and dark luxury minimalism.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {[
                    { title: 'UNCOMPROMISED', icon: <Shield size={24} color="#D4AF37" />, desc: '480GSM ultra-dense organic cotton constructions.' },
                    { title: 'CUSTOM STUDIO', icon: <Zap size={24} color="#D4AF37" />, desc: 'Personalize with high-density puff & embroidery.' },
                    { title: 'SECURE CHECKOUT', icon: <Lock size={24} color="#D4AF37" />, desc: 'Koko, OnePay & eWAY instant payments.' }
                  ].map((pillar, idx) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={idx}>
                      <Box 
                        sx={{ 
                          p: 3, 
                          height: '100%',
                          bgcolor: 'var(--bg-surface)', 
                          border: '1px solid var(--border-subtle)', 
                          borderRadius: 3, 
                          boxShadow: 'var(--shadow-card)',
                          transition: 'all 0.3s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.7), inset 0 0 20px rgba(212,175,55,0.05)',
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <Box sx={{ mb: 1 }}>{pillar.icon}</Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {pillar.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.6875rem', lineHeight: 1.6 }}>
                          {pillar.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>
    </>
  );
};
