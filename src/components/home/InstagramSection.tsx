import React from 'react';
import { 
  Box, Typography, Container, Grid, Button
} from '@mui/material';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

interface SocialChannel {
  id: string;
  platform: string;
  handle: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  accentColor: string;
  actionText: string;
  icon: React.ReactNode;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@valknutofficial1',
    title: 'LOOKBOOK & DROPS',
    subtitle: 'Daily runway fits, drop countdowns & community styling tags.',
    link: 'https://instagram.com/valknutofficial1',
    image: '/social/instagram.jpg',
    accentColor: '#E1306C',
    actionText: 'Follow on Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'tiktok',
    platform: 'TikTok',
    handle: '@valknutofficial5',
    title: 'STREET RUNWAYS',
    subtitle: 'High-contrast fit checks, studio reels & movement culture.',
    link: 'https://tiktok.com/@valknutofficial5',
    image: '/social/tiktok.jpg',
    accentColor: '#00F2FE',
    actionText: 'Watch on TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.18 8.18 0 004.76 1.52V7.05a4.82 4.82 0 01-1-.36z" />
      </svg>
    )
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    handle: 'VALKNUT Official',
    title: 'VIP ARCHIVE & CLUB',
    subtitle: 'Editorial launches, brand lore & insider release discussions.',
    link: 'https://www.facebook.com/profile.php?id=61590816716304',
    image: '/social/facebook.jpg',
    accentColor: '#1877F2',
    actionText: 'Join on Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    handle: '+94 76 112 5786',
    title: 'VIP CONCIERGE',
    subtitle: '1-on-1 sizing consultations, custom orders & bespoke studio support.',
    link: 'https://wa.me/94761125786?text=Hello%20VALKNUT%20Official%2C%20I%20would%20like%20to%20inquire%20about%20a%20piece.',
    image: '/social/whatsapp.jpg',
    accentColor: '#25D366',
    actionText: 'Chat on WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )
  }
];

export const InstagramSection: React.FC = () => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 6, sm: 8, lg: 10 }, 
        bgcolor: 'var(--bg-main)', 
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Subtle radial luxury glow */}
      <Box 
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 1.8,
              py: 0.5,
              mb: 2,
              borderRadius: '999px',
              border: '1px solid rgba(212,175,55,0.3)',
              bgcolor: 'rgba(212,175,55,0.05)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Box 
              sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                bgcolor: 'primary.main',
                boxShadow: '0 0 10px #D4AF37'
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 700, 
                letterSpacing: '0.25em', 
                fontSize: '0.7rem',
                textTransform: 'uppercase'
              }}
            >
              COMMUNITY & OFFICIAL CHANNELS
            </Typography>
          </Box>

          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.85rem', sm: '2.6rem', md: '3.2rem' }, 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 1.5,
              textTransform: 'uppercase',
              fontFamily: '"Outfit", sans-serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.7)'
            }}
          >
            FOLLOW THE MOVEMENT
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--text-secondary)', 
              maxWidth: '640px', 
              mx: 'auto',
              fontSize: { xs: '0.84rem', sm: '0.92rem' },
              lineHeight: 1.7
            }}
          >
            Connect directly with VALKNUT across our global channels. Explore daily styling lookbooks, participate in limited streetwear drops, and access 1-on-1 bespoke concierge service.
          </Typography>
        </Box>

        {/* 4 Official Social Cards - Compact height */}
        <Grid container spacing={{ xs: 2, sm: 2.5, lg: 3 }}>
          {SOCIAL_CHANNELS.map((channel) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={channel.id}>
              <Box
                component="a"
                href={channel.link}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: { xs: 330, sm: 350, md: 370 },
                  position: 'relative',
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  bgcolor: '#0E1017',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: 'rgba(212,175,55,0.6)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.22)',
                    '& .card-bg-img': {
                      transform: 'scale(1.06)',
                      filter: 'brightness(0.95)'
                    },
                    '& .card-cta-btn': {
                      bgcolor: 'primary.main',
                      color: '#0B0C10',
                      boxShadow: '0 4px 16px rgba(212,175,55,0.4)',
                      borderColor: 'primary.main'
                    },
                    '& .arrow-icon': {
                      transform: 'translate(3px, -3px)'
                    }
                  }
                }}
              >
                {/* Background Brand Image */}
                <Box
                  component="img"
                  className="card-bg-img"
                  src={channel.image}
                  alt={`${channel.platform} - ${channel.handle}`}
                  loading="lazy"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.7) contrast(1.05)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0
                  }}
                />

                {/* Luxury Dark Vignette Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(11,12,16,0.65) 0%, rgba(11,12,16,0.2) 35%, rgba(11,12,16,0.88) 75%, rgba(11,12,16,0.98) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />

                {/* Card Top: Platform Pill Badge */}
                <Box 
                  sx={{ 
                    position: 'relative', 
                    zIndex: 2, 
                    p: { xs: 2, sm: 2.2 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: '999px',
                      bgcolor: 'rgba(11,12,16,0.75)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}
                  >
                    <Box 
                      sx={{ 
                        color: channel.accentColor, 
                        display: 'flex', 
                        alignItems: 'center' 
                      }}
                    >
                      {channel.icon}
                    </Box>
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: '"Outfit", sans-serif'
                      }}
                    >
                      {channel.platform}
                    </Typography>
                  </Box>

                  {/* Corner Visual Indicator */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: 'rgba(212,175,55,0.12)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <ArrowUpRight 
                      size={14} 
                      className="arrow-icon" 
                      style={{ color: '#D4AF37', transition: 'transform 0.3s ease' }} 
                    />
                  </Box>
                </Box>

                {/* Card Bottom: Handle, Subtitle & Interactive CTA */}
                <Box 
                  sx={{ 
                    position: 'relative', 
                    zIndex: 2, 
                    p: { xs: 2, sm: 2.2 }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      fontSize: '0.68rem',
                      display: 'block',
                      mb: 0.3,
                      textTransform: 'uppercase'
                    }}
                  >
                    {channel.title}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: { xs: '1.08rem', sm: '1.18rem' },
                      letterSpacing: '-0.01em',
                      fontFamily: '"Outfit", sans-serif',
                      mb: 0.6
                    }}
                  >
                    {channel.handle}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.76rem',
                      lineHeight: 1.5,
                      mb: 1.8,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {channel.subtitle}
                  </Typography>

                  {/* High-End Action Button */}
                  <Button
                    className="card-cta-btn"
                    fullWidth
                    sx={{
                      py: 0.85,
                      borderRadius: 1.2,
                      border: '1px solid rgba(212,175,55,0.4)',
                      bgcolor: 'rgba(18,20,30,0.85)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontFamily: '"Outfit", sans-serif',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.8
                    }}
                  >
                    {channel.actionText}
                    <ArrowUpRight size={13} />
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Social Quick Links Bar */}
        <Box
          sx={{
            mt: { xs: 4, sm: 5 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: 2,
            bgcolor: 'rgba(18,20,30,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                flexShrink: 0
              }}
            >
              <MessageCircle size={20} />
            </Box>
            <Box>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', letterSpacing: '0.03em' }}>
                DIRECT VIP CONCIERGE & STYLING INQUIRIES (+94 76 112 5786)
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                Need instant size advice, custom garment guidance or order status? Our stylists reply directly on WhatsApp.
              </Typography>
            </Box>
          </Box>

          <Button
            href="https://wa.me/94761125786?text=Hello%20VALKNUT%20Official%2C%20I%20would%20like%20to%20speak%20with%20a%20stylist."
            target="_blank"
            rel="noreferrer"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1.2,
              bgcolor: '#25D366',
              color: '#0B0C10',
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              fontFamily: '"Outfit", sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
              '&:hover': {
                bgcolor: '#20BA5A',
                boxShadow: '0 6px 20px rgba(37,211,102,0.5)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            START WHATSAPP CHAT
          </Button>
        </Box>

      </Container>
    </Box>
  );
};
