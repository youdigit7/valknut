import React from 'react';
import { Star } from 'lucide-react';
import { 
  Box, Typography, Container, Grid 
} from '@mui/material';

interface ReviewData {
  stars: number;
  title: string;
  text: string;
  name: string;
  location: string;
  image: string;
}

const reviews: ReviewData[] = [
  {
    stars: 5,
    title: 'HEAVIEST TEE I OWN',
    text: 'The 240 GSM feels like armour and the print hasn\'t cracked after 20 washes. Packaging alone feels like a luxury drop.',
    name: 'DINUK P.',
    location: 'COLOMBO',
    image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=400&q=80'
  },
  {
    stars: 5,
    title: 'FIT IS UNREAL',
    text: 'Ordered from the UK, arrived in 6 days with tracking updates by SMS the whole way. Sizing guide was accurate.',
    name: 'SARA K.',
    location: 'LONDON',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'
  },
  {
    stars: 4,
    title: 'WORTH THE LIMITED RUN',
    text: 'The Ragnarok hoodie is the best fleece I\'ve bought this year. Only wish more colours dropped at once.',
    name: 'MARCUS V.',
    location: 'MELBOURNE',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
  }
];

const ReviewCard: React.FC<{ review: ReviewData }> = ({ review }) => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'var(--bg-card)', 
        p: { xs: 3, sm: 4 }, 
        borderRadius: 3, 
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'var(--border-gold)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2), 0 0 20px rgba(212,175,55,0.1)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      {/* Stars */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            color={i < review.stars ? '#D4AF37' : '#94a3b8'}
            fill={i < review.stars ? '#D4AF37' : 'none'}
          />
        ))}
      </Box>
      
      {/* Title */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontSize: '1rem',
          letterSpacing: '0.1em',
          mb: 1.5,
          color: 'var(--text-primary)',
        }}
      >
        {review.title}
      </Typography>
      
      {/* Text */}
      <Typography 
        sx={{ 
          fontSize: '0.8125rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          mb: 3,
          flexGrow: 1
        }}
      >
        "{review.text}"
      </Typography>

      {/* Actual Customer Photo */}
      <Box 
        sx={{ 
          position: 'relative',
          aspectRatio: '16/9', 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 3,
          border: '1px solid var(--border-subtle)',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
          }
        }}
      >
        <Box 
          component="img" 
          src={review.image} 
          alt={review.name}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            bgcolor: 'rgba(0,0,0,0.6)', 
            px: 1, 
            py: 0.5, 
            borderRadius: 1, 
            backdropFilter: 'blur(4px)',
            zIndex: 2 
          }}
        >
          <Typography sx={{ color: 'var(--text-primary)', fontSize: '0.55rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            VERIFIED BUYER
          </Typography>
        </Box>
      </Box>
      
      {/* Attribution */}
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold', 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase',
          fontSize: '0.6875rem' 
        }}
      >
        {review.name} · <Box component="span" sx={{ color: 'var(--text-secondary)' }}>{review.location}</Box>
      </Typography>
    </Box>
  );
};

export const ReviewsSection: React.FC = () => {
  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, sm: 12, lg: 16 }, 
          bgcolor: 'var(--bg-main)', 
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          
          {/* Section Header */}
          <Box sx={{ mb: { xs: 6, sm: 8 }, px: { xs: 1, sm: 2 } }}>
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
              REAL REVIEWS
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }, 
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: 'var(--text-primary)'
              }}
            >
              WHAT THEY SAY
            </Typography>
          </Box>

          {/* Reviews Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {reviews.map((review, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <ReviewCard review={review} />
              </Grid>
            ))}
          </Grid>
          
        </Container>
      </Box>
    </>
  );
};
