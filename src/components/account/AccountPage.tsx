import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus, ShippingAddress } from '../../types/ecommerce';
import { registerCustomer, loginCustomer, logoutCustomer, requestPasswordReset, updateCustomerProfile } from '../../services/authService';
import { mergeGuestCartWithCustomerCart } from '../../services/cartService';
import { 
  User, Package, MapPin, LogOut, ExternalLink, Lock, Mail, Phone, Check, ChevronRight, 
  ShieldCheck, Eye, EyeOff, ArrowRight, Sparkles, Edit3, AlertCircle, X
} from 'lucide-react';
import { Box, Typography, Button, TextField, MenuItem, Modal, IconButton, InputAdornment, Checkbox, FormControlLabel, Select, InputLabel, FormControl } from '@mui/material';

interface AccountPageProps {
  initialSubTab?: 'dashboard' | 'orders' | 'profile' | 'login' | 'register' | 'forgot-password';
}

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 
  'Moneragala', 'Ratnapura', 'Kegalle'
];

export const AccountPage: React.FC<AccountPageProps> = ({ initialSubTab = 'dashboard' }) => {
  const { 
    user, 
    loginUser, 
    logoutUser: storeLogout, 
    orders, 
    cart, 
    setIsAdminOpen, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile' | 'login' | 'register' | 'forgot-password'>(() => {
    if (!user) {
      if (initialSubTab === 'register' || initialSubTab === 'forgot-password') return initialSubTab;
      return 'login';
    }
    return initialSubTab === 'login' || initialSubTab === 'register' ? 'dashboard' : initialSubTab;
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState<ShippingAddress>({
    fullName: user?.address?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.address?.phone || user?.phone || '',
    addressLine1: user?.address?.addressLine1 || '',
    addressLine2: user?.address?.addressLine2 || '',
    city: user?.address?.city || '',
    district: user?.address?.district || 'Colombo',
    postalCode: user?.address?.postalCode || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const userOrders = user 
    ? orders.filter((o) => o.customerInfo.email.toLowerCase() === user.email.toLowerCase() || user.isAdmin)
    : [];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await loginCustomer(loginEmail, loginPassword);
      if (res.success && res.user) {
        loginUser(res.user.email, res.user.name);
        if (cart.length > 0) {
          await mergeGuestCartWithCustomerCart(cart, res.user.id);
        }
        showToast(res.message || 'Logged in successfully', 'success');
        setActiveTab('dashboard');
        window.location.hash = '#/account';
      } else {
        setLoginError(res.message || 'Invalid email or password.');
      }
    } catch {
      setLoginError('An unexpected login error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }
    setIsRegistering(true);
    try {
      const res = await registerCustomer(regEmail, regPassword, regName, regPhone);
      if (res.success && res.user) {
        loginUser(res.user.email, res.user.name);
        if (cart.length > 0) {
          await mergeGuestCartWithCustomerCart(cart, res.user.id);
        }
        showToast('Welcome to VALKNUT Official VIP.', 'success');
        setActiveTab('dashboard');
        window.location.hash = '#/account';
      } else {
        setRegError(res.message || 'Registration failed.');
      }
    } catch {
      setRegError('Failed to create account.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    if (!forgotEmail.trim()) return;
    setIsForgotLoading(true);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setForgotMsg({ text: res.message, isError: !res.success });
      if (res.success) {
        showToast('Password reset link dispatched.', 'info');
      }
    } catch {
      setForgotMsg({ text: 'Failed to dispatch reset instructions.', isError: true });
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutCustomer();
    storeLogout();
    setActiveTab('login');
    window.location.hash = '#/account';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const updated = await updateCustomerProfile(user.id, {
        name: editName,
        phone: editPhone,
        address: editAddress
      });
      if (updated) {
        loginUser(updated.email, updated.name);
        showToast('Profile and delivery address updated.', 'success');
      }
    } catch (e) {
      console.warn('Profile update error:', e);
      showToast('Failed to save changes.', 'error');
    } finally {
      setIsSavingProfile(false);
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
      bgcolor: '#131520',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    },
    '& .MuiInputLabel-root': { color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
  };

  const isAuthView = !user || activeTab === 'login' || activeTab === 'register' || activeTab === 'forgot-password';

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 4, sm: 6 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ maxWidth: 1500, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        
        {/* Breadcrumb Hierarchy */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 4 }}>
          <Box component="a" href="#/" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Home</Box>
          <ChevronRight size={12} />
          <Box component="a" href="#/account" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold' }}>Customer Portal</Box>
          {user && activeTab !== 'dashboard' && (
            <>
              <ChevronRight size={12} />
              <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)', fontFamily: 'inherit' }}>{activeTab}</Typography>
            </>
          )}
        </Box>

        {isAuthView ? (
          <Box sx={{ maxWidth: 500, mx: 'auto', my: 4, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 5 }, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease-out' }}>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ width: 40, height: 40, border: '1px solid #D4AF37', mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0.5, mb: 2 }}>
                <Typography sx={{ color: 'primary.main', fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.25rem' }}>V</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase', mb: 1 }}>
                VALKNUT SOVEREIGN PORTAL
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '1.875rem' }, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em', mb: 1 }}>
                {activeTab === 'register' ? 'CREATE VIP ACCOUNT' : activeTab === 'forgot-password' ? 'RESET PASSWORD' : 'MEMBER SIGN IN'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {activeTab === 'register'
                  ? 'Join the VALKNUT inner circle for exclusive drops and order tracking.'
                  : activeTab === 'forgot-password'
                  ? 'Enter your registered email to receive recovery instructions.'
                  : 'Access your order history, delivery details, and saved sizing.'}
              </Typography>
            </Box>

            {activeTab !== 'forgot-password' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', p: 0.5, bgcolor: '#131520', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, mb: 4 }}>
                <Button 
                  onClick={() => setActiveTab('login')} 
                  sx={{ py: 1, borderRadius: 0.5, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', transition: 'all 0.3s ease', ...(activeTab === 'login' ? { bgcolor: 'primary.main', color: 'black', boxShadow: '0 2px 10px rgba(212,175,55,0.2)' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }) }}
                >
                  SIGN IN
                </Button>
                <Button 
                  onClick={() => setActiveTab('register')} 
                  sx={{ py: 1, borderRadius: 0.5, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', transition: 'all 0.3s ease', ...(activeTab === 'register' ? { bgcolor: 'primary.main', color: 'black', boxShadow: '0 2px 10px rgba(212,175,55,0.2)' } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }) }}
                >
                  CREATE ACCOUNT
                </Button>
              </Box>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {loginError && (
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(153,27,27,0.4)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 0.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'error.light', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertCircle size={14} />
                    {loginError}
                  </Box>
                )}
                <TextField 
                  fullWidth 
                  required 
                  type="email" 
                  label="Email Address" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  variant="outlined" 
                  sx={textFieldStyles}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={16} color="#64748b" /></InputAdornment> } }}
                />
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                    <Button onClick={() => setActiveTab('forgot-password')} sx={{ minWidth: 'auto', p: 0, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'primary.main', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}>
                      Forgot Password?
                    </Button>
                  </Box>
                  <TextField 
                    fullWidth 
                    required 
                    type={showLoginPassword ? 'text' : 'password'} 
                    label="Password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{ input: { 
                      startAdornment: <InputAdornment position="start"><Lock size={16} color="#64748b" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)} size="small" sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
                            {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    } }}
                  />
                </Box>
                <Button type="submit" disabled={isLoggingIn} sx={{ mt: 2, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
                  {isLoggingIn ? 'AUTHENTICATING...' : 'SIGN IN'}
                </Button>
              </Box>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {regError && (
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(153,27,27,0.4)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 0.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'error.light', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertCircle size={14} />
                    {regError}
                  </Box>
                )}
                <TextField 
                  fullWidth 
                  required 
                  label="Full Name" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                  variant="outlined" 
                  sx={textFieldStyles}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><User size={16} color="#64748b" /></InputAdornment> } }}
                />
                <TextField 
                  fullWidth 
                  required 
                  type="email" 
                  label="Email Address" 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)} 
                  variant="outlined" 
                  sx={textFieldStyles}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={16} color="#64748b" /></InputAdornment> } }}
                />
                <TextField 
                  fullWidth 
                  required 
                  type="tel" 
                  label="Phone Number" 
                  value={regPhone} 
                  onChange={(e) => setRegPhone(e.target.value)} 
                  variant="outlined" 
                  sx={textFieldStyles}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone size={16} color="#64748b" /></InputAdornment> } }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField 
                    fullWidth 
                    required 
                    type={showRegPassword ? 'text' : 'password'} 
                    label="Password" 
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock size={16} color="#64748b" /></InputAdornment> } }}
                  />
                  <TextField 
                    fullWidth 
                    required 
                    type={showRegPassword ? 'text' : 'password'} 
                    label="Confirm" 
                    value={regConfirmPassword} 
                    onChange={(e) => setRegConfirmPassword(e.target.value)} 
                    variant="outlined" 
                    sx={textFieldStyles}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock size={16} color="#64748b" /></InputAdornment> } }}
                  />
                </Box>
                <FormControlLabel
                  control={<Checkbox checked={showRegPassword} onChange={(e) => setShowRegPassword(e.target.checked)} sx={{ color: 'var(--text-secondary)', '&.Mui-checked': { color: 'primary.main' } }} />}
                  label={<Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>Show password</Typography>}
                />
                <Button type="submit" disabled={isRegistering} sx={{ mt: 1, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
                  {isRegistering ? 'CREATING ACCOUNT...' : 'JOIN VALKNUT VIP'}
                </Button>
              </Box>
            )}

            {/* FORGOT PASSWORD FORM */}
            {activeTab === 'forgot-password' && (
              <Box component="form" onSubmit={handleForgotPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {forgotMsg && (
                  <Box sx={{ p: 1.5, bgcolor: forgotMsg.isError ? 'rgba(153,27,27,0.4)' : 'rgba(16,185,129,0.1)', border: '1px solid', borderColor: forgotMsg.isError ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.3)', borderRadius: 0.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: forgotMsg.isError ? 'error.light' : 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertCircle size={14} />
                    {forgotMsg.text}
                  </Box>
                )}
                <TextField 
                  fullWidth 
                  required 
                  type="email" 
                  label="Registered Email" 
                  value={forgotEmail} 
                  onChange={(e) => setForgotEmail(e.target.value)} 
                  variant="outlined" 
                  sx={textFieldStyles}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={16} color="#64748b" /></InputAdornment> } }}
                />
                <Button type="submit" disabled={isForgotLoading} sx={{ mt: 2, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
                  {isForgotLoading ? 'SENDING...' : 'SEND RECOVERY LINK'}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button onClick={() => setActiveTab('login')} sx={{ minWidth: 'auto', p: 0, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}>
                    ← Back to Sign In
                  </Button>
                </Box>
              </Box>
            )}

          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'fadeIn 0.5s ease-out' }}>
            
            {/* Top Customer Banner */}
            <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: 1, bgcolor: '#141620', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(212,175,55,0.1)', flexShrink: 0 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase' }}>
                      {user.name}
                    </Typography>
                    <Typography sx={{ px: 1, py: 0.25, bgcolor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: 'primary.main', fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, textTransform: 'uppercase', borderRadius: 0.5 }}>
                      {user.isAdmin ? 'FOUNDER / ADMIN' : 'SOVEREIGN VIP'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                    {user.email} • {user.phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user.isAdmin && (
                  <Button onClick={() => setIsAdminOpen(true)} startIcon={<ShieldCheck size={16} />} sx={{ px: 3, py: 1.5, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)', color: 'primary.main', fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(212,175,55,0.2)' } }}>
                    ADMIN SUITE
                  </Button>
                )}
                <Button onClick={handleLogout} startIcon={<LogOut size={16} />} sx={{ px: 3, py: 1.5, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.4)', color: 'error.main' } }}>
                  SIGN OUT
                </Button>
              </Box>
            </Box>

            {/* Navigation Tabs Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {[
                { id: 'dashboard', label: 'OVERVIEW', icon: Sparkles },
                { id: 'orders', label: `ORDERS (${userOrders.length})`, icon: Package },
                { id: 'profile', label: 'DELIVERY & PROFILE', icon: Edit3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      window.location.hash = `#/account/${tab.id}`;
                    }}
                    startIcon={<Icon size={14} />}
                    sx={{ px: 3, py: 1.5, borderRadius: 0.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', flexShrink: 0, ...(isActive ? { bgcolor: 'primary.main', color: 'black', boxShadow: '0 4px 15px rgba(212,175,55,0.2)' } : { bgcolor: '#12141F', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' } }) }}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <Box sx={{ p: 3, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TOTAL COMPLETED ORDERS</Typography>
                    <Typography sx={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>{userOrders.length}</Typography>
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'success.main' }}>Verified Purchases</Typography>
                  </Box>
                  <Box sx={{ p: 3, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>VIP REWARDS LEVEL</Typography>
                    <Typography sx={{ fontSize: '1.875rem', fontWeight: 900, color: 'primary.main', fontFamily: '"Inter", sans-serif' }}>TIER 1</Typography>
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>Early Drop Access Active</Typography>
                  </Box>
                  <Box sx={{ p: 3, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DEFAULT SHIPPING ZONE</Typography>
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif', mt: 1 }}>{user.address?.city || 'Colombo 03'}</Typography>
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>Sri Lanka Delivery</Typography>
                  </Box>
                </Box>

                {userOrders.length > 0 && (
                  <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', mb: 0.5 }}>LATEST DISPATCH STATUS</Typography>
                        <Typography variant="h3" sx={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', textTransform: 'uppercase' }}>ORDER #{userOrders[0].orderNumber}</Typography>
                      </Box>
                      <Button onClick={() => setSelectedOrderDetails(userOrders[0])} endIcon={<ArrowRight size={14} />} sx={{ p: 0, minWidth: 'auto', color: 'primary.main', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                        View Breakdown
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
                        <Typography sx={{ fontSize: 'inherit', color: 'var(--text-secondary)' }}>Current Phase: <Box component="strong" sx={{ color: 'primary.main', textTransform: 'uppercase' }}>{userOrders[0].orderStatus}</Box></Typography>
                        {userOrders[0].awbNumber && <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>AWB: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{userOrders[0].awbNumber}</Box></Typography>}
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, pt: 1, textAlign: 'center' }}>
                        {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                          const isDone = getStatusStep(userOrders[0].orderStatus) >= idx + 1;
                          return (
                            <Box key={step} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ height: 6, borderRadius: 3, transition: 'all 0.3s ease', bgcolor: isDone ? 'primary.main' : 'rgba(255,255,255,0.1)' }} />
                              <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', color: isDone ? 'white' : 'text.secondary' }}>{step}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* TAB 2: ORDERS HISTORY */}
            {activeTab === 'orders' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {userOrders.length === 0 ? (
                  <Box sx={{ p: 6, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Package size={40} color="rgba(255,255,255,0.4)" />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em' }}>No Orders Placed Yet</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 400 }}>Once you place an order, live tracking, courier AWB tracking, and digital invoices will appear here.</Typography>
                    <Button href="#/shop" sx={{ mt: 2, px: 4, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>Explore Shop</Button>
                  </Box>
                ) : (
                  userOrders.map((order) => {
                    const stepNum = getStatusStep(order.orderStatus);
                    return (
                      <Box key={order.id} sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, sm: 'items-center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2, gap: 2 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>{order.orderNumber}</Typography>
                              <Typography sx={{ px: 1, py: 0.25, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif', mt: 0.5 }}>Paid via {order.paymentGateway} ({order.paymentStatus})</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                            <Box sx={{ textAlign: { sm: 'right' } }}>
                              <Typography sx={{ fontSize: '1rem', fontWeight: 900, fontFamily: '"Inter", sans-serif', color: 'var(--text-primary)' }}>LKR {order.totalAmount.toLocaleString()}</Typography>
                              <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>{order.items.reduce((s, i) => s + i.quantity, 0)} Items</Typography>
                            </Box>
                            <Button onClick={() => setSelectedOrderDetails(order)} sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', borderRadius: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                              Details
                            </Button>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                          {order.items.map((item: any, idx: number) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#141620', borderRadius: 0.5, border: '1px solid rgba(255,255,255,0.05)' }}>
                              <Box component="img" src={item.customization?.finalPreviewDataUrl || item.imageUrl || item.product?.images?.[0] || ''} alt="" sx={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 0.5, bgcolor: '#1a1d2d', flexShrink: 0 }} />
                              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }} noWrap>{item.productName || item.product?.name || 'Garment'}</Typography>
                                <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>Size: {item.size || item.selectedSize || 'M'} {item.color || item.selectedColor ? `• ${item.color || item.selectedColor}` : ''} • Qty: {item.quantity}</Typography>
                                <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', color: 'primary.main' }}>LKR {(item.unitPrice || 0).toLocaleString()}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
                            <Typography sx={{ fontSize: 'inherit', color: 'var(--text-secondary)' }}>Status: <Box component="strong" sx={{ color: 'primary.main', textTransform: 'uppercase' }}>{order.orderStatus}</Box></Typography>
                            {order.trackingLink && (
                              <Box component="a" href={order.trackingLink} target="_blank" rel="noreferrer" sx={{ color: 'primary.main', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.6875rem' }}>
                                Track via {order.courierName || 'Pronto Express'} <ExternalLink size={12} />
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, textAlign: 'center' }}>
                            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => (
                              <Box key={step} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ height: 6, borderRadius: 3, transition: 'all 0.3s ease', bgcolor: stepNum >= idx + 1 ? 'primary.main' : 'rgba(255,255,255,0.1)' }} />
                                <Typography sx={{ fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', textTransform: 'uppercase', color: stepNum >= idx + 1 ? 'white' : 'text.secondary' }}>{step}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        
                      </Box>
                    );
                  })
                )}
              </Box>
            )}

            {/* TAB 3: PROFILE & DELIVERY ADDRESS */}
            {activeTab === 'profile' && (
              <Box component="form" onSubmit={handleSaveProfile} sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.1em' }}>PERSONAL & DELIVERY PROFILE</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', mt: 0.5 }}>Update your contact information and primary Sri Lanka delivery destination for 1-click checkout.</Typography>
                </Box>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <TextField fullWidth required label="Full Name" value={editName} onChange={(e) => setEditName(e.target.value)} variant="outlined" sx={textFieldStyles} />
                    <TextField fullWidth disabled label="Email Address (Account Linked)" value={user.email} variant="outlined" sx={{...textFieldStyles, '& .MuiOutlinedInput-root': { ...textFieldStyles['& .MuiOutlinedInput-root'], bgcolor: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}} />
                    <TextField fullWidth required type="tel" label="Mobile Number (For Delivery SMS)" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} variant="outlined" sx={textFieldStyles} />
                  </Box>
                </Box>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} color="#D4AF37" /> Primary Delivery Address
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField fullWidth required label="Address Line 1 (Street & House No.)" value={editAddress.addressLine1} onChange={(e) => setEditAddress({ ...editAddress, addressLine1: e.target.value })} variant="outlined" sx={textFieldStyles} />
                    <TextField fullWidth label="Address Line 2 (Apartment / Suite / Landmark)" value={editAddress.addressLine2 || ''} onChange={(e) => setEditAddress({ ...editAddress, addressLine2: e.target.value })} variant="outlined" sx={textFieldStyles} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
                      <TextField fullWidth required label="City" value={editAddress.city} onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })} variant="outlined" sx={textFieldStyles} />
                      <FormControl fullWidth variant="outlined" sx={textFieldStyles}>
                        <InputLabel id="district-label">District / Province</InputLabel>
                        <Select labelId="district-label" label="District / Province" value={editAddress.district} onChange={(e) => setEditAddress({ ...editAddress, district: e.target.value as string })}>
                          {SRI_LANKAN_DISTRICTS.map((d) => (
                            <MenuItem key={d} value={d} sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>{d} District</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField fullWidth required label="Postal Code" value={editAddress.postalCode} onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })} variant="outlined" sx={textFieldStyles} />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" disabled={isSavingProfile} startIcon={<Check size={16} />} sx={{ px: 4, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
                    {isSavingProfile ? 'SAVING...' : 'SAVE PROFILE'}
                  </Button>
                </Box>
              </Box>
            )}

          </Box>
        )}

        <Modal open={!!selectedOrderDetails} onClose={() => setSelectedOrderDetails(null)} closeAfterTransition slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' } } }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 2, p: { xs: 3, sm: 5 }, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {selectedOrderDetails && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main', fontWeight: 'bold' }}>ORDER INVOICE</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{selectedOrderDetails.orderNumber}</Typography>
                  </Box>
                  <IconButton onClick={() => setSelectedOrderDetails(null)} sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    <X size={20} />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 300, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 } }}>
                  {selectedOrderDetails.items.map((it: any, idx: number) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: idx < selectedOrderDetails.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {it.customization?.finalPreviewDataUrl || it.imageUrl || it.product?.images?.[0] ? (
                          <Box component="img" src={it.customization?.finalPreviewDataUrl || it.imageUrl || it.product?.images?.[0]} sx={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 0.5, bgcolor: '#141620' }} />
                        ) : null}
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>{it.productName || it.product?.name || 'Garment'}</Typography>
                          <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>Size: {it.size || it.selectedSize || 'M'} {it.color || it.selectedColor ? `• ${it.color || it.selectedColor}` : ''} • Qty: {it.quantity}</Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>LKR {((it.unitPrice || 0) * (it.quantity || 1)).toLocaleString()}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ bgcolor: '#141620', p: 3, borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Subtotal:</Typography>
                    <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)', fontWeight: 'bold' }}>LKR {selectedOrderDetails.subtotal.toLocaleString()}</Typography>
                  </Box>
                  {selectedOrderDetails.discountAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography sx={{ fontSize: 'inherit' }}>Discount:</Typography>
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>- LKR {selectedOrderDetails.discountAmount.toLocaleString()}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Shipping:</Typography>
                    <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)', fontWeight: 'bold' }}>{selectedOrderDetails.shippingCharge === 0 ? 'FREE' : `LKR ${selectedOrderDetails.shippingCharge}`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-primary)' }}>TOTAL PAID:</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'primary.main' }}>LKR {selectedOrderDetails.totalAmount.toLocaleString()}</Typography>
                  </Box>
                </Box>

                <Box sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 'inherit' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Shipping To:</Box> {selectedOrderDetails.customerInfo.fullName}, {selectedOrderDetails.customerInfo.addressLine1}, {selectedOrderDetails.customerInfo.city}</Typography>
                  <Typography sx={{ fontSize: 'inherit' }}><Box component="strong" sx={{ color: 'var(--text-primary)' }}>Contact Phone:</Box> {selectedOrderDetails.customerInfo.phone}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};
