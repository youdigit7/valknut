import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus, ShippingAddress } from '../../types/ecommerce';
import { loginCustomer, registerCustomer, updateCustomerProfile } from '../../services/authService';
import { 
  X, 
  User, 
  Package, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { 
  Modal, 
  Backdrop, 
  Fade, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  TextField, 
  CircularProgress,
  InputAdornment,
  Alert
} from '@mui/material';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    setIsAccountOpen, 
    user, 
    setUserProfile,
    logoutUser, 
    orders, 
    setIsAdminOpen,
    showToast
  } = useStore();

  // Tab when not logged in
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Common auth state
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Active tab when logged in
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PROFILE' | 'ADDRESS'>('ORDERS');

  // Address edit state
  const [addressLine1, setAddressLine1] = useState(user?.address?.addressLine1 || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [district, setDistrict] = useState(user?.address?.district || 'Colombo');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  if (!isAccountOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginCustomer(loginEmail, loginPassword);
      if (res.success && res.user) {
        setUserProfile(res.user);
        showToast(res.message || `Welcome back, ${res.user.name}.`, 'success');
        setLoginPassword('');
      } else {
        setAuthError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regName.trim()) {
      setAuthError('Full name is required.');
      return;
    }
    if (!regEmail.trim()) {
      setAuthError('Valid email address is required.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await registerCustomer(
        regEmail, 
        regPassword, 
        regName, 
        regPhone || '+94 77 123 4567'
      );

      if (res.success && res.user) {
        setUserProfile(res.user);
        showToast('Account registered successfully! Welcome to VALKNUT.', 'success');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setAuthError(res.message || 'Registration could not be completed.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSavingAddress(true);
      const newAddress: ShippingAddress = {
        fullName: user.name,
        email: user.email,
        phone: user.phone || '+94 77 123 4567',
        addressLine1,
        city,
        district,
        postalCode
      };

      const updated = await updateCustomerProfile(user.id, { address: newAddress });
      if (updated) {
        setUserProfile(updated);
        showToast('Delivery address saved to your profile.', 'success');
      }
    } catch {
      showToast('Failed to save address.', 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const userOrders = user 
    ? orders.filter(o => o.customerInfo.email.toLowerCase() === user.email.toLowerCase() || user.isAdmin)
    : orders;

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Payment Pending': return 1;
      case 'Payment Confirmed':
      case 'Processing': return 2;
      case 'Packed': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-primary)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      bgcolor: '#141620',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    },
    '& .MuiInputLabel-root': { color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
  };

  return (
    <Modal
      open={isAccountOpen}
      onClose={() => setIsAccountOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }
        }
      }}
    >
      <Fade in={isAccountOpen}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 740, maxHeight: '92vh', bgcolor: 'var(--bg-surface)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 2, boxShadow: '0 25px 60px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', outline: 'none', overflow: 'hidden' }}>
          
          {/* Header */}
          <Box sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: '#08090d', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User color="#d4af37" size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: '"Outfit", sans-serif' }}>
                  VALKNUT CUSTOMER PORTAL
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>
                  {user ? `Logged in as ${user.name} (${user.email})` : 'Sign in to access order history & saved delivery address'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsAccountOpen(false)} sx={{ color: 'var(--text-secondary)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <X size={18} />
            </IconButton>
          </Box>

          {/* Modal Body */}
          {!user ? (
            /* AUTH GATE: SIGN IN & REGISTER TABS */
            <Box sx={{ p: { xs: 3, sm: 4 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Tab Selector */}
              <Box sx={{ display: 'flex', bgcolor: '#141620', p: 0.5, borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 360, mx: 'auto', width: '100%' }}>
                <Button
                  fullWidth
                  onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                  sx={{
                    py: 1,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    borderRadius: 1,
                    bgcolor: authMode === 'LOGIN' ? '#D4AF37' : 'transparent',
                    color: authMode === 'LOGIN' ? 'black' : 'var(--text-secondary)',
                    '&:hover': { bgcolor: authMode === 'LOGIN' ? '#E2B714' : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  SIGN IN
                </Button>
                <Button
                  fullWidth
                  onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
                  sx={{
                    py: 1,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    borderRadius: 1,
                    bgcolor: authMode === 'REGISTER' ? '#D4AF37' : 'transparent',
                    color: authMode === 'REGISTER' ? 'black' : 'var(--text-secondary)',
                    '&:hover': { bgcolor: authMode === 'REGISTER' ? '#E2B714' : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  CREATE ACCOUNT
                </Button>
              </Box>

              {authError && (
                <Alert 
                  severity="error" 
                  sx={{ bgcolor: 'rgba(153,27,27,0.3)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}
                >
                  {authError}
                </Alert>
              )}

              {/* 1. SIGN IN FORM */}
              {authMode === 'LOGIN' && (
                <Box component="form" onSubmit={handleLoginSubmit} sx={{ maxWidth: 420, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField 
                    fullWidth 
                    required 
                    type="email" 
                    label="Email Address" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    placeholder="e.g. kasun@example.com" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} color="#94a3b8" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    required 
                    type={showLoginPassword ? 'text' : 'password'} 
                    label="Password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    placeholder="••••••••••••" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={16} color="#94a3b8" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)} edge="end" sx={{ color: 'grey.500' }}>
                              {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem' }}>
                    <Typography 
                      onClick={() => {
                        setLoginEmail('kasun@example.com');
                        setLoginPassword('password123');
                        showToast('Loaded demo customer credentials (Kasun Perera)', 'info');
                      }}
                      sx={{ color: '#D4AF37', cursor: 'pointer', fontSize: 'inherit', fontFamily: '"Inter", sans-serif', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Use Demo Customer
                    </Typography>
                    <Typography 
                      component="a"
                      href="#/forgot-password"
                      onClick={() => setIsAccountOpen(false)}
                      sx={{ color: 'var(--text-secondary)', fontSize: 'inherit', fontFamily: '"Inter", sans-serif', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' } }}
                    >
                      Forgot password?
                    </Typography>
                  </Box>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    sx={{ 
                      mt: 1, 
                      py: 1.5, 
                      bgcolor: '#D4AF37', 
                      color: 'black', 
                      fontWeight: 900, 
                      fontSize: '0.75rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.15em', 
                      borderRadius: 1, 
                      boxShadow: '0 4px 15px rgba(212,175,55,0.25)', 
                      transition: 'all 0.3s ease', 
                      '&:hover': { bgcolor: '#E2B714', transform: 'translateY(-2px)' } 
                    }}
                  >
                    {isLoading ? <CircularProgress size={18} color="inherit" /> : 'SIGN IN TO ACCOUNT'}
                  </Button>
                </Box>
              )}

              {/* 2. CREATE ACCOUNT FORM */}
              {authMode === 'REGISTER' && (
                <Box component="form" onSubmit={handleRegisterSubmit} sx={{ maxWidth: 420, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField 
                    fullWidth 
                    required 
                    label="Full Name" 
                    value={regName} 
                    onChange={(e) => setRegName(e.target.value)} 
                    placeholder="e.g. Kasun Perera" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={16} color="#94a3b8" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    required 
                    type="email" 
                    label="Email Address" 
                    value={regEmail} 
                    onChange={(e) => setRegEmail(e.target.value)} 
                    placeholder="kasun@example.com" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} color="#94a3b8" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    type="tel" 
                    label="Mobile Phone Number" 
                    value={regPhone} 
                    onChange={(e) => setRegPhone(e.target.value)} 
                    placeholder="+94 77 123 4567" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={16} color="#94a3b8" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    required 
                    type={showRegPassword ? 'text' : 'password'} 
                    label="Create Password (min 6 chars)" 
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    placeholder="••••••••••••" 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={16} color="#94a3b8" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowRegPassword(!showRegPassword)} edge="end" sx={{ color: 'grey.500' }}>
                              {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    required 
                    type={showRegPassword ? 'text' : 'password'} 
                    label="Confirm Password" 
                    value={regConfirmPassword} 
                    onChange={(e) => setRegConfirmPassword(e.target.value)} 
                    placeholder="••••••••••••" 
                    variant="outlined" 
                    sx={textFieldStyles}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    sx={{ 
                      mt: 1, 
                      py: 1.5, 
                      bgcolor: '#D4AF37', 
                      color: 'black', 
                      fontWeight: 900, 
                      fontSize: '0.75rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.15em', 
                      borderRadius: 1, 
                      boxShadow: '0 4px 15px rgba(212,175,55,0.25)', 
                      transition: 'all 0.3s ease', 
                      '&:hover': { bgcolor: '#E2B714', transform: 'translateY(-2px)' } 
                    }}
                  >
                    {isLoading ? <CircularProgress size={18} color="inherit" /> : 'REGISTER VALKNUT ACCOUNT'}
                  </Button>
                </Box>
              )}

              {/* ADMINISTRATIVE ACCESS JUMP */}
              <Box sx={{ mt: 2, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(212,175,55,0.04)', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ShieldCheck size={18} color="#D4AF37" />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
                      STAFF & ADMINISTRATIVE ACCESS
                    </Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>
                      Manage products, categories, orders & bespoke 3D studios
                    </Typography>
                  </Box>
                </Box>

                <Button
                  onClick={() => {
                    setIsAccountOpen(false);
                    window.location.hash = '#/admin';
                    setIsAdminOpen(true);
                  }}
                  endIcon={<ArrowRight size={14} />}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    color: '#D4AF37',
                    border: '1px solid rgba(212,175,55,0.4)',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(212,175,55,0.15)' }
                  }}
                >
                  OPEN ADMIN
                </Button>
              </Box>

            </Box>
          ) : (
            /* LOGGED IN PORTAL */
            <Box sx={{ p: { xs: 2.5, sm: 3.5 }, overflowY: 'auto', maxHeight: 'calc(92vh - 80px)', display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Navigation Tabs */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => setActiveTab('ORDERS')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', ...(activeTab === 'ORDERS' ? { bgcolor: '#D4AF37', color: 'black', '&:hover': { bgcolor: '#E2B714' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }) }}
                  >
                    ORDER HISTORY ({userOrders.length})
                  </Button>
                  <Button
                    onClick={() => setActiveTab('PROFILE')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', ...(activeTab === 'PROFILE' ? { bgcolor: '#D4AF37', color: 'black', '&:hover': { bgcolor: '#E2B714' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }) }}
                  >
                    PROFILE
                  </Button>
                  <Button
                    onClick={() => setActiveTab('ADDRESS')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', ...(activeTab === 'ADDRESS' ? { bgcolor: '#D4AF37', color: 'black', '&:hover': { bgcolor: '#E2B714' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }) }}
                  >
                    SAVED ADDRESS
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.isAdmin && (
                    <Button
                      onClick={() => { 
                        setIsAccountOpen(false); 
                        window.location.hash = '#/admin';
                        setIsAdminOpen(true); 
                      }}
                      startIcon={<ShieldCheck size={14} />}
                      sx={{ px: 1.5, py: 0.75, bgcolor: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37', borderRadius: 1, fontSize: '0.75rem', fontWeight: 800, fontFamily: '"Inter", sans-serif', color: '#D4AF37', '&:hover': { bgcolor: 'rgba(212,175,55,0.25)' } }}
                    >
                      OPEN ADMIN
                    </Button>
                  )}
                  <Button
                    onClick={logoutUser}
                    startIcon={<LogOut size={14} />}
                    sx={{ px: 1.5, py: 0.75, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(153,27,27,0.4)', color: 'error.light' } }}
                  >
                    Sign Out
                  </Button>
                </Box>
              </Box>

              {/* 1. ORDERS TAB */}
              {activeTab === 'ORDERS' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {userOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <Package color="rgba(255,255,255,0.4)" size={32} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>No orders found under your account.</Typography>
                      <Button href="#/shop" onClick={() => setIsAccountOpen(false)} sx={{ mt: 1, color: '#D4AF37', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        Browse Streetwear Catalog →
                      </Button>
                    </Box>
                  ) : (
                    userOrders.map(order => {
                      const stepNum = getStatusStep(order.orderStatus);

                      return (
                        <Box key={order.id} sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          
                          {/* Top Summary Bar */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 900, color: '#D4AF37', fontFamily: '"Inter", sans-serif' }}>{order.orderNumber}</Typography>
                              <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>LKR {order.totalAmount.toLocaleString()}</Typography>
                              <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: '#D4AF37', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>{order.paymentGateway} ({order.paymentStatus})</Typography>
                            </Box>
                          </Box>

                          {/* Order Items Breakdown */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {order.items.map((ci: any, idx: number) => {
                              const img = ci.customization?.finalPreviewDataUrl || ci.imageUrl || ci.product?.images?.[0] || '';
                              const name = ci.productName || ci.product?.name || 'VALKNUT Garment';
                              const size = ci.size || ci.selectedSize || 'M';

                              return (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem' }}>
                                  {img ? (
                                    <Box component="img" src={img} alt={name} sx={{ width: 44, height: 52, objectFit: 'cover', borderRadius: 1, bgcolor: '#08090D', border: '1px solid rgba(255,255,255,0.1)' }} />
                                  ) : (
                                    <Box sx={{ width: 44, height: 52, bgcolor: '#08090D', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', color: '#D4AF37' }}>VK</Box>
                                  )}
                                  <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', fontSize: '0.75rem' }}>{name}</Typography>
                                    <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>Size: {size} | Color: {ci.color || 'Black'} | Qty: {ci.quantity}</Typography>
                                    {ci.customization && (
                                      <Typography sx={{ fontSize: '0.625rem', color: '#D4AF37', fontWeight: 600 }}>
                                        Bespoke: {ci.customization.printTechnique} ({ci.customization.placement})
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography sx={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                                    LKR {((ci.unitPrice || 0) * (ci.quantity || 1)).toLocaleString()}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>

                          {/* Live Tracking Progress Timeline */}
                          <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, fontSize: '0.6875rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: 'inherit' }}>STATUS:</Typography>
                                <Typography sx={{ fontSize: 'inherit', color: '#D4AF37', textTransform: 'uppercase' }}>{order.orderStatus}</Typography>
                              </Box>
                              {order.awbNumber && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.625rem' }}>
                                  <Typography sx={{ fontSize: 'inherit' }}>AWB:</Typography>
                                  <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)' }}>{order.awbNumber}</Typography>
                                  <Typography sx={{ fontSize: 'inherit' }}>({order.courierName})</Typography>
                                </Box>
                              )}
                            </Box>

                            {/* Progress Bar steps */}
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((stName, idx) => {
                                const isCompleted = stepNum >= (idx + 1);
                                return (
                                  <Box sx={{ flex: 1, textAlign: 'center' }} key={stName}>
                                    <Box sx={{ height: 6, borderRadius: 3, mb: 0.5, bgcolor: isCompleted ? '#D4AF37' : 'rgba(255,255,255,0.1)' }} />
                                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Inter", sans-serif', color: isCompleted ? 'white' : 'text.secondary' }}>{stName}</Typography>
                                  </Box>
                                );
                              })}
                            </Box>

                            {/* Tracking Link Button */}
                            {order.trackingLink && (
                              <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button
                                  href={order.trackingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  endIcon={<ExternalLink size={13} />}
                                  sx={{ minWidth: 'auto', p: 0, fontSize: '0.75rem', fontWeight: 'bold', color: '#D4AF37', fontFamily: '"Inter", sans-serif', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
                                >
                                  Track Dispatch with {order.courierName || 'Courier'}
                                </Button>
                              </Box>
                            )}
                          </Box>

                        </Box>
                      );
                    })
                  )}
                </Box>
              )}

              {/* 2. PROFILE TAB */}
              {activeTab === 'PROFILE' && (
                <Box sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5, fontSize: '0.8125rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Member Name:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Email Address:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Mobile Contact:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.phone || 'Not specified'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Account Tier:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase' }}>
                      {user.isAdmin ? 'Executive Administrator' : 'VALKNUT Sovereign Member'}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* 3. SAVED ADDRESS TAB */}
              {activeTab === 'ADDRESS' && (
                <Box component="form" onSubmit={handleSaveAddress} sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                    Default Islandwide Shipping Address
                  </Typography>

                  <TextField 
                    fullWidth 
                    required 
                    label="Street Address / Residence" 
                    value={addressLine1} 
                    onChange={(e) => setAddressLine1(e.target.value)} 
                    placeholder="No. 45, Galle Road" 
                    variant="outlined" 
                    sx={textFieldStyles} 
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField 
                      fullWidth 
                      required 
                      label="City / Town" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      placeholder="Colombo 03" 
                      variant="outlined" 
                      sx={textFieldStyles} 
                    />
                    <TextField 
                      fullWidth 
                      required 
                      label="District" 
                      value={district} 
                      onChange={(e) => setDistrict(e.target.value)} 
                      placeholder="Colombo" 
                      variant="outlined" 
                      sx={textFieldStyles} 
                    />
                  </Box>

                  <TextField 
                    fullWidth 
                    label="Postal Code" 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    placeholder="00300" 
                    variant="outlined" 
                    sx={textFieldStyles} 
                  />

                  <Button 
                    type="submit" 
                    disabled={isSavingAddress}
                    sx={{ 
                      mt: 1, 
                      py: 1.25, 
                      bgcolor: '#D4AF37', 
                      color: 'black', 
                      fontWeight: 900, 
                      fontSize: '0.75rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em', 
                      borderRadius: 1, 
                      '&:hover': { bgcolor: '#E2B714' } 
                    }}
                  >
                    {isSavingAddress ? <CircularProgress size={16} color="inherit" /> : 'SAVE SHIPPING ADDRESS'}
                  </Button>
                </Box>
              )}

            </Box>
          )}

        </Box>
      </Fade>
    </Modal>
  );
};
