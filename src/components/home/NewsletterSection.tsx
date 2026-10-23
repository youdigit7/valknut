import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { 
  Box, Typography, Container, Button, TextField, CircularProgress
} from '@mui/material';
import { subscribeToClub } from '../../services/newsletterService';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState('YOUR EMAIL IS RESERVED ON THE VIP DROP LIST');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsLoading(true);
      try {
        const res = await subscribeToClub(email, 'homepage');
        if (res.success) {
          setSubscribed(true);
          setFeedbackText(
            res.alreadySubscribed
              ? 'YOU ARE ALREADY ON THE VIP DROP LIST'
              : 'YOUR EMAIL IS RESERVED ON THE VIP DROP LIST'
          );
          setEmail('');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 10, sm: 14, lg: 16 }, 
          background: 'linear-gradient(to bottom, var(--bg-surface), var(--bg-main))', 
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
            
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold', 
                  letterSpacing: '0.3em', 
                  display: 'block', 
                  mb: 2 
                }}
              >
                THE INNER CIRCLE
              </Typography>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, 
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  mb: 3,
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              >
                BE FIRST WHEN LIMITED DROPS GO LIVE.
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'var(--text-secondary)', 
                  maxWidth: '650px', 
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Numbered garments sell out in hours. Receive private 24-hour early access codes, member-only editorial previews, and exclusive sizing reservations.
              </Typography>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              {subscribed ? (
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    px: { xs: 3, sm: 4 }, 
                    py: 2.5, 
                    bgcolor: 'rgba(212,175,55,0.1)', 
                    border: '1px solid rgba(212,175,55,0.4)', 
                    borderRadius: 2,
                    boxShadow: '0 10px 25px rgba(212,175,55,0.15)',
                    backdropFilter: 'blur(10px)',
                    animation: 'fadeIn 0.5s ease-out'
                  }}
                >
                  <Check size={20} color="#D4AF37" />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }}
                  >
                    {feedbackText}
                  </Typography>
                </Box>
              ) : (
                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 1.5, 
                    maxWidth: '600px', 
                    mx: 'auto',
                    width: '100%',
                    alignItems: 'center'
                  }}
                >
                  <TextField 
                    fullWidth
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                    required
                    sx={{
                      flexGrow: 1,
                      width: { xs: '100%', sm: 'auto' },
                      '& .MuiOutlinedInput-root': {
                        height: '54px',
                        borderRadius: '8px',
                        bgcolor: 'var(--bg-card)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        fontFamily: '"Inter", sans-serif',
                        letterSpacing: '0.04em',
                        border: '1px solid var(--border-subtle)',
                        '& fieldset': { border: 'none' },
                        '&:hover': { borderColor: 'var(--border-strong)' },
                        '&.Mui-focused': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        height: '100%',
                        boxSizing: 'border-box',
                        py: 0
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      minWidth: { xs: '100%', sm: '180px' },
                      height: '54px',
                      background: 'linear-gradient(90deg, #e6c042, #D4AF37, #aa8010)',
                      color: 'black',
                      fontWeight: 900,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      letterSpacing: '0.18em',
                      borderRadius: '8px',
                      boxShadow: '0 12px 30px rgba(212,175,55,0.4), inset 0 1px 1px rgba(255,255,255,0.7)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 16px 35px rgba(212,175,55,0.6), inset 0 1px 1px rgba(255,255,255,0.7)',
                      },
                      '&:disabled': {
                        background: '#333',
                        color: '#666',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} sx={{ color: 'black' }} /> : (
                      <>JOIN CLUB <Box component="span" sx={{ ml: 1.5, display: 'flex' }}><ArrowRight size={17} /></Box></>
                    )}
                  </Button>
                </Box>
              )}
            </Box>

            <Typography 
              variant="caption" 
              sx={{ 
                color: 'var(--text-secondary)', 
                fontSize: { xs: '0.625rem', sm: '0.6875rem' }, 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase' 
              }}
            >
              No spam. No promotional noise. Unsubscribe at any time.
            </Typography>

          </Box>
        </Container>
      </Box>
    </>
  );
};
