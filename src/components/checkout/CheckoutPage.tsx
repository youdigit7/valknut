import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import type { PaymentGateway, ShippingAddress, Order } from '../../types/ecommerce';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Tag, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  User
} from 'lucide-react';
import { Box, Typography, Button, Grid, TextField, MenuItem, CircularProgress, InputBase, FormControlLabel, Checkbox } from '@mui/material';
import { registerCustomer } from '../../services/authService';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingMethodId,
    setShippingMethodId,
    availableShippingMethods,
    createOrder,
    user,
    setIsAccountOpen,
    setUserProfile
  } = useStore();

  const [step, setStep] = useState<'CHECKOUT' | 'CONFIRMATION'>('CHECKOUT');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  // Guest Account Creation Option
  const [createAccountWithOrder, setCreateAccountWithOrder] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+94771234567');
  const [addressLine1, setAddressLine1] = useState(user?.address?.addressLine1 || 'No. 88, Galle Road');
  const [addressLine2, setAddressLine2] = useState(user?.address?.addressLine2 || '');
  const [city, setCity] = useState(user?.address?.city || 'Colombo 03');
  const [district, setDistrict] = useState(user?.address?.district || 'Colombo');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '00300');
  
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('Koko');
  const [notes, setNotes] = useState('');

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (user.phone && phone === '+94771234567') setPhone(user.phone);
      if (user.address) {
        setAddressLine1(user.address.addressLine1);
        if (user.address.addressLine2) setAddressLine2(user.address.addressLine2);
        setCity(user.address.city);
        setDistrict(user.address.district);
        setPostalCode(user.address.postalCode);
      }
    }
  }, [user]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) return setFormError('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setFormError('Please enter a valid email address.');
    if (!phone.trim() || phone.trim().length < 9) return setFormError('Please enter a valid mobile number for SMS tracking.');
    if (!addressLine1.trim()) return setFormError('Please enter your street address.');
    if (!city.trim()) return setFormError('Please enter your delivery city.');
    if (cart.length === 0) return setFormError('Your shopping bag is empty.');

    setIsSubmitting(true);

    const shippingInfo: ShippingAddress = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      district: district.trim(),
      postalCode: postalCode.trim()
    };

    try {
      const order = await createOrder(shippingInfo, paymentGateway, notes, shippingMethodId);
      setPlacedOrder(order);

      // Auto-register customer if opted in
      if (!user && createAccountWithOrder && accountPassword.trim().length >= 6) {
        try {
          const authRes = await registerCustomer(
            shippingInfo.email,
            accountPassword.trim(),
            shippingInfo.fullName,
            shippingInfo.phone,
            shippingInfo
          );
          if (authRes.success && authRes.user) {
            setUserProfile(authRes.user);
          }
        } catch (e) {
          console.warn('Account registration notice:', e);
        }
      }

      setStep('CONFIRMATION');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#FFFFFF', '#A38025', '#FFDF00']
        });
      } catch (err) {}
    } catch (err: any) {
      setFormError(err?.message || 'Order creation failed. Please check your inventory or payment details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (placedOrder) {
      navigator.clipboard.writeText(placedOrder.orderNumber);
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2000);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-primary)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      bgcolor: '#141620',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    },
    '& .MuiInputLabel-root': { color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' }
  };

  if (step === 'CONFIRMATION' && placedOrder) {
    return (
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3, lg: 4 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4, animation: 'fadeIn 0.5s ease-out' }}>
          
          <Box sx={{ textAlign: 'center', bgcolor: 'var(--bg-surface)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 2, p: { xs: 4, sm: 6 }, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -48, right: -48, width: 160, height: 160, bgcolor: 'rgba(212,175,55,0.05)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', border: '2px solid #D4AF37', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', boxShadow: '0 10px 25px rgba(212,175,55,0.1)', animation: 'bounce 2s infinite' }}>
              <CheckCircle2 size={44} />
            </Box>

            <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase', mt: 3, mb: 1 }}>
              VALKNUT ORDER CONFIRMED
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em', mb: 2 }}>
              THANK YOU FOR YOUR ORDER
            </Typography>
            <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 400, mx: 'auto' }}>
              Your dark luxury garments are locked and being prepared for high-precision dispatch.
            </Typography>

            <Box sx={{ pt: 4, maxWidth: 320, mx: 'auto' }}>
              <Box sx={{ p: 1.5, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ORDER NUMBER</Typography>
                  <Typography sx={{ fontSize: '1.125rem', fontFamily: '"Inter", sans-serif', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{placedOrder.orderNumber}</Typography>
                </Box>
                <Button onClick={handleCopyOrderNumber} sx={{ minWidth: 'auto', px: 1.5, py: 1, bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' } }}>
                  {copiedOrderNum ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <Typography sx={{ ml: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>{copiedOrderNum ? 'COPIED' : 'COPY'}</Typography>
                </Button>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 1, display: 'flex', alignItems: 'flex-start', gap: 1.5, color: 'success.light' }}>
                <Phone size={20} style={{ marginTop: 2, color: '#34d399' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SMS Dispatched</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(52,211,153,0.8)' }}>Real-time status updates scheduled to {placedOrder.customerInfo.phone}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 1, display: 'flex', alignItems: 'flex-start', gap: 1.5, color: '#7dd3fc' }}>
                <Mail size={20} style={{ marginTop: 2, color: '#38bdf8' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Tax Invoice Dispatched</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(56,189,248,0.8)' }}>Official order receipt sent to {placedOrder.customerInfo.email}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'primary.main' }}>DELIVERY DESTINATION</Typography>
                <Box sx={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: 'inherit' }}>{placedOrder.customerInfo.fullName}</Typography>
                  <Typography sx={{ fontSize: 'inherit' }}>{placedOrder.customerInfo.addressLine1}</Typography>
                  {placedOrder.customerInfo.addressLine2 && <Typography sx={{ fontSize: 'inherit' }}>{placedOrder.customerInfo.addressLine2}</Typography>}
                  <Typography sx={{ fontSize: 'inherit' }}>{placedOrder.customerInfo.city}, {placedOrder.customerInfo.district} {placedOrder.customerInfo.postalCode}</Typography>
                  <Typography sx={{ fontSize: 'inherit', color: 'rgba(255,255,255,0.4)', mt: 1 }}>Tel: {placedOrder.customerInfo.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'primary.main' }}>SHIPPING & PAYMENT</Typography>
                <Box sx={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Shipping Method:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{placedOrder.shippingInfo.shippingMethodName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Estimated Arrival:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'success.main' }}>{placedOrder.shippingInfo.estimatedDays}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Payment Gateway:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{placedOrder.paymentGateway}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Payment Status:</Typography>
                    <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', px: 1, py: 0.25, borderRadius: 1, ...(placedOrder.paymentStatus === 'PAID' ? { bgcolor: 'rgba(16,185,129,0.1)', color: 'success.main', border: '1px solid rgba(16,185,129,0.4)' } : { bgcolor: 'rgba(245,158,11,0.1)', color: 'warning.main', border: '1px solid rgba(245,158,11,0.4)' }) }}>{placedOrder.paymentStatus}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Order Status:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'primary.main' }}>{placedOrder.orderStatus}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'primary.main', fontFamily: '"Inter", sans-serif' }}>PURCHASED PIECES (HISTORICAL SNAPSHOT)</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {placedOrder.items.map((item, idx) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 2, borderBottom: idx < placedOrder.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box component="img" src={item.imageUrl} alt={item.productName} sx={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>{item.productName}</Typography>
                        <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>SKU: {item.sku} | Size: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.size}</Box> | Color: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.color}</Box></Typography>
                        {item.customization && (
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>Bespoke: {item.customization.printTechnique}</Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right', fontFamily: '"Inter", sans-serif' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>LKR {item.subtotal.toLocaleString()}</Typography>
                      <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>{item.quantity} x LKR {item.unitPrice.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Subtotal:</Typography>
                  <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)' }}>LKR {placedOrder.subtotal.toLocaleString()}</Typography>
                </Box>
                {placedOrder.discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Coupon Discount ({placedOrder.couponCode}):</Typography>
                    <Typography sx={{ fontSize: 'inherit' }}>- LKR {placedOrder.discountAmount.toLocaleString()}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Shipping Fee:</Typography>
                  <Typography sx={{ fontSize: 'inherit', color: placedOrder.shippingCharge === 0 ? 'success.main' : 'white' }}>{placedOrder.shippingCharge === 0 ? 'FREE' : `LKR ${placedOrder.shippingCharge.toLocaleString()}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>TOTAL PAID:</Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'primary.main' }}>LKR {placedOrder.totalAmount.toLocaleString()}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button href={`#/track-order?order=${placedOrder.orderNumber}`} startIcon={<Package size={16} />} sx={{ flex: 1, py: 2, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
              TRACK ORDER STATUS
            </Button>
            <Button href="#/account/orders" endIcon={<ArrowRight size={16} />} sx={{ flex: 1, py: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              VIEW IN MY ACCOUNT
            </Button>
            <Button href="#/shop" sx={{ flex: 1, py: 2, color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
              CONTINUE SHOPPING
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 4, sm: 6 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 3 }}>
          <Box component="a" href="#/" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Home</Box>
          <ChevronRight size={12} />
          <Box component="a" href="#/cart" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Bag</Box>
          <ChevronRight size={12} />
          <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'primary.main', fontFamily: 'inherit' }}>Secure Checkout</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 3, mb: 4, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Lock size={14} color="#D4AF37" />
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase' }}>
                256-BIT ENCRYPTED EXPRESS CHECKOUT
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.02em' }}>
              VALKNUT OFFICIAL CHECKOUT
            </Typography>
          </Box>

          <Button href="#/cart" startIcon={<ArrowLeft size={14} />} sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}>
            RETURN TO SHOPPING BAG
          </Button>
        </Box>

        {cart.length === 0 ? (
          <Box sx={{ py: 10, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Package size={40} color="rgba(255,255,255,0.4)" />
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>Your Shopping Bag Is Empty</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Please add some items to your bag before proceeding to checkout.</Typography>
            <Button href="#/shop" sx={{ mt: 2, py: 1.5, px: 4, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
              BROWSE VALKNUT COLLECTION
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handlePlaceOrder} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: { xs: 4, xl: 6 }, alignItems: 'flex-start' }}>
            
            {/* LEFT COLUMN */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {formError && (
                <Box sx={{ p: 2, bgcolor: 'rgba(153,27,27,0.4)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.light', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
                  <AlertCircle size={18} color="#f87171" />
                  <Typography sx={{ fontSize: 'inherit' }}>{formError}</Typography>
                </Box>
              )}

              {/* GUEST SIGN-IN ENCOURAGEMENT BANNER */}
              {!user && (
                <Box sx={{ p: 2, bgcolor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="#D4AF37" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ALREADY A VALKNUT MEMBER?
                      </Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        Sign in to autofill your saved delivery address & track live courier dispatches.
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    onClick={() => setIsAccountOpen(true)}
                    sx={{ px: 2.5, py: 0.75, fontSize: '0.6875rem', fontWeight: 900, color: 'black', bgcolor: '#D4AF37', borderRadius: 1, '&:hover': { bgcolor: '#E2B714' } }}
                  >
                    SIGN IN
                  </Button>
                </Box>
              )}

              {/* SECTION 1: CUSTOMER INFORMATION */}
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'black', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>1</Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>CUSTOMER INFORMATION</Typography>
                  </Box>
                  {user && (
                    <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'success.main', bgcolor: 'rgba(16,185,129,0.1)', px: 1, py: 0.25, borderRadius: 0.5, border: '1px solid rgba(16,185,129,0.3)' }}>LOGGED IN: {user.name}</Typography>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth required label="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Kasun Perera" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth required type="email" label="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kasun@example.com" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth required type="tel" label="Contact Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567" variant="outlined" sx={textFieldStyles} helperText="Pronto Lanka & Fargo Express courier drivers will contact this number before delivering." slotProps={{ formHelperText: { sx: {} } }} />
                  </Grid>

                  {!user && (
                    <Grid size={12}>
                      <Box sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={createAccountWithOrder} 
                              onChange={(e) => setCreateAccountWithOrder(e.target.checked)} 
                              sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} 
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                              Create a VALKNUT Member Account with this order (save address & track dispatch)
                            </Typography>
                          }
                        />
                        {createAccountWithOrder && (
                          <Box sx={{ mt: 1.5, maxWidth: 360 }}>
                            <TextField
                              fullWidth
                              required
                              type="password"
                              label="Create Account Password *"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              placeholder="••••••••••••"
                              variant="outlined"
                              sx={textFieldStyles}
                              helperText="Minimum 6 characters. You will be automatically logged in."
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* SECTION 2: DELIVERY ADDRESS */}
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'black', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>2</Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>ISLANDWIDE DELIVERY ADDRESS</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField fullWidth required label="Street Address / House No. *" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="No. 88, Galle Road, Apt 4B" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Apartment / Suite / Landmark (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Opposite Cinnamon Grand / Near Majestic City" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth required label="City / Town *" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo 03" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select fullWidth label="District *" value={district} onChange={(e) => setDistrict(e.target.value)} variant="outlined" sx={textFieldStyles}>
                      {SRI_LANKAN_DISTRICTS.map((d) => (
                        <MenuItem key={d} value={d} sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>{d} District</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00300" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Delivery Instructions (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Leave with building security if unavailable" variant="outlined" sx={textFieldStyles} />
                  </Grid>
                </Grid>
              </Box>

              {/* SECTION 5: SHIPPING METHOD */}
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'black', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>3</Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>SHIPPING METHOD</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>ISLANDWIDE COVERAGE</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {availableShippingMethods.map((method) => {
                    const isSelected = shippingMethodId === method.id;
                    const isFree = method.freeShippingThreshold > 0 && cartSubtotal >= method.freeShippingThreshold;
                    const fee = isFree ? 0 : method.baseCharge;

                    return (
                      <Box
                        key={method.id}
                        onClick={() => setShippingMethodId(method.id)}
                        sx={{ p: 2, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2, ...(isSelected ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.1)', color: 'var(--text-primary)', boxShadow: '0 4px 15px rgba(212,175,55,0.1)' } : { borderColor: 'rgba(255,255,255,0.1)', bgcolor: '#141620', color: 'var(--text-secondary)', '&:hover': { borderColor: 'rgba(255,255,255,0.25)' } }) }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <input type="radio" checked={isSelected} readOnly style={{ accentColor: '#d4af37', marginTop: 4 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif', color: 'var(--text-primary)' }}>{method.name}</Typography>
                              {method.id === 'express' && (
                                <Typography sx={{ fontSize: '0.5625rem', bgcolor: 'primary.main', color: 'black', fontWeight: 900, px: 1, py: 0.25, borderRadius: 0.5, fontFamily: '"Inter", sans-serif' }}>VIP PRIORITY</Typography>
                              )}
                            </Box>
                            <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>{method.description}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main', pt: 0.5 }}>
                              <Clock size={12} />
                              <Typography sx={{ fontSize: 'inherit' }}>Estimated SLA: {method.estimatedDays}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', pl: { xs: 4, sm: 0 }, textAlign: { sm: 'right' } }}>
                          {isFree ? <Box component="span" sx={{ color: 'success.main', fontWeight: 900, textTransform: 'uppercase' }}>FREE DELIVERY</Box> : <Box component="span" sx={{ color: 'var(--text-primary)' }}>LKR {fee.toLocaleString()}</Box>}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* SECTION 8: PAYMENT METHOD */}
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'black', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif' }}>4</Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>PAYMENT METHOD</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>
                    <ShieldCheck size={13} />
                    <Typography sx={{ fontSize: 'inherit' }}>PLUGGABLE GATEWAYS</Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {/* Koko BNPL */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box onClick={() => setPaymentGateway('Koko')} sx={{ p: 2, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'Koko' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)', boxShadow: '0 4px 15px rgba(212,175,55,0.1)' } : { borderColor: 'rgba(255,255,255,0.1)', bgcolor: '#141620', color: 'var(--text-secondary)', '&:hover': { borderColor: 'rgba(255,255,255,0.25)' } }) }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: 'primary.main', fontFamily: '"Inter", sans-serif' }}>KOKO PAY</Typography>
                          <Typography sx={{ fontSize: '0.5625rem', bgcolor: 'primary.main', color: 'black', px: 1, py: 0.25, borderRadius: 0.5, fontWeight: 900, fontFamily: '"Inter", sans-serif' }}>3X 0% INTEREST</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'Koko' ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Split into 3 monthly installments of <Box component="strong" sx={{ color: 'var(--text-primary)' }}>LKR {Math.round(cartTotal / 3).toLocaleString()}</Box> with Debit/Credit card.</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* OnePay Sri Lanka IPG */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box onClick={() => setPaymentGateway('OnePay')} sx={{ p: 2, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'OnePay' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)', boxShadow: '0 4px 15px rgba(212,175,55,0.1)' } : { borderColor: 'rgba(255,255,255,0.1)', bgcolor: '#141620', color: 'var(--text-secondary)', '&:hover': { borderColor: 'rgba(255,255,255,0.25)' } }) }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#38bdf8', fontFamily: '"Inter", sans-serif' }}>ONEPAY DIRECT</Typography>
                          <Typography sx={{ fontSize: '0.5625rem', bgcolor: '#0ea5e9', color: 'black', px: 1, py: 0.25, borderRadius: 0.5, fontWeight: 900, fontFamily: '"Inter", sans-serif' }}>LOCAL IPG</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'OnePay' ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Direct Internet Banking, LankaQR, and local Sri Lankan Visa/Mastercard processing.</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* eWAY Global Card Gateway */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box onClick={() => setPaymentGateway('eWAY')} sx={{ p: 2, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'eWAY' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)', boxShadow: '0 4px 15px rgba(212,175,55,0.1)' } : { borderColor: 'rgba(255,255,255,0.1)', bgcolor: '#141620', color: 'var(--text-secondary)', '&:hover': { borderColor: 'rgba(255,255,255,0.25)' } }) }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#fbbf24', fontFamily: '"Inter", sans-serif' }}>eWAY GLOBAL</Typography>
                          <CreditCard size={14} color="#fbbf24" />
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'eWAY' ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>International Visa, Mastercard, AMEX Credit / Debit Cards with 3D-Secure 2.0.</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Cash on Delivery */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box onClick={() => setPaymentGateway('Cash on Delivery')} sx={{ p: 2, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'Cash on Delivery' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)', boxShadow: '0 4px 15px rgba(212,175,55,0.1)' } : { borderColor: 'rgba(255,255,255,0.1)', bgcolor: '#141620', color: 'var(--text-secondary)', '&:hover': { borderColor: 'rgba(255,255,255,0.25)' } }) }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#34d399', fontFamily: '"Inter", sans-serif' }}>CASH ON DELIVERY</Typography>
                          <Truck size={14} color="#34d399" />
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'Cash on Delivery' ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>Pay cash directly to the courier agent upon doorstep parcel delivery.</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

            </Box>

            {/* RIGHT COLUMN */}
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 112 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* ORDER SUMMARY CARD */}
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>ORDER SUMMARY</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>{cart.reduce((a, b) => a + b.quantity, 0)} ITEMS</Typography>
                </Box>

                {/* Items List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 280, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {cart.map((item, idx) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, pb: 1.5, borderBottom: idx < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box component="img" src={item.customization?.finalPreviewDataUrl || item.product.images[0]} alt={item.product.name} sx={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', }}>{item.product.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                            <Typography sx={{ fontSize: 'inherit' }}>Size: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.selectedSize}</Box></Typography>
                            <Typography sx={{ fontSize: 'inherit' }}>•</Typography>
                            <Typography sx={{ fontSize: 'inherit' }}>Color: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.selectedColor}</Box></Typography>
                            <Typography sx={{ fontSize: 'inherit' }}>•</Typography>
                            <Typography sx={{ fontSize: 'inherit' }}>Qty: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.quantity}</Box></Typography>
                          </Box>
                          {item.customization && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.5625rem', fontFamily: '"Inter", sans-serif', color: 'primary.main' }}>
                              <Sparkles size={10} />
                              <Typography sx={{ fontSize: 'inherit' }}>Custom: {item.customization.printTechnique}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', fontFamily: '"Inter", sans-serif', flexShrink: 0 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>LKR {(item.unitPrice * item.quantity).toLocaleString()}</Typography>
                        {item.quantity > 1 && (
                          <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>@{item.unitPrice.toLocaleString()}</Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* SECTION 7: PROMO CODE APPLICATOR */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 'bold' }}>PROMO CODE</Typography>
                  {appliedCoupon ? (
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'success.main', fontFamily: '"Inter", sans-serif' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                        <Tag size={14} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>'{appliedCoupon.code}' APPLIED</Typography>
                      </Box>
                      <Button onClick={removeCoupon} sx={{ minWidth: 'auto', p: 0, fontSize: '0.75rem', color: 'error.main', fontWeight: 'bold', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}>Remove</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <InputBase value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="e.g. VALKNUT10" sx={{ flex: 1, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, px: 2, py: 1, color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', '& input::placeholder': { color: 'var(--text-secondary)', textTransform: 'none' }, '&.Mui-focused': { borderColor: 'primary.main' } }} />
                      <Button onClick={handleApplyCoupon} sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold', borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>Apply</Button>
                    </Box>
                  )}
                  {couponMsg && (
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"Inter", sans-serif', color: couponMsg.isError ? 'error.main' : 'success.main' }}>{couponMsg.text}</Typography>
                  )}
                </Box>

                {/* SECTION 9: FINAL AMOUNT BREAKDOWN */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Bag Subtotal:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>LKR {cartSubtotal.toLocaleString()}</Typography>
                  </Box>
                  {cartDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography sx={{ fontSize: 'inherit' }}>Discount Coupon ({appliedCoupon?.code}):</Typography>
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>- LKR {cartDiscount.toLocaleString()}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Shipping Fee ({shippingMethodId === 'standard' ? 'Standard' : 'VIP Express'}):</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: cartShipping === 0 ? 'success.main' : 'white' }}>{cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif', color: 'var(--text-primary)' }}>FINAL TOTAL:</Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'primary.main', fontFamily: '"Inter", sans-serif' }}>LKR {cartTotal.toLocaleString()}</Typography>
                  </Box>
                </Box>

                {/* SECTION 10: PLACE ORDER CTA */}
                <Button type="submit" disabled={isSubmitting || cart.length === 0} sx={{ width: '100%', py: 2, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, boxShadow: '0 10px 25px rgba(212,175,55,0.3)', transition: 'all 0.3s ease', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' }, '&.Mui-disabled': { opacity: 0.5, pointerEvents: 'none' } }}>
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: '"Inter", sans-serif' }}>
                      <CircularProgress size={16} sx={{ color: 'black' }} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>LOCKING INVENTORY & AUTHORIZING...</Typography>
                    </Box>
                  ) : (
                    <>
                      <Lock size={16} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: '"Inter", sans-serif' }}>PLACE ORDER (LKR {cartTotal.toLocaleString()})</Typography>
                    </>
                  )}
                </Button>

                {/* Security Guarantee */}
                <Box sx={{ pt: 1, textAlign: 'center', fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <ShieldCheck size={14} color="#D4AF37" />
                    <Typography sx={{ fontSize: 'inherit' }}>Bank-Grade SSL Security • Direct Courier Handoff</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 'inherit' }}>All items undergo stringent QC at Colombo Headquarters before dispatch.</Typography>
                </Box>

              </Box>
            </Box>

          </Box>
        )}

      </Box>
    </Box>
  );
};
