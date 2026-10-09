import React from 'react';
import { 
  Box, Typography, Container, Grid, Button
} from '@mui/material';

const SOCIAL_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial5',
    platform: 'TikTok',
    link: 'https://tiktok.com/@valknutofficial5'
  },
  {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    platform: 'Instagram',
    handle: '@valknutofficial1',
    link: 'https://instagram.com/valknutofficial1'
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial5',
    platform: 'TikTok',
    link: 'https://tiktok.com/@valknutofficial5'
  },
  {
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    handle: '@valknutofficial1',
    platform: 'Instagram',
    link: 'https://instagram.com/valknutofficial1'
  }
];

export const InstagramSection: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 7, sm: 10, lg: 12 }, 
          bgcolor: 'var(--bg-main)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          
          {/* Centered Section Header with 3D Aesthetic */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold', 
                letterSpacing: '0.25em', 
                display: 'block', 
                mb: 2 
              }}
            >
              COMMUNITY & LOOKBOOK
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, 
                letterSpacing: '-0.02em',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              FOLLOW THE MOVEMENT
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--text-secondary)', 
                maxWidth: '600px', 
                mx: 'auto',
                mb: 4,
                lineHeight: 1.8
              }}
            >
              Tag @valknutofficial1 or use #VALKNUT to be featured on our official channel.
            </Typography>
            <Button 
              href="https://instagram.com/valknutofficial1"
              target="_blank"
              rel="noreferrer"
              sx={{ 
                color: 'var(--text-primary)',
                borderBottom: '1px solid',
                borderColor: 'primary.main',
                pb: 0.5,
                borderRadius: 0,
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                fontWeight: 'bold',
                fontFamily: '"Inter", sans-serif',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.2)'
                }
              }}
            >
              VISIT OFFICIAL INSTAGRAM
            </Button>
          </Box>

          {/* Social Media Visual Grid (Photos untouched, fully MUI mapped) */}
          <Grid container spacing={{ xs: 1.5, sm: 2, lg: 3 }}>
            {SOCIAL_POSTS.map((post, idx) => (
              <Grid size={{ xs: 6, sm: 4, lg: 2 }} key={idx}>
                <Box
                  component="a"
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    display: 'block',
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    bgcolor: '#12141E',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    '&:hover': {
                      borderColor: 'rgba(212,175,55,0.5)',
                      boxShadow: '0 15px 35px rgba(212,175,55,0.2), 0 10px 20px rgba(0,0,0,0.8)',
                      transform: 'translateY(-4px)',
                      '& .post-img': {
                        transform: 'scale(1.1)',
                        filter: 'brightness(1.05)'
                      },
                      '& .post-overlay': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <Box
                    component="img"
                    className="post-img"
                    src={post.image}
                    alt={`VALKNUT Social Post ${idx + 1}`}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.9)',
                      transition: 'all 0.5s ease'
                    }}
                  />
                  <Box
                    className="post-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      textAlign: 'center',
                      backdropFilter: 'blur(2px)'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold', 
                        letterSpacing: '0.15em', 
                        textTransform: 'uppercase', 
                        mb: 0.5 
                      }}
                    >
                      {post.platform}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'var(--text-primary)', 
                        fontWeight: 'bold', 
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {post.handle}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
        </Container>
      </Box>
    </>
  );
};
