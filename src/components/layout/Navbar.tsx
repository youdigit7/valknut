import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { CategoryType } from '../../types/ecommerce';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SearchModal } from '../shop/SearchModal';
import {
  createTheme, ThemeProvider, Box, Typography, Container,
  Button, IconButton, Badge, Drawer, Menu as MuiMenu, MenuItem, AppBar, Toolbar
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D4AF37', dark: '#E2B714' },
    background: { default: '#06070a', paper: '#0A0C10' },
    text: { primary: '#ffffff', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 900, textTransform: 'uppercase' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 800, textTransform: 'uppercase' },
    body2: { fontFamily: '"JetBrains Mono", sans-serif' },
    caption: { fontFamily: '"JetBrains Mono", sans-serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'uppercase',
          fontWeight: 700,
        },
      }
    }
  }
});

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    setIsAccountOpen,
    activeCategory,
    setActiveCategory
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('LKR');
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(null);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currencies = ['LKR', 'USD', 'EUR', 'GBP', 'AUD'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrencyAnchorEl(null);
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (hash: string, category?: CategoryType | 'ALL') => {
    if (category) {
      setActiveCategory(category);
    }
    window.location.hash = hash;
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'SHOP', hash: '#/shop', cat: 'ALL' },
    { label: 'COLLECTIONS', hash: '#/shop?collection=DARK+SOVEREIGN+2026', cat: 'ALL' },
    { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
    { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
    { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        elevation={isScrolled ? 8 : 0}
        sx={{
          bgcolor: isScrolled ? 'rgba(6,7,10,0.95)' : 'rgba(6,7,10,0.8)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Top Banner */}
        <Box sx={{ bgcolor: '#020202', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 0.5, px: 2, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 2000, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Box sx={{ w: 6, h: 6, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 'bold', letterSpacing: '0.2em' }}>COLOMBO ARCHIVES</Typography>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.primary', flex: 1, letterSpacing: '0.15em' }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>DROP 04 LIVE</Box>
              <Box component="span" sx={{ mx: 2, color: 'text.secondary' }}>—</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>COMPLIMENTARY SHIPPING OVER LKR 25,000</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>FREE SHIP &gt; LKR 25K</Box>
            </Typography>
            <Typography variant="caption" sx={{ display: { xs: 'none', md: 'inline' }, fontSize: '0.65rem', color: 'text.secondary', fontWeight: 'bold', letterSpacing: '0.2em' }}>
              GLOBAL DISPATCH
            </Typography>
          </Box>
        </Box>

        <Container maxWidth={false} sx={{ maxWidth: 2000 }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 72, lg: 80 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* LEFT: LOGO */}
            <Box
              onClick={() => handleNavigate('#/', 'ALL')}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', flexShrink: 0 }}
            >
              <Box sx={{ width: { xs: 32, lg: 40 }, height: { xs: 32, lg: 40 }, borderRadius: 2, background: 'linear-gradient(135deg, #1e2235, #10121d, #000)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)', transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 0 20px rgba(212,175,55,0.35)' } }}>
                <Typography sx={{ color: 'primary.main', fontFamily: '"Syne", sans-serif', fontWeight: 900, fontSize: { xs: '1rem', lg: '1.2rem' } }}>V</Typography>
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 900, fontSize: { xs: '1rem', lg: '1.25rem' }, letterSpacing: '0.22em', lineHeight: 1 }}>VALKNUT</Typography>
                <Typography sx={{ fontSize: '0.5rem', fontFamily: '"JetBrains Mono", sans-serif', letterSpacing: '0.4em', color: 'text.secondary', mt: 0.5, fontWeight: 'bold' }}>OFFICIAL</Typography>
              </Box>
            </Box>

            {/* CENTER: DESKTOP NAV LINKS */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', bgcolor: 'rgba(10,10,10,0.6)', p: 0.5, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 1px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
              {navLinks.map(item => {
                const isActive = (item.cat === 'ALL' && activeCategory === 'ALL' && window.location.hash.startsWith('#/shop') && !window.location.hash.includes('/men') && !window.location.hash.includes('/women') && !window.location.hash.includes('/essentials')) ||
                  (item.cat !== 'ALL' && (activeCategory === item.cat || window.location.hash.includes(item.cat.toLowerCase())));
                return (
                  <Button
                    key={item.label}
                    onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')}
                    sx={{
                      px: { lg: 2, xl: 3 }, py: 1, fontSize: '0.7rem', letterSpacing: '0.15em',
                      color: isActive ? '#000' : 'text.secondary',
                      background: isActive ? 'linear-gradient(90deg, #D4AF37, #f3e5ab)' : 'transparent',
                      boxShadow: isActive ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                      '&:hover': {
                        color: isActive ? '#000' : 'white',
                        bgcolor: isActive ? 'transparent' : 'rgba(255,255,255,0.08)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Box sx={{ width: '1px', height: 16, bgcolor: 'rgba(255,255,255,0.1)', mx: 1 }} />
              <Button
                onClick={() => handleNavigate('#/custom-studio')}
                sx={{
                  px: { lg: 2, xl: 3 }, py: 1, fontSize: '0.7rem', letterSpacing: '0.15em',
                  color: 'primary.main', bgcolor: 'black',
                  border: '1px solid rgba(212,175,55,0.3)',
                  boxShadow: '0 0 15px rgba(212,175,55,0.15)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 25px rgba(212,175,55,0.4)',
                    color: '#f3e5ab'
                  }
                }}
                startIcon={<Sparkles size={12} />}
              >
                STUDIO
              </Button>
            </Box>

            {/* RIGHT: DESKTOP ACTIONS */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Button
                onClick={(e) => setCurrencyAnchorEl(e.currentTarget)}
                sx={{ minWidth: 0, px: 2, py: 1, fontSize: '0.65rem', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { color: 'white', borderColor: 'primary.main' } }}
                endIcon={<ChevronDown size={12} />}
              >
                {selectedCurrency}
              </Button>
              <MuiMenu
                anchorEl={currencyAnchorEl}
                open={Boolean(currencyAnchorEl)}
                onClose={() => setCurrencyAnchorEl(null)}
                slotProps={{ paper: { sx: { bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', mt: 1, boxShadow: '0 20px 50px rgba(0,0,0,0.9)' } } }}
              >
                {currencies.map(c => (
                  <MenuItem
                    key={c}
                    onClick={() => { setSelectedCurrency(c); setCurrencyAnchorEl(null); }}
                    sx={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: c === selectedCurrency ? 'primary.main' : 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                  >
                    {c}
                  </MenuItem>
                ))}
              </MuiMenu>

              <Button
                onClick={() => setIsSearchOpen(true)}
                sx={{ minWidth: 0, px: 2, py: 1, fontSize: '0.7rem', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { color: 'white', borderColor: 'primary.main' }, display: 'flex', gap: 1 }}
              >
                <Search size={14} color="#D4AF37" /> Search...
                <Box component="span" sx={{ ml: 1, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.4)', px: 1, borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>⌘K</Box>
              </Button>

              <IconButton onClick={() => setIsAccountOpen(true)} sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <User size={18} />
              </IconButton>
              <IconButton onClick={() => handleNavigate('#/lookbook')} sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <Heart size={18} />
              </IconButton>
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'text.secondary', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                <Badge badgeContent={cartItemsCount} color="primary" sx={{ '& .MuiBadge-badge': { color: 'black', fontWeight: 'bold' } }}>
                  <ShoppingBag size={18} />
                </Badge>
              </IconButton>
            </Box>

            {/* MOBILE / TABLET RIGHT ACTIONS */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setIsSearchOpen(true)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Search size={16} />
              </IconButton>
              <IconButton onClick={() => setIsAccountOpen(true)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <User size={16} />
              </IconButton>
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Badge badgeContent={cartItemsCount} color="primary" sx={{ '& .MuiBadge-badge': { color: 'black', fontWeight: 'bold' } }}>
                  <ShoppingBag size={16} />
                </Badge>
              </IconButton>
              <IconButton onClick={() => setIsMobileMenuOpen(true)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Menu size={16} />
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        slotProps={{ paper: { sx: { width: '85%', maxWidth: 320, bgcolor: 'background.default', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' } } }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #1e2235, #10121d, #000)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'primary.main', fontFamily: '"Syne", sans-serif', fontWeight: 900, fontSize: '1rem' }}>V</Typography>
            </Box>
            <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.2em' }}>VALKNUT</Typography>
          </Box>
          <IconButton onClick={() => setIsMobileMenuOpen(false)} sx={{ color: 'text.secondary', border: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.03)' }}>
            <X size={16} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#10121d', p: 1.5, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Search size={16} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Search collections...</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 2 }}>COLLECTIONS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'SHOP ALL', hash: '#/shop', cat: 'ALL' },
                { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
                { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
                { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
              ].map(item => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')}
                  endIcon={<ChevronRight size={14} />}
                  sx={{ justifyContent: 'space-between', color: 'text.secondary', py: 1.5, px: 2, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={() => handleNavigate('#/custom-studio')}
                endIcon={<ChevronRight size={14} />}
                sx={{ justifyContent: 'space-between', color: '#000', bgcolor: 'primary.main', background: 'linear-gradient(90deg, #D4AF37, #f3e5ab)', py: 1.5, px: 2, borderRadius: 2, mt: 1, '&:hover': { color: '#000', filter: 'brightness(1.1)' } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Sparkles size={14} /> CUSTOM STUDIO</Box>
              </Button>
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', pt: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 2 }}>DISCOVER</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['OUR STORY', 'LOOKBOOK', 'SIZE GUIDE', 'TRACK ORDER'].map((label, idx) => (
                <Button key={idx} onClick={() => { setIsMobileMenuOpen(false); window.location.hash = `#/${label.toLowerCase().replace(' ', '-')}` }} sx={{ justifyContent: 'flex-start', color: 'text.secondary', py: 1.5, px: 2, '&:hover': { color: 'white' } }}>
                  {label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToShop={(term) => {
          window.location.hash = `#/shop?q=${encodeURIComponent(term)}`;
        }}
      />
    </ThemeProvider>
  );
};
