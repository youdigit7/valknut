import React from 'react';
import { Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { 
  createTheme, ThemeProvider, Box, Typography, Container, Grid 
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#0E1017' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    caption: { fontFamily: '"JetBrains Mono", sans-serif' },
  }
});

const TRUST_ITEMS = [
  {
    icon: <Truck size={22} color="#D4AF37" />,
    title: 'ISLANDWIDE DELIVERY',
    subtitle: '1-3 Days Across Sri Lanka'
  },
  {
    icon: <CreditCard size={22} color="#D4AF37" />,
    title: 'KOKO & MINTPAY',
    subtitle: '3 Interest-Free Instalments'
  },
  {
    icon: <RotateCcw size={22} color="#D4AF37" />,
    title: 'EASY SIZE EXCHANGES',
    subtitle: 'Hassle-Free Fit Guarantee'
  },
  {
    icon: <Shield size={22} color="#D4AF37" />,
    title: '100% AUTHENTIC',
    subtitle: 'Engineered in Colombo'
  }
];

export const TrustBar: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 5, sm: 8, lg: 10 }, 
          bgcolor: 'background.default', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
            
            {TRUST_ITEMS.map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 2, sm: 2.5 }, 
                    p: { xs: 2, sm: 3 }, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(18,20,30,0.5)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    height: '100%',
                    '&:hover': {
                      bgcolor: 'rgba(18,20,30,0.8)',
                      borderColor: 'rgba(212,175,55,0.3)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(212,175,55,0.1)',
                      transform: 'translateY(-4px)',
                      '& .icon-box': {
                        bgcolor: 'rgba(212,175,55,0.15)',
                        borderColor: 'rgba(212,175,55,0.5)',
                        boxShadow: '0 0 15px rgba(212,175,55,0.2)',
                        transform: 'scale(1.05)'
                      }
                    }
                  }}
                >
                  <Box 
                    className="icon-box"
                    sx={{ 
                      width: { xs: 48, sm: 56 }, 
                      height: { xs: 48, sm: 56 }, 
                      borderRadius: 2, 
                      bgcolor: '#12141E', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' }, 
                        fontWeight: 900, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        color: 'white', 
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: { xs: '0.6875rem', sm: '0.75rem' }, 
                        color: 'text.secondary', 
                        display: 'block',
                        lineHeight: 1.4
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
