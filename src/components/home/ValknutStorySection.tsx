import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { 
  Box, Typography, Container, Grid, Button
} from '@mui/material';

export const ValknutStorySection: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, sm: 12, lg: 16 }, 
          bgcolor: 'var(--bg-main)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, lg: 12 }} sx={{ alignItems: 'center' }}>
            
            {/* Left - Text Content */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold', 
                    letterSpacing: '0.3em', 
                    display: 'block', 
                    mb: 1 
                  }}
                >
                  THE VALKNUT STORY
                </Typography>
                
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '4rem' }, 
                    letterSpacing: '-0.02em',
                    lineHeight: 1.12,
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    color: 'var(--text-primary)'
                  }}
                >
                  THREE KNOTS.<br />
                  <Box 
                    component="span" 
                    sx={{ 
                      background: 'linear-gradient(to right, #ffffff, #F3E5AB, #D4AF37)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                      mt: 1
                    }}
                  >
                    ONE VOW.
                  </Box>
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.8,
                    fontWeight: 'bold',
                    maxWidth: '90%'
                  }}
                >
                  The Valknut is an ancient mark of the bound — mind, body and will held in a single impenetrable form.
                  We took that sacred geometry out of ancient stone and forged it into garments designed for individuals who build, lead, and conquer.
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(148, 163, 184, 0.7)', 
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    lineHeight: 1.8,
                    maxWidth: '90%',
                    mb: 2
                  }}
                >
                  Every thread, every cut, and every custom hardware detail is a deliberate architectural choice. No fillers. No trend-chasing.
                  Just honest, heavyweight construction from our studio in Colombo.
                </Typography>
                
                <Box>
                  <Button
                    onClick={() => (window.location.hash = '#/brand-story')}
                    sx={{
                      height: '48px',
                      px: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'var(--text-primary)',
                      fontWeight: 900,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      letterSpacing: '0.15em',
                      borderRadius: 1,
                      bgcolor: 'transparent',
                      transition: 'all 0.3s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(212,175,55,0.1)',
                        boxShadow: '0 4px 20px rgba(212,175,55,0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    READ THE FULL STORY <ArrowRight size={16} />
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Right - Cinematic Visual Showcase */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  aspectRatio: '4/3', 
                  bgcolor: '#12141E', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  boxShadow: '0 25px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'rgba(212,175,55,0.4)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.2)',
                    '& .bg-img': {
                      transform: 'scale(1.05)'
                    },
                    '& .play-btn': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 45px rgba(212,175,55,0.6)'
                    }
                  }
                }}
              >
                <Box
                  component="img"
                  className="bg-img"
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85"
                  alt="VALKNUT Brand Film"
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.7) contrast(1.25)',
                    transition: 'transform 0.7s ease'
                  }}
                />
                
                {/* Internal Gradients */}
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent, rgba(0,0,0,0.2))' }} />
                
                {/* Play Trigger */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: 'center', 
                    p: 3 
                  }}
                >
                  <Box 
                    className="play-btn"
                    sx={{ 
                      width: 72, 
                      height: 72, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      color: 'black', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 0 35px rgba(212,175,55,0.4)',
                      transition: 'all 0.3s ease',
                      mb: 3
                    }}
                  >
                    <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '0.875rem', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.15em',
                      mb: 0.5
                    }}
                  >
                    WATCH BRAND FILM (90s)
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.6875rem', 
                      letterSpacing: '0.05em' 
                    }}
                  >
                    Filmed on 35mm in Sri Lanka
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>
    </>
  );
};
