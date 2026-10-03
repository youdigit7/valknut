import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus, ShippingAddress } from '../../types/ecommerce';
import { registerCustomer, loginCustomer, logoutCustomer, requestPasswordReset, updateCustomerProfile } from '../../services/authService';
import { mergeGuestCartWithCustomerCart } from '../../services/cartService';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  ExternalLink, 
  Lock, 
  Mail, 
  Phone, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  Edit3
} from 'lucide-react';

interface AccountPageProps {
  initialSubTab?: 'dashboard' | 'orders' | 'profile' | 'login' | 'register' | 'forgot-password';
}

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

  // Active view tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'profile' | 'login' | 'register' | 'forgot-password'>(() => {
    if (!user) {
      if (initialSubTab === 'register' || initialSubTab === 'forgot-password') return initialSubTab;
      return 'login';
    }
    return initialSubTab === 'login' || initialSubTab === 'register' ? 'dashboard' : initialSubTab;
  });

  // Selected Order for detail modal view
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Form states: Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form states: Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states: Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Form states: Profile editor
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState<ShippingAddress>({
    fullName: user?.address?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.address?.phone || user?.phone || '',
    addressLine1: user?.address?.addressLine1 || '',
    addressLine2: user?.address?.addressLine2 || '',
    city: user?.address?.city || '',
    district: user?.address?.district || 'Western Province',
    postalCode: user?.address?.postalCode || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Filter orders for logged in user (or sample orders for demo)
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
        
        // Merge Guest Cart into User's Account Cart
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

        // Merge Guest Cart
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

  // If user is NOT logged in and attempting to view protected tabs
  const isAuthView = !user || activeTab === 'login' || activeTab === 'register' || activeTab === 'forgot-password';

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] py-8 sm:py-12 border-b border-white/10">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-6">
          <a href="#/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={12} className="text-slate-600" />
          <a href="#/account" className="text-[#D4AF37] font-bold">Customer Portal</a>
          {user && activeTab !== 'dashboard' && (
            <>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-slate-300 capitalize">{activeTab}</span>
            </>
          )}
        </nav>

        {/* 1. AUTHENTICATION SCREENS (LOGIN / REGISTER / FORGOT PASSWORD) */}
        {isAuthView ? (
          <div className="max-w-xl mx-auto my-8 bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-10 shadow-2xl animate-fade-in">
            
            {/* Auth Top Branding */}
            <div className="text-center space-y-2 mb-8">
              <div className="w-10 h-10 border border-[#D4AF37] mx-auto flex items-center justify-center rounded-[2px] mb-3">
                <span className="text-[#D4AF37] font-syne font-black text-lg">V</span>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D4AF37] uppercase block">
                VALKNUT SOVEREIGN PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne tracking-tight">
                {activeTab === 'register' ? 'CREATE VIP ACCOUNT' : activeTab === 'forgot-password' ? 'RESET PASSWORD' : 'MEMBER SIGN IN'}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                {activeTab === 'register'
                  ? 'Join the VALKNUT inner circle for exclusive drops and order tracking.'
                  : activeTab === 'forgot-password'
                  ? 'Enter your registered email to receive recovery instructions.'
                  : 'Access your order history, delivery details, and saved sizing.'}
              </p>
            </div>

            {/* Auth Navigation Switcher */}
            {activeTab !== 'forgot-password' && (
              <div className="grid grid-cols-2 p-1 bg-[#131520] border border-white/10 rounded-[2px] mb-6 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2.5 rounded-[2px] transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#D4AF37] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`py-2.5 rounded-[2px] transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-[#D4AF37] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-[2px] text-xs font-mono text-red-400">
                    {loginError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot-password')}
                      className="text-[11px] font-mono text-[#D4AF37] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                    >
                      {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{isLoggingIn ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-[2px] text-xs font-mono text-red-400">
                    {regError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Kasun Perera"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="kasun@example.com"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                    Phone Number (for SMS Tracking)
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-9 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-9 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="showRegPass"
                    checked={showRegPassword}
                    onChange={(e) => setShowRegPassword(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <label htmlFor="showRegPass" className="text-[11px] font-mono text-slate-400 cursor-pointer">
                    Show password
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{isRegistering ? 'CREATING ACCOUNT...' : 'JOIN VALKNUT VIP'}</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {activeTab === 'forgot-password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotMsg && (
                  <div
                    className={`p-3 rounded-[2px] text-xs font-mono ${
                      forgotMsg.isError
                        ? 'bg-red-950/60 border border-red-500/40 text-red-400'
                        : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {forgotMsg.text}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                >
                  <span>{isForgotLoading ? 'SENDING...' : 'SEND RECOVERY LINK'}</span>
                  <ArrowRight size={15} />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs font-mono text-slate-400 hover:text-white"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* 2. LOGGED-IN CUSTOMER ACCOUNT PORTAL */
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Customer Banner */}
            <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[2px] bg-[#141620] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-syne font-black text-2xl shadow-lg flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white font-syne uppercase">
                      {user.name}
                    </h1>
                    <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono font-black uppercase rounded-[2px]">
                      {user.isAdmin ? 'FOUNDER / ADMIN' : 'SOVEREIGN VIP'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{user.email} • {user.phone}</p>
                </div>
              </div>

              {/* Actions: Admin Dashboard & Sign Out */}
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="px-4 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37] text-[#D4AF37] text-xs font-mono font-bold rounded-[2px] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={15} />
                    <span>ADMIN SUITE</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-white/5 hover:bg-red-950/40 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-mono font-bold rounded-[2px] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
              {[
                { id: 'dashboard', label: 'OVERVIEW', icon: Sparkles },
                { id: 'orders', label: `ORDERS (${userOrders.length})`, icon: Package },
                { id: 'profile', label: 'DELIVERY & PROFILE', icon: Edit3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      window.location.hash = `#/account/${tab.id}`;
                    }}
                    className={`px-5 py-2.5 rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-[#D4AF37] text-black shadow-md'
                        : 'bg-[#12141F] text-slate-400 hover:text-white border border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Stats Matrix Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-[#0E1017] border border-white/10 rounded-md space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                      TOTAL COMPLETED ORDERS
                    </span>
                    <p className="text-3xl font-black text-white font-mono">
                      {userOrders.length}
                    </p>
                    <span className="text-[11px] text-emerald-400 font-mono">Verified Purchases</span>
                  </div>

                  <div className="p-5 bg-[#0E1017] border border-white/10 rounded-md space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                      VIP REWARDS LEVEL
                    </span>
                    <p className="text-3xl font-black text-[#D4AF37] font-mono">
                      TIER 1
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono">Early Drop Access Active</span>
                  </div>

                  <div className="p-5 bg-[#0E1017] border border-white/10 rounded-md space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                      DEFAULT SHIPPING ZONE
                    </span>
                    <p className="text-lg font-black text-white font-mono truncate">
                      {user.address?.city || 'Colombo 03'}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono">Sri Lanka Delivery</span>
                  </div>
                </div>

                {/* Recent Order Tracker Snapshot */}
                {userOrders.length > 0 && (
                  <div className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-7 space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block mb-0.5">
                          LATEST DISPATCH STATUS
                        </span>
                        <h3 className="text-lg font-black text-white uppercase font-syne">
                          ORDER #{userOrders[0].orderNumber}
                        </h3>
                      </div>

                      <button
                        onClick={() => setSelectedOrderDetails(userOrders[0])}
                        className="text-xs font-mono font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                      >
                        <span>View Full Breakdown</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    {/* Progress Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">
                          Current Phase: <strong className="text-[#D4AF37] uppercase">{userOrders[0].orderStatus}</strong>
                        </span>
                        {userOrders[0].awbNumber && (
                          <span className="text-slate-400 text-[11px]">
                            AWB: <strong className="text-white">{userOrders[0].awbNumber}</strong>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 pt-1 text-center font-mono text-[9px] uppercase font-bold text-slate-500">
                        {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                          const isDone = getStatusStep(userOrders[0].orderStatus) >= idx + 1;
                          return (
                            <div key={step} className="space-y-1">
                              <div className={`h-2 rounded-full transition-all ${isDone ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                              <span className={isDone ? 'text-white' : 'text-slate-600'}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: ORDERS HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="bg-[#0E1017] border border-white/10 rounded-md p-12 text-center space-y-3">
                    <Package size={36} className="mx-auto text-slate-600" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Orders Placed Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Once you place an order, live tracking, courier AWB tracking, and digital invoices will appear here.
                    </p>
                    <a href="#/shop" className="inline-block mt-2 px-5 py-2.5 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest rounded-[2px]">
                      Explore Shop
                    </a>
                  </div>
                ) : (
                  userOrders.map((order) => {
                    const stepNum = getStatusStep(order.orderStatus);

                    return (
                      <div key={order.id} className="bg-[#0E1017] border border-white/10 rounded-md p-5 sm:p-6 space-y-4 shadow-xl">
                        
                        {/* Order Header Summary */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black font-mono text-[#D4AF37]">
                                {order.orderNumber}
                              </span>
                              <span className="px-2 py-0.5 bg-[#141620] border border-white/10 rounded text-[10px] font-mono text-slate-300">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 font-mono">
                              Paid via {order.paymentGateway} ({order.paymentStatus})
                            </p>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-black font-mono text-white block">
                                LKR {order.totalAmount.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-[2px] text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {order.items.map((item: any, idx: number) => {
                            const img = item.customization?.finalPreviewDataUrl || item.imageUrl || item.product?.images?.[0] || '';
                            const name = item.productName || item.product?.name || 'Garment';
                            const size = item.size || item.selectedSize || 'M';
                            const color = item.color || item.selectedColor || '';

                            return (
                              <div key={idx} className="flex items-center gap-3 p-2.5 bg-[#141620] rounded-[2px] border border-white/5">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={name}
                                    className="w-12 h-14 object-cover rounded-[2px] bg-[#1a1d2d] flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-14 bg-[#1a1d2d] rounded-[2px] flex items-center justify-center flex-shrink-0 text-slate-500 font-mono text-[9px]">
                                    VALKNUT
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold text-white truncate font-heading">{name}</h5>
                                  <p className="text-[10px] font-mono text-slate-400">Size: {size} {color ? `• ${color}` : ''} • Qty: {item.quantity}</p>
                                  <p className="text-[10px] font-mono font-bold text-[#D4AF37]">LKR {(item.unitPrice || 0).toLocaleString()}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Live Delivery Tracker Bar */}
                        <div className="pt-3 border-t border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-300">
                              Status: <strong className="text-[#D4AF37] uppercase">{order.orderStatus}</strong>
                            </span>
                            {order.trackingLink && (
                              <a
                                href={order.trackingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>Track via {order.courierName || 'Pronto Express'}</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>

                          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] uppercase font-bold text-slate-500">
                            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => (
                              <div key={step} className="space-y-1">
                                <div className={`h-1.5 rounded-full ${stepNum >= idx + 1 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                                <span className={stepNum >= idx + 1 ? 'text-white' : 'text-slate-600'}>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: PROFILE & DELIVERY ADDRESS */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="bg-[#0E1017] border border-white/10 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl">
                <div>
                  <h3 className="text-base font-black uppercase text-white font-syne tracking-wider">
                    PERSONAL & DELIVERY PROFILE
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Update your contact information and primary Sri Lanka delivery destination for 1-click checkout.
                  </p>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Email Address (Account Linked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#131520]/50 border border-white/5 rounded-[2px] p-3 text-xs font-mono text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 block uppercase">
                      Mobile Number (For Delivery SMS)
                    </label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Address Fields */}
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-heading flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#D4AF37]" />
                    <span>Primary Delivery Address</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                        Address Line 1 (Street & House No.)
                      </label>
                      <input
                        type="text"
                        required
                        value={editAddress.addressLine1}
                        onChange={(e) => setEditAddress({ ...editAddress, addressLine1: e.target.value })}
                        placeholder="No. 45, Galle Road"
                        className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                        Address Line 2 (Apartment / Suite / Landmark)
                      </label>
                      <input
                        type="text"
                        value={editAddress.addressLine2 || ''}
                        onChange={(e) => setEditAddress({ ...editAddress, addressLine2: e.target.value })}
                        placeholder="Floor 4, Apartment 4B (Optional)"
                        className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={editAddress.city}
                          onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                          placeholder="Colombo 03"
                          className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                          District / Province
                        </label>
                        <select
                          value={editAddress.district}
                          onChange={(e) => setEditAddress({ ...editAddress, district: e.target.value })}
                          className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none cursor-pointer"
                        >
                          <option value="Western Province">Western Province (Colombo, Gampaha, Kalutara)</option>
                          <option value="Central Province">Central Province (Kandy, Matale, Nuwara Eliya)</option>
                          <option value="Southern Province">Southern Province (Galle, Matara, Hambantota)</option>
                          <option value="North Western Province">North Western Province (Kurunegala, Puttalam)</option>
                          <option value="Sabaragamuwa Province">Sabaragamuwa Province (Ratnapura, Kegalle)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          value={editAddress.postalCode}
                          onChange={(e) => setEditAddress({ ...editAddress, postalCode: e.target.value })}
                          placeholder="00300"
                          className="w-full bg-[#131520] border border-white/15 focus:border-[#D4AF37] rounded-[2px] p-3 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                  >
                    <Check size={16} />
                    <span>{isSavingProfile ? 'SAVING CHANGES...' : 'SAVE PROFILE CHANGES'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
            <div className="bg-[#0E1017] border border-white/15 w-full max-w-2xl rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">ORDER INVOICE</span>
                  <h3 className="text-lg font-black font-syne text-white uppercase">
                    {selectedOrderDetails.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono"
                >
                  Close
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-white/5">
                {selectedOrderDetails.items.map((it: any, idx: number) => {
                  const img = it.customization?.finalPreviewDataUrl || it.imageUrl || it.product?.images?.[0] || '';
                  const name = it.productName || it.product?.name || 'Garment';
                  const size = it.size || it.selectedSize || 'M';
                  const color = it.color || it.selectedColor || '';

                  return (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        {img && <img src={img} alt="" className="w-10 h-12 object-cover rounded bg-[#141620]" />}
                        <div>
                          <p className="font-bold text-white">{name}</p>
                          <p className="text-[10px] text-slate-400">Size: {size} {color ? `• ${color}` : ''} • Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-white">LKR {((it.unitPrice || 0) * (it.quantity || 1)).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              {/* Financial Totals */}
              <div className="bg-[#141620] p-4 rounded space-y-2 text-xs font-mono text-slate-300 border border-white/5">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong>LKR {selectedOrderDetails.subtotal.toLocaleString()}</strong>
                </div>
                {selectedOrderDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <strong>- LKR {selectedOrderDetails.discountAmount.toLocaleString()}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <strong>{selectedOrderDetails.shippingCharge === 0 ? 'FREE' : `LKR ${selectedOrderDetails.shippingCharge}`}</strong>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                  <span>TOTAL PAID:</span>
                  <span className="text-[#D4AF37]">LKR {selectedOrderDetails.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping info */}
              <div className="text-xs font-mono text-slate-400 space-y-1">
                <p><strong className="text-white">Shipping To:</strong> {selectedOrderDetails.customerInfo.fullName}, {selectedOrderDetails.customerInfo.addressLine1}, {selectedOrderDetails.customerInfo.city}</p>
                <p><strong className="text-white">Contact Phone:</strong> {selectedOrderDetails.customerInfo.phone}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
