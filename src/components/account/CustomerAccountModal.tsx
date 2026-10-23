import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Order, OrderStatus, ShippingAddress } from '../../types/ecommerce';
import { loginCustomer, registerCustomer, updateCustomerProfile } from '../../services/authService';
import {
  X,
  User,
  Package,
  LogOut,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Truck,
  Copy,
  Check,
  Clock,
  History
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
  Alert,
  Chip
} from '@mui/material';
import valknutLogo from '../../assets/logos/symbol-dark.png';

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

  // Tab when not logged in: defaults to ORDERS if any orders were placed on this device
  const [authMode, setAuthMode] = useState<'ORDERS' | 'LOGIN' | 'REGISTER'>('ORDERS');

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
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Address edit state
  const [addressLine1, setAddressLine1] = useState(user?.address?.addressLine1 || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [district, setDistrict] = useState(user?.address?.district || 'Colombo');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Filter customer orders (by user identity or device/browser orders in customer mode)
  const customerOrders = useMemo(() => {
    let list: Order[] = [];
    if (user && !user.isAdmin) {
      list = orders.filter(
        (o) =>
          (o.userId && o.userId === user.id) ||
          (o.customerInfo?.email && user.email && o.customerInfo.email.toLowerCase() === user.email.toLowerCase()) ||
          (o.customerInfo?.phone && user.phone && o.customerInfo.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, ''))
      );
    } else {
      list = orders;
    }
    // Sort latest first
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, user]);

  // Previous 5 placed orders
  const displayedOrders = useMemo(() => {
    return showAllOrders ? customerOrders : customerOrders.slice(0, 5);
  }, [customerOrders, showAllOrders]);

  if (!isAccountOpen) return null;

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    showToast(`Order ${orderNumber} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

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
        regEmail.trim(),
        regPassword,
        regName.trim(),
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
      bgcolor: 'var(--bg-card)',
      '& fieldset': { borderColor: 'var(--border-subtle)' },
      '&:hover fieldset': { borderColor: 'var(--border-strong)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    },
    '& .MuiInputLabel-root': { color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
  };

  // Reusable Order Card Render
  const renderOrderCard = (order: Order, index: number) => {
    const stepNum = getStatusStep(order.orderStatus);

    return (
      <Box 
        key={order.id} 
        sx={{ 
          bgcolor: '#141620', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 2, 
          p: { xs: 2, sm: 2.5 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(212,175,55,0.4)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
          }
        }}
      >
        {/* Top Summary Bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', pb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'rgba(212,175,55,0.15)',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 900
              }}
            >
              #{index + 1}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 900, color: '#D4AF37', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.04em' }}>
                  {order.orderNumber}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleCopyOrderNumber(order.orderNumber)}
                  sx={{ p: 0.3, color: 'var(--text-secondary)', '&:hover': { color: 'primary.main' } }}
                  title="Copy Order Number"
                >
                  {copiedOrderId === order.orderNumber ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                </IconButton>
              </Box>
              <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Clock size={11} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>
              LKR {order.totalAmount.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>
              {order.paymentGateway} • <Box component="span" sx={{ color: order.paymentStatus === 'PAID' ? '#4ade80' : '#f59e0b' }}>{order.paymentStatus}</Box>
            </Typography>
          </Box>
        </Box>

        {/* Order Items Breakdown */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {order.items.map((ci: any, idx: number) => {
            const img = ci.customization?.finalPreviewDataUrl || ci.imageUrl || ci.product?.images?.[0] || '';
            const name = ci.productName || ci.product?.name || 'VALKNUT Garment';
            const size = ci.size || ci.selectedSize || 'M';

            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', bgcolor: 'rgba(255,255,255,0.02)', p: 1, borderRadius: 1.5 }}>
                {img ? (
                  <Box component="img" src={img} alt={name} sx={{ width: 44, height: 52, objectFit: 'cover', borderRadius: 1, bgcolor: '#0B0C10', flexShrink: 0 }} />
                ) : (
                  <Box sx={{ width: 44, height: 52, bgcolor: '#0B0C10', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#D4AF37', flexShrink: 0 }}>VK</Box>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>
                    Size: <strong style={{ color: '#ffffff' }}>{size}</strong> • Color: <strong style={{ color: '#ffffff' }}>{ci.color || 'Onyx Black'}</strong> • Qty: <strong style={{ color: '#D4AF37' }}>{ci.quantity}</strong>
                  </Typography>
                  {ci.customization && (
                    <Typography sx={{ fontSize: '0.625rem', color: '#D4AF37', fontWeight: 700, mt: 0.3 }}>
                      ✦ Bespoke: {ci.customization.printTechnique} ({ci.customization.placement})
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  LKR {((ci.unitPrice || 0) * (ci.quantity || 1)).toLocaleString()}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Live Tracking Progress Timeline & Action */}
        <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, fontSize: '0.6875rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 'inherit', color: 'var(--text-secondary)' }}>STATUS:</Typography>
              <Chip 
                label={order.orderStatus} 
                size="small" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.625rem', 
                  fontWeight: 900, 
                  letterSpacing: '0.08em', 
                  textTransform: 'uppercase', 
                  bgcolor: 'rgba(212,175,55,0.15)', 
                  color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.4)' 
                }} 
              />
            </Box>
            
            <Button
              onClick={() => {
                setIsAccountOpen(false);
                window.location.hash = `#/track-order?order=${order.orderNumber}`;
              }}
              startIcon={<Truck size={13} />}
              sx={{
                minWidth: 'auto',
                p: 0,
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#D4AF37',
                fontFamily: '"Inter", sans-serif',
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
              }}
            >
              Track Live Shipment →
            </Button>
          </Box>

          {/* Progress Bar steps */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((stName, idx) => {
              const isCompleted = stepNum >= (idx + 1);
              return (
                <Box sx={{ flex: 1, textAlign: 'center' }} key={stName}>
                  <Box sx={{ height: 4, borderRadius: 2, mb: 0.5, bgcolor: isCompleted ? 'primary.main' : 'rgba(255,255,255,0.1)' }} />
                  <Typography sx={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', fontFamily: '"Inter", sans-serif', color: isCompleted ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
                    {stName}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Modal
      open={isAccountOpen}
      onClose={() => setIsAccountOpen(false)}
      closeAfterTransition
      disableRestoreFocus
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }
        }
      }}
    >
      <Fade in={isAccountOpen}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 768, maxHeight: '90vh', bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', outline: 'none' }}>

          {/* Header */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#08090d', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={valknutLogo}
                alt="VALKNUT Official"
                sx={{
                  width: 36,
                  height: 36,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.4))',
                  flexShrink: 0
                }}
              />
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: '"Outfit", sans-serif' }}>
                  VALKNUT CUSTOMER PORTAL
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>
                  {user ? `Customer Mode: Logged in as ${user.name}` : 'Customer Mode: View your 5 previous placed orders & account'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsAccountOpen(false)} sx={{ color: 'var(--text-secondary)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Modal Body */}
          {!user ? (
            /* GUEST CUSTOMER MODE TABS (ORDERS, LOGIN, REGISTER) */
            <Box sx={{ p: { xs: 2.5, sm: 3.5 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Tab Selector */}
              <Box sx={{ display: 'flex', bgcolor: '#141620', p: 0.5, borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 440, mx: 'auto', width: '100%' }}>
                <Button
                  fullWidth
                  onClick={() => { setAuthMode('ORDERS'); setAuthError(''); }}
                  sx={{
                    py: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    borderRadius: 1,
                    bgcolor: authMode === 'ORDERS' ? '#D4AF37' : 'transparent',
                    color: authMode === 'ORDERS' ? 'black' : 'var(--text-secondary)',
                    '&:hover': { bgcolor: authMode === 'ORDERS' ? '#E2B714' : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  PREVIOUS ORDERS ({Math.min(5, customerOrders.length)})
                </Button>
                <Button
                  fullWidth
                  onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                  sx={{
                    py: 1,
                    fontSize: '0.72rem',
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
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    borderRadius: 1,
                    bgcolor: authMode === 'REGISTER' ? '#D4AF37' : 'transparent',
                    color: authMode === 'REGISTER' ? 'black' : 'var(--text-secondary)',
                    '&:hover': { bgcolor: authMode === 'REGISTER' ? '#E2B714' : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  REGISTER
                </Button>
              </Box>

              {/* 1. GUEST PREVIOUS 5 PLACED ORDERS */}
              {authMode === 'ORDERS' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <History size={16} color="#D4AF37" />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                        CUSTOMER MODE — 5 PREVIOUS PLACED ORDERS
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Showing {Math.min(5, customerOrders.length)} of {customerOrders.length}
                    </Typography>
                  </Box>

                  {customerOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                      <Package color="var(--text-secondary)" size={36} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        No orders placed on this device yet.
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 360 }}>
                        Browse our luxury streetwear drops, or sign in if you previously placed orders with an account.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                        <Button variant="contained" href="#/shop" onClick={() => setIsAccountOpen(false)} sx={{ bgcolor: '#D4AF37', color: 'black', fontWeight: 800, fontSize: '0.72rem' }}>
                          BROWSE CATALOG
                        </Button>
                        <Button variant="outlined" onClick={() => setAuthMode('LOGIN')} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem' }}>
                          SIGN IN TO ACCOUNT
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    displayedOrders.map((order, idx) => renderOrderCard(order, idx))
                  )}

                  {customerOrders.length > 5 && (
                    <Button
                      onClick={() => setShowAllOrders(!showAllOrders)}
                      sx={{ py: 1, fontSize: '0.75rem', fontWeight: 800, color: 'primary.main', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 1 }}
                    >
                      {showAllOrders ? 'SHOW 5 PREVIOUS ORDERS' : `VIEW ALL (${customerOrders.length}) ORDERS`}
                    </Button>
                  )}
                </Box>
              )}

              {authError && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.75rem',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {authError}
                </Alert>
              )}

              {/* 2. LOGIN FORM */}
              {authMode === 'LOGIN' && (
                <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email Address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="customer@valknut.lk"
                    variant="outlined"
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={16} color="var(--text-secondary)" />
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
                            <Lock size={16} color="var(--text-secondary)" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)} edge="end" sx={{ color: 'var(--text-secondary)' }}>
                              {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={16} />}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      bgcolor: 'primary.main',
                      color: 'black',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      borderRadius: 1,
                      boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' }
                    }}
                  >
                    {isLoading ? 'SIGNING IN...' : 'SIGN IN TO PORTAL'}
                  </Button>
                </Box>
              )}

              {/* 3. REGISTER FORM */}
              {authMode === 'REGISTER' && (
                <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    required
                    type="text"
                    label="Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Kasun Perera"
                    variant="outlined"
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={16} color="var(--text-secondary)" />
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
                            <Mail size={16} color="var(--text-secondary)" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    type="tel"
                    label="Mobile Phone (for delivery SMS)"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    variant="outlined"
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={16} color="var(--text-secondary)" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type={showRegPassword ? 'text' : 'password'}
                    label="Create Password (min. 6 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    variant="outlined"
                    sx={textFieldStyles}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={16} color="var(--text-secondary)" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowRegPassword(!showRegPassword)} edge="end" sx={{ color: 'var(--text-secondary)' }}>
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
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={16} color="var(--text-secondary)" />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={16} />}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      bgcolor: 'primary.main',
                      color: 'black',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      borderRadius: 1,
                      boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' }
                    }}
                  >
                    {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </Button>
                </Box>
              )}

            </Box>
          ) : (
            /* LOGGED IN CUSTOMER PORTAL */
            <Box sx={{ p: { xs: 2.5, sm: 3.5 }, overflowY: 'auto', maxHeight: 'calc(92vh - 80px)', display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Navigation Tabs */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => setActiveTab('ORDERS')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', ...(activeTab === 'ORDERS' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }) }}
                  >
                    PREVIOUS ORDERS ({Math.min(5, customerOrders.length)})
                  </Button>
                  <Button
                    onClick={() => setActiveTab('PROFILE')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', ...(activeTab === 'PROFILE' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }) }}
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
                    sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'rgba(153,27,27,0.4)', color: 'error.light' } }}
                  >
                    Sign Out
                  </Button>
                </Box>
              </Box>

              {/* 1. ORDERS TAB (5 PREVIOUS PLACED ORDERS) */}
              {activeTab === 'ORDERS' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <History size={16} color="#D4AF37" />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                        CUSTOMER MODE — 5 PREVIOUS PLACED ORDERS
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Showing {Math.min(5, customerOrders.length)} of {customerOrders.length}
                    </Typography>
                  </Box>

                  {customerOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <Package color="var(--text-secondary)" size={32} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>No orders found under your account.</Typography>
                      <Button href="#/shop" onClick={() => setIsAccountOpen(false)} sx={{ mt: 1, color: '#D4AF37', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        Browse Streetwear Catalog →
                      </Button>
                    </Box>
                  ) : (
                    displayedOrders.map((order, idx) => renderOrderCard(order, idx))
                  )}

                  {customerOrders.length > 5 && (
                    <Button
                      onClick={() => setShowAllOrders(!showAllOrders)}
                      sx={{ py: 1, fontSize: '0.75rem', fontWeight: 800, color: 'primary.main', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 1 }}
                    >
                      {showAllOrders ? 'SHOW 5 PREVIOUS ORDERS' : `VIEW ALL (${customerOrders.length}) ORDERS`}
                    </Button>
                  )}
                </Box>
              )}

              {/* 2. PROFILE TAB */}
              {activeTab === 'PROFILE' && (
                <Box sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Name:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Email:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Phone:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.phone}</Typography>
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
                <Box component="form" onSubmit={handleSaveAddress} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    required
                    label="Address Line 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="No. 45, Galle Road"
                    variant="outlined"
                    sx={textFieldStyles}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="City"
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
                      py: 1.5,
                      bgcolor: 'primary.main',
                      color: 'black',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    {isSavingAddress ? 'SAVING...' : 'SAVE ADDRESS'}
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
