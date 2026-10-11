import React from 'react';
import { 
  Box, Typography, Container
} from '@mui/material';
import { Play } from 'lucide-react';
import lifestyleImg from '../../assets/background-images/WhatsApp Image 2026-09-29 at 7.10.53 PM.jpeg';

export const LifestyleFilmSection: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, sm: 12, lg: 16 }, 
          bgcolor: 'var(--bg-main)', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          
          {/* Section Header */}
          <Box sx={{ mb: { xs: 5, sm: 8 }, px: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold', 
                letterSpacing: '0.25em', 
                display: 'block', 
                mb: 1.5 
              }}
            >
              CAMPAIGN
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3rem' }, 
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: 'var(--text-primary)'
              }}
            >
              DROP 04 — LIFESTYLE FILM
            </Typography>
          </Box>

          {/* Video Embed Placeholder (3D Glass Box) */}
          <Box 
            sx={{ 
              position: 'relative',
              aspectRatio: { xs: '9/16', sm: '16/9' },
              bgcolor: '#12141E',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 4,
              background: 'linear-gradient(135deg, rgba(18,20,30,1) 0%, rgba(10,12,18,1) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(212,175,55,0.4)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(212,175,55,0.2), 0 0 40px rgba(212,175,55,0.1)',
                '& .lifestyle-bg': {
                  transform: 'scale(1.05)'
                },
                '& .play-button': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.6)'
                }
              }
            }}
          >
            {/* Background Poster Image */}
            <Box
              component="img"
              className="lifestyle-bg"
              src={lifestyleImg}
              alt="VALKNUT Lifestyle Campaign Film"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.55) contrast(1.15)',
                transition: 'transform 0.7s ease',
                zIndex: 0
              }}
            />
            {/* Overlay Gradient */}
            <Box 
              sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.7) 100%)', 
                zIndex: 1 
              }} 
            />
            
            <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Play Button */}
            <Box
              className="play-button"
              sx={{
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                borderRadius: '50%',
                bgcolor: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(212,175,55,0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <Play size={32} color="#D4AF37" style={{ marginLeft: '4px' }} />
            </Box>

            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold', 
                letterSpacing: '0.2em', 
                display: 'block', 
                mb: 2 
              }}
            >
              VIDEO
            </Typography>
            <Typography 
              sx={{ 
                color: 'var(--text-primary)', 
                fontSize: { xs: '0.875rem', sm: '1rem' }, 
                fontWeight: 'bold',
                fontFamily: '"Inter", sans-serif',
                mb: 1
              }}
            >
              Lifestyle / campaign video —
            </Typography>
            <Typography 
              sx={{ 
                color: 'var(--text-primary)', 
                fontSize: { xs: '0.875rem', sm: '1rem' }, 
                fontWeight: 'bold',
                fontFamily: '"Inter", sans-serif'
              }}
            >
              cinematic 4K cut with sound toggle
            </Typography>
            <Typography 
              variant="caption"
              sx={{ 
                color: 'var(--text-secondary)', 
                mt: 3,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                lineHeight: 1.6,
                maxWidth: '400px'
              }}
            >
              Sits full-width. Mobile receives a 9:16 vertical version optimised for Instagram/TikTok traffic.
            </Typography>
            </Box>
          </Box>

        </Container>
      </Box>
    </>
  );
};
