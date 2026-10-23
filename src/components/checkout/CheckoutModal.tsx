import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { PaymentGateway, ShippingAddress, Order } from '../../types/ecommerce';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Lock, 
  MessageSquare, 
  Mail, 
  ArrowLeft,
  Package
} from 'lucide-react';
import { Modal, Backdrop, Fade, Box, Typography, IconButton, Grid, TextField, MenuItem, Button } from '@mui/material';

const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal,
    appliedCoupon,
    shippingMethodId,
    setShippingMethodId,
    availableShippingMethods,
    createOrder,
    user
  } = useStore();

  const [step, setStep] = useState<'FORM' | 'CONFIRMATION'>('FORM');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+94771234567');
  const [addressLine1, setAddressLine1] = useState('No. 88, Galle Road');
  const [city, setCity] = useState('Colombo 03');
  const [district, setDistrict] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00300');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('Koko');
  const [notes, setNotes] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const shippingInfo: ShippingAddress = {
      fullName, email, phone, addressLine1, city, district, postalCode
    };

    try {
      const order = await createOrder(shippingInfo, paymentGateway, notes, shippingMethodId);
      setPlacedOrder(order);
      setStep('CONFIRMATION');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFFFFF', '#A38025']
        });
      } catch (err) {
        // ignore if canvas-confetti fails
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Order failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('FORM');
    setPlacedOrder(null);
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

  return (
    <Modal
      open={isCheckoutOpen}
      onClose={handleClose}
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
      <Fade in={isCheckoutOpen}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 900, maxHeight: '95vh', bgcolor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 2, boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', outline: 'none' }}>
          
          {/* Header */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Lock color="#d4af37" size={20} />
              <Box>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Outfit", sans-serif' }}>
                  {step === 'FORM' ? 'VALKNUT EXPRESS CHECKOUT' : 'ORDER CONFIRMED'}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>
                  256-Bit SSL Encrypted Payment Gateway
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: 'var(--text-secondary)', bgcolor: 'var(--border-subtle)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'var(--border-strong)' } }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Modal Body */}
          {step === 'FORM' ? (
            <Box component="form" onSubmit={handleSubmitOrder} sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto', maxHeight: 'calc(95vh - 77px)', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
              
              {/* Left Column: Customer & Delivery Details */}
              <Box sx={{ flex: 7, display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Error Notice */}
                {errorMsg && (
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(153,27,27,0.4)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 1, color: 'error.light', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
                    {errorMsg}
                  </Box>
                )}

                {/* 1. Contact Information */}
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2, fontFamily: '"Inter", sans-serif' }}>
                    1. CUSTOMER CONTACT INFORMATION
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth required label="Full Name" value={fullName || ''} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Kasun Perera" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth required type="tel" label="Mobile Phone" value={phone || ''} onChange={(e) => setPhone(e.target.value)} placeholder="+94771234567" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth required type="email" label="Email Address" value={email || ''} onChange={(e) => setEmail(e.target.value)} placeholder="kasun@example.com" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                  </Grid>
                </Box>

                {/* 2. Delivery Address */}
                <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2, fontFamily: '"Inter", sans-serif' }}>
                    2. ISLANDWIDE SHIPPING ADDRESS
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField fullWidth required label="Street Address" value={addressLine1 || ''} onChange={(e) => setAddressLine1(e.target.value)} placeholder="House No., Street Name, Apartment" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth required label="City" value={city || ''} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField select fullWidth label="District" value={district || 'Colombo'} onChange={(e) => setDistrict(e.target.value || 'Colombo')} variant="outlined" size="small" sx={textFieldStyles}>
                        {SRI_LANKAN_DISTRICTS.map((d) => (
                          <MenuItem key={d} value={d} sx={{ fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>{d}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Postal Code" value={postalCode || ''} onChange={(e) => setPostalCode(e.target.value)} placeholder="00300" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth label="Delivery Notes (Optional)" value={notes || ''} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Near commercial bank, call before delivery" variant="outlined" size="small" sx={textFieldStyles} />
                    </Grid>
                  </Grid>
                </Box>

                {/* 3. Shipping Method Selector */}
                <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2, fontFamily: '"Inter", sans-serif' }}>
                    3. SELECT SHIPPING METHOD
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {availableShippingMethods.map((method) => {
                      const isSelected = shippingMethodId === method.id;
                      const isFree = method.freeShippingThreshold > 0 && cartSubtotal >= method.freeShippingThreshold;
                      const fee = isFree ? 0 : method.baseCharge;

                      return (
                        <Box
                          key={method.id}
                          onClick={() => setShippingMethodId(method.id)}
                          sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...(isSelected ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-card)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } }) }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <input type="radio" checked={isSelected} readOnly style={{ accentColor: '#d4af37' }} />
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{method.name}</Typography>
                                {method.id === 'express' && (
                                  <Typography sx={{ fontSize: '0.5rem', bgcolor: 'primary.main', color: '#000000', px: 0.5, py: 0.25, borderRadius: 0.5, fontWeight: 900, fontFamily: '"Inter", sans-serif' }}>VIP PRIORITY</Typography>
                                )}
                              </Box>
                              <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: isSelected ? 'rgba(255,255,255,0.7)' : 'inherit' }}>{method.estimatedDays}</Typography>
                            </Box>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>
                            {isFree ? <Box component="span" sx={{ color: 'success.main' }}>FREE</Box> : `LKR ${fee.toLocaleString()}`}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* 4. Payment Gateway Selection */}
                {/* 4. Payment Gateway Selection */}
                <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2, fontFamily: '"Inter", sans-serif' }}>
                    4. SELECT PAYMENT METHOD
                  </Typography>
                  <Grid container spacing={1.5}>
                    {/* Koko Option */}
                    <Grid size={12}>
                      <Box onClick={() => setPaymentGateway('Koko')} sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'Koko' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-card)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } }) }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: 'primary.main' }}>KOKO PAY</Typography>
                            <Typography sx={{ fontSize: '0.5625rem', bgcolor: 'primary.main', color: '#000000', px: 0.5, py: 0.25, borderRadius: 0.5, fontWeight: 900 }}>3 PAY</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'Koko' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Pay in 3 interest-free monthly installments of LKR {Math.round(cartTotal / 3).toLocaleString()}.</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* OnePay Option */}
                    <Grid size={12}>
                      <Box onClick={() => setPaymentGateway('OnePay')} sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'OnePay' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-card)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } }) }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#38bdf8' }}>ONEPAY</Typography>
                            <Typography sx={{ fontSize: '0.5625rem', bgcolor: '#0ea5e9', color: '#000000', px: 0.5, py: 0.25, borderRadius: 0.5, fontWeight: 900 }}>INSTANT</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'OnePay' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Direct Sri Lankan Internet Banking & Wallet Gateway.</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* eWAY Option */}
                    <Grid size={12}>
                      <Box onClick={() => setPaymentGateway('eWAY')} sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'eWAY' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-card)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } }) }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#fbbf24' }}>eWAY / CARD</Typography>
                            <CreditCard size={14} color="#fbbf24" />
                          </Box>
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'eWAY' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Visa, Mastercard, AMEX Credit / Debit Cards.</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* COD Option */}
                    <Grid size={12}>
                      <Box onClick={() => setPaymentGateway('Cash on Delivery')} sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...(paymentGateway === 'Cash on Delivery' ? { borderColor: 'primary.main', bgcolor: 'rgba(212,175,55,0.15)', color: 'var(--text-primary)' } : { borderColor: 'var(--border-subtle)', bgcolor: 'var(--bg-card)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--border-strong)' } }) }}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#34d399' }}>CASH ON DELIVERY</Typography>
                            <Truck size={14} color="#34d399" />
                          </Box>
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"Inter", sans-serif', color: paymentGateway === 'Cash on Delivery' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Pay cash directly upon courier delivery.</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Right Column: Order Summary & Pay Button */}
              <Box sx={{ flex: 5, bgcolor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 2, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2, pb: 1, borderBottom: '1px solid var(--border-subtle)', fontFamily: '"Inter", sans-serif' }}>
                    ORDER SUMMARY ({cart.length} ITEMS)
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 220, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                    {cart.map(item => (
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem' }}>
                        <Box component="img" src={item.product.images[0]} alt={item.product.name} sx={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 'bold', color: 'var(--text-primary)',  fontFamily: '"Outfit", sans-serif' }}>{item.product.name}</Typography>
                          <Typography sx={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>Size: {item.selectedSize} | Qty: {item.quantity}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' }}>LKR {(item.unitPrice * item.quantity).toLocaleString()}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Price Breakdown */}
                  <Box sx={{ borderTop: '1px solid var(--border-subtle)', pt: 2, mt: 2, display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', color: 'var(--text-secondary)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 'inherit' }}>Subtotal:</Typography>
                      <Typography sx={{ fontSize: 'inherit', color: 'var(--text-primary)' }}>LKR {cartSubtotal.toLocaleString()}</Typography>
                    </Box>

                    {cartDiscount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                        <Typography sx={{ fontSize: 'inherit' }}>Discount ({appliedCoupon?.code}):</Typography>
                        <Typography sx={{ fontSize: 'inherit' }}>- LKR {cartDiscount.toLocaleString()}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 'inherit' }}>Islandwide Delivery ({shippingMethodId === 'standard' ? 'Standard' : 'VIP Express'}):</Typography>
                      <Typography sx={{ fontSize: 'inherit', color: cartShipping === 0 ? 'success.main' : 'var(--text-primary)' }}>{cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 1, borderTop: '1px solid var(--border-subtle)' }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif' }}>TOTAL AMOUNT:</Typography>
                      <Typography sx={{ fontSize: '1.25rem', color: 'primary.main', fontWeight: 900, fontFamily: '"Inter", sans-serif' }}>LKR {cartTotal.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Submit CTA Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  sx={{ width: '100%', py: 2, bgcolor: 'primary.main', color: '#000000', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, boxShadow: '0 10px 25px rgba(212,175,55,0.3)', transition: 'all 0.3s ease', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' }, '&.Mui-disabled': { opacity: 0.5, pointerEvents: 'none' } }}
                >
                  {isSubmitting ? (
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: '"Inter", sans-serif' }}>LOCKING INVENTORY & AUTHORIZING...</Typography>
                  ) : (
                    <>
                      <Lock size={16} />
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: '"Inter", sans-serif' }}>CONFIRM & PAY LKR {cartTotal.toLocaleString()} VIA {paymentGateway.toUpperCase()}</Typography>
                    </>
                  )}
                </Button>
              </Box>

            </Box>
          ) : (
            /* CONFIRMATION SCREEN */
            <Box sx={{ p: { xs: 3, sm: 6 }, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '85vh', overflowY: 'auto' }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.1)', border: '2px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', animation: 'bounce 1s infinite' }}>
                <CheckCircle size={36} />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.25em', color: 'primary.main', textTransform: 'uppercase', mb: 0.5, fontFamily: '"Inter", sans-serif' }}>
                  VALKNUT ORDER CONFIRMED
                </Typography>
                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '1.875rem' }, fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Outfit", sans-serif' }}>
                  THANK YOU FOR YOUR ORDER
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', mt: 1, fontFamily: '"Inter", sans-serif' }}>
                  Order Number: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{placedOrder?.orderNumber}</Box>
                </Typography>
              </Box>

              {/* Simulated SMS & Email Trigger Alerts */}
              <Box sx={{ maxWidth: 400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: '#6ee7b7' }}>
                  <MessageSquare size={20} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>SMS Sent to {placedOrder?.customerInfo.phone}</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: '#34d399', fontFamily: '"Inter", sans-serif' }}>Order confirmation & courier dispatch updates scheduled via SMS Gateway.</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: '#7dd3fc' }}>
                  <Mail size={20} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"Inter", sans-serif' }}>Email Receipt Dispatched</Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: '#38bdf8', fontFamily: '"Inter", sans-serif' }}>Invoice sent to {placedOrder?.customerInfo.email}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Order Details summary box */}
              <Box sx={{ bgcolor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 1, p: 2, maxWidth: 500, mx: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', pb: 1 }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Shipping Method:</Typography>
                  <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{placedOrder?.shippingInfo.shippingMethodName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', pb: 1 }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Payment Method:</Typography>
                  <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>{placedOrder?.paymentGateway}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', pb: 1 }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Total Amount Paid:</Typography>
                  <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'primary.main' }}>LKR {placedOrder?.totalAmount.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 'inherit' }}>Estimated Delivery:</Typography>
                  <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'success.main' }}>{placedOrder?.shippingInfo.estimatedDays}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center', maxWidth: 400, mx: 'auto', pt: 1, width: '100%' }}>
                <Button
                  onClick={() => {
                    handleClose();
                    window.location.hash = `#/track-order?order=${placedOrder?.orderNumber}`;
                  }}
                  sx={{ flex: 1, py: 1.5, bgcolor: 'primary.main', color: '#000000', fontWeight: 900, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, borderRadius: 1, transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}
                >
                  <Package size={15} /> TRACK ORDER
                </Button>

                <Button
                  onClick={handleClose}
                  sx={{ flex: 1, py: 1.5, bgcolor: 'var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 900, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, borderRadius: 1, transition: 'all 0.3s ease', border: '1px solid var(--border-subtle)', '&:hover': { bgcolor: 'var(--border-strong)' } }}
                >
                  <ArrowLeft size={15} /> RETURN TO STORE
                </Button>
              </Box>
            </Box>
          )}

        </Box>
      </Fade>
    </Modal>
  );
};
