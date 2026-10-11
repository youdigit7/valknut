import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAppTheme } from '../../context/ThemeContext';
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
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { SearchModal } from '../shop/SearchModal';
import {
  Box, Typography, Container,
  Button, IconButton, Badge, Drawer, Menu as MuiMenu, MenuItem, AppBar, Toolbar, Divider
} from '@mui/material';
import darkLogo from '../../assets/logos/symbol-dark.png';
import lightLogo from '../../assets/logos/symbol-light.png';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    setIsAccountOpen,
    setIsAdminOpen,
    activeCategory,
    setActiveCategory,
    user,
    logoutUser
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('LKR');
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme } = useAppTheme();

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
    { label: 'HOME', hash: '#/', cat: 'ALL' },
    { label: 'SHOP', hash: '#/shop', cat: 'ALL' },
    { label: 'COLLECTIONS', hash: '#/shop?collection=DARK+SOVEREIGN+2026', cat: 'ALL' },
    { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
    { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
    { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={isScrolled ? 8 : 0}
        sx={{
          top: 0,
          bgcolor: isScrolled ? (mode === 'dark' ? 'rgba(6,7,10,0.95)' : 'rgba(255,255,255,0.95)') : (mode === 'dark' ? 'rgba(6,7,10,0.8)' : 'rgba(255,255,255,0.8)'),
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          zIndex: 1100
        }}
      >
        {/* Top Banner */}
        <Box sx={{ bgcolor: mode === 'dark' ? '#020202' : '#f1f5f9', borderBottom: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', py: 0.5, px: 2, textAlign: 'center' }}>
          <Box sx={{ maxWidth: 2000, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Box sx={{ w: 6, h: 6, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.2em' }}>COLOMBO ARCHIVES</Typography>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--text-primary)', flex: 1, letterSpacing: '0.15em' }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>DROP 04 LIVE</Box>
              <Box component="span" sx={{ mx: 2, color: 'var(--text-secondary)' }}>—</Box>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>COMPLIMENTARY SHIPPING OVER LKR 25,000</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>FREE SHIP &gt; LKR 25K</Box>
            </Typography>
            <Typography variant="caption" sx={{ display: { xs: 'none', md: 'inline' }, fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.2em' }}>
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
              <Box 
                component="img"
                src={mode === 'dark' ? darkLogo : lightLogo}
                alt="Valknut Logo"
                sx={{ 
                  width: { xs: 34, lg: 40 }, 
                  height: { xs: 34, lg: 40 }, 
                  objectFit: 'contain',
                  filter: mode === 'dark' ? 'drop-shadow(0 2px 8px rgba(212,175,55,0.35))' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.06)', filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.6))' } 
                }} 
              />
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '1.1rem', lg: '1.35rem' }, letterSpacing: '0.2em', lineHeight: 1, color: mode === 'dark' ? 'white' : 'black' }}>VALKNUT</Typography>
                <Typography sx={{ fontSize: '0.5rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.4em', color: 'var(--text-secondary)', mt: 0.5, fontWeight: 'bold' }}>OFFICIAL</Typography>
              </Box>
            </Box>

            {/* CENTER: DESKTOP NAV LINKS */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              bgcolor: mode === 'dark' ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.7)', 
              p: 0.5, 
              borderRadius: 10, 
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', 
              boxShadow: mode === 'dark' ? 'inset 0 1px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.06)', 
              backdropFilter: 'blur(10px)' 
            }}>
              {navLinks.map(item => {
                let isActive = false;
                if (item.label === 'HOME') {
                  isActive = window.location.hash === '#/' || window.location.hash === '';
                } else if (item.label === 'SHOP') {
                  isActive = activeCategory === 'ALL' && window.location.hash.startsWith('#/shop') && !window.location.hash.includes('collection=') && !window.location.hash.includes('/men') && !window.location.hash.includes('/women') && !window.location.hash.includes('/essentials');
                } else if (item.label === 'COLLECTIONS') {
                  isActive = window.location.hash.includes('collection=');
                } else {
                  isActive = activeCategory === item.cat || window.location.hash.includes('/' + item.cat.toLowerCase());
                }

                return (
                  <Button
                    key={item.label}
                    onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')}
                    sx={{
                      px: { lg: 2, xl: 3 }, py: 1, fontSize: '0.7rem', letterSpacing: '0.15em',
                      color: isActive ? '#000' : 'text.secondary',
                      background: isActive ? 'linear-gradient(90deg, #D4AF37, #f3e5ab)' : 'transparent',
                      boxShadow: isActive ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                      borderRadius: '40px',
                      '&:hover': {
                        color: isActive ? '#000' : (mode === 'dark' ? 'white' : 'black'),
                        bgcolor: isActive ? 'transparent' : (mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Box sx={{ width: '1px', height: 16, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mx: 1 }} />
              <Button
                onClick={() => handleNavigate('#/custom-studio')}
                sx={{
                  px: { lg: 2, xl: 3 }, py: 1, fontSize: '0.7rem', letterSpacing: '0.15em',
                  color: 'primary.main', bgcolor: mode === 'dark' ? 'black' : 'white',
                  border: '1px solid rgba(212,175,55,0.3)',
                  boxShadow: '0 0 15px rgba(212,175,55,0.15)',
                  borderRadius: '40px',
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
                sx={{ 
                  minWidth: 0, px: 2, py: 1, fontSize: '0.65rem', 
                  color: 'var(--text-secondary)', 
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
                  '&:hover': { color: 'var(--text-primary)', borderColor: 'primary.main' } 
                }}
                endIcon={<ChevronDown size={12} />}
              >
                {selectedCurrency}
              </Button>
              <MuiMenu
                anchorEl={currencyAnchorEl}
                open={Boolean(currencyAnchorEl)}
                onClose={() => setCurrencyAnchorEl(null)}
                slotProps={{ paper: { sx: { bgcolor: 'var(--bg-surface)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mt: 1, boxShadow: mode === 'dark' ? '0 20px 50px rgba(0,0,0,0.9)' : '0 10px 30px rgba(0,0,0,0.1)' } } }}
              >
                {currencies.map(c => (
                  <MenuItem
                    key={c}
                    onClick={() => { setSelectedCurrency(c); setCurrencyAnchorEl(null); }}
                    sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: c === selectedCurrency ? 'primary.main' : 'text.secondary', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}
                  >
                    {c}
                  </MenuItem>
                ))}
              </MuiMenu>

              <Button
                onClick={() => setIsSearchOpen(true)}
                sx={{ 
                  minWidth: 0, px: 2, py: 1, fontSize: '0.7rem', 
                  color: 'var(--text-secondary)', 
                  border: '1px solid',
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
                  '&:hover': { color: mode === 'dark' ? 'white' : 'black', borderColor: 'primary.main' }, 
                  display: 'flex', gap: 1 
                }}
              >
                <Search size={14} color="#D4AF37" /> Search...
                <Box component="span" sx={{ ml: 1, fontSize: '0.6rem', bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)', px: 1, borderRadius: 1, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }}>⌘K</Box>
              </Button>

              <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-secondary)', '&:hover': { color: mode === 'dark' ? 'white' : 'black', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
              <IconButton 
                onClick={(e) => setUserAnchorEl(e.currentTarget)} 
                sx={{ 
                  color: user ? '#D4AF37' : 'var(--text-secondary)', 
                  '&:hover': { color: mode === 'dark' ? 'white' : 'black', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } 
                }}
                aria-label="Account and admin menu"
              >
                <User size={18} />
              </IconButton>
              <MuiMenu
                anchorEl={userAnchorEl}
                open={Boolean(userAnchorEl)}
                onClose={() => setUserAnchorEl(null)}
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      mt: 1.5,
                      minWidth: 230,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                      p: 1
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid var(--border-subtle)' }}>
                  <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase' }}>
                    {user ? (user.isAdmin ? 'EXECUTIVE ACCESS' : 'VALKNUT VIP') : 'SOVEREIGN PORTAL'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
                    {user ? user.name : 'Guest Customer'}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={() => {
                    setUserAnchorEl(null);
                    setIsAccountOpen(true);
                  }}
                  sx={{
                    fontSize: '0.75rem',
                    fontFamily: '"Inter", sans-serif',
                    color: 'var(--text-primary)',
                    py: 1.25,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': { bgcolor: 'var(--border-subtle)' }
                  }}
                >
                  <User size={15} color="#D4AF37" />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Customer Portal</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Orders, address & profile</Typography>
                  </Box>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setUserAnchorEl(null);
                    handleNavigate('#/admin');
                    setIsAdminOpen(true);
                  }}
                  sx={{
                    fontSize: '0.75rem',
                    fontFamily: '"Inter", sans-serif',
                    color: '#D4AF37',
                    py: 1.25,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'rgba(212,175,55,0.05)',
                    borderRadius: 1,
                    my: 0.5,
                    '&:hover': { bgcolor: 'rgba(212,175,55,0.15)' }
                  }}
                >
                  <ShieldCheck size={15} color="#D4AF37" />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>Open Admin</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Products, orders & studio</Typography>
                  </Box>
                </MenuItem>

                {user && (
                  <>
                    <Divider sx={{ my: 0.5, borderColor: 'var(--border-subtle)' }} />
                    <MenuItem
                      onClick={() => {
                        setUserAnchorEl(null);
                        logoutUser();
                      }}
                      sx={{
                        fontSize: '0.75rem',
                        fontFamily: '"Inter", sans-serif',
                        color: '#f87171',
                        py: 1,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' }
                      }}
                    >
                      <LogOut size={15} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Sign Out</Typography>
                    </MenuItem>
                  </>
                )}
              </MuiMenu>
              <IconButton onClick={() => handleNavigate('#/lookbook')} sx={{ color: 'var(--text-secondary)', '&:hover': { color: mode === 'dark' ? 'white' : 'black', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                <Heart size={18} />
              </IconButton>
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'var(--text-secondary)', '&:hover': { color: mode === 'dark' ? 'white' : 'black', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                <Badge badgeContent={cartItemsCount} color="primary" sx={{ '& .MuiBadge-badge': { color: 'black', fontWeight: 'bold' } }}>
                  <ShoppingBag size={18} />
                </Badge>
              </IconButton>
            </Box>

            {/* MOBILE / TABLET RIGHT ACTIONS */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-secondary)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </IconButton>
              <IconButton onClick={() => setIsSearchOpen(true)} sx={{ color: 'var(--text-secondary)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                <Search size={16} />
              </IconButton>
              <IconButton onClick={(e) => setUserAnchorEl(e.currentTarget)} sx={{ color: user ? '#D4AF37' : 'var(--text-secondary)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                <User size={16} />
              </IconButton>
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'var(--text-secondary)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                <Badge badgeContent={cartItemsCount} color="primary" sx={{ '& .MuiBadge-badge': { color: 'black', fontWeight: 'bold' } }}>
                  <ShoppingBag size={16} />
                </Badge>
              </IconButton>
              <IconButton onClick={() => setIsMobileMenuOpen(true)} sx={{ color: 'var(--text-secondary)', border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
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
        slotProps={{ paper: { sx: { width: '85%', maxWidth: 320, bgcolor: 'var(--bg-main)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' } } }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: mode === 'dark' ? 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.02), transparent)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              component="img"
              src={mode === 'dark' ? darkLogo : lightLogo}
              alt="Valknut Logo"
              sx={{ width: 32, height: 32, objectFit: 'contain' }} 
            />
            <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.2em' }}>VALKNUT</Typography>
          </Box>
          <IconButton onClick={() => setIsMobileMenuOpen(false)} sx={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(255,255,255,0.03)' }}>
            <X size={16} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'var(--bg-surface)', p: 1.5, borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Search size={16} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>Search collections...</Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 2 }}>COLLECTIONS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'HOME', hash: '#/', cat: 'ALL' },
                { label: 'SHOP ALL', hash: '#/shop', cat: 'ALL' },
                { label: 'MEN', hash: '#/shop/men', cat: 'MEN' },
                { label: 'WOMEN', hash: '#/shop/women', cat: 'WOMEN' },
                { label: 'ESSENTIALS', hash: '#/shop/essentials', cat: 'ESSENTIALS' },
              ].map(item => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigate(item.hash, item.cat as CategoryType | 'ALL')}
                  endIcon={<ChevronRight size={14} />}
                  sx={{ justifyContent: 'space-between', color: 'var(--text-secondary)', py: 1.5, px: 2, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' } }}
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
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 2 }}>DISCOVER</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['OUR STORY', 'LOOKBOOK', 'SIZE GUIDE', 'TRACK ORDER'].map((label, idx) => (
                <Button key={idx} onClick={() => { setIsMobileMenuOpen(false); window.location.hash = `#/${label.toLowerCase().replace(' ', '-')}` }} sx={{ justifyContent: 'flex-start', color: 'var(--text-secondary)', py: 1.5, px: 2, '&:hover': { color: 'var(--text-primary)' } }}>
                  {label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', pt: 3 }}>
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 'bold', letterSpacing: '0.25em', display: 'block', mb: 2 }}>PORTAL ACCESS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                onClick={() => { setIsMobileMenuOpen(false); setIsAccountOpen(true); }}
                startIcon={<User size={15} color="#D4AF37" />}
                sx={{ justifyContent: 'flex-start', color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', py: 1.5, px: 2, borderRadius: 2 }}
              >
                CUSTOMER PORTAL {user ? `(${user.name})` : '(SIGN IN)'}
              </Button>
              <Button 
                onClick={() => { setIsMobileMenuOpen(false); handleNavigate('#/admin'); setIsAdminOpen(true); }}
                startIcon={<ShieldCheck size={15} color="#D4AF37" />}
                sx={{ justifyContent: 'flex-start', color: '#D4AF37', bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', py: 1.5, px: 2, borderRadius: 2 }}
              >
                OPEN ADMIN PORTAL
              </Button>
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
    </>
  );
};
