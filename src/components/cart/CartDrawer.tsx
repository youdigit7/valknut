import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Truck 
} from 'lucide-react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  LinearProgress
} from '@mui/material';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    window.location.hash = '#/checkout';
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100vw', sm: '400px', md: '450px' },
          bgcolor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          backgroundImage: 'none',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
          <ShoppingBag color="#d4af37" size={22} />
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Syne, sans-serif' }}>
            YOUR SHOPPING BAG
          </Typography>
          <Box sx={{ bgcolor: '#d4af37', color: 'black', px: 1, py: 0.25, borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </Box>
        </Box>
        <IconButton onClick={() => setIsCartOpen(false)} sx={{ color: 'grey.500', '&:hover': { color: 'var(--text-primary)' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Free Shipping Progress Indicator */}
      <Box sx={{ bgcolor: '#141620', px: 3, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {cartSubtotal >= 10000 ? (
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Truck size={15} />
            CONGRATULATIONS! YOU QUALIFY FOR FREE ISLANDWIDE SHIPPING
          </Typography>
        ) : (
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', color: 'grey.300', fontWeight: 600, mb: 1 }}>
              Add <strong style={{ color: '#d4af37' }}>LKR {(10000 - cartSubtotal).toLocaleString()}</strong> more for FREE Shipping!
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (cartSubtotal / 10000) * 100)} 
              sx={{ 
                height: 6, 
                borderRadius: 3, 
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(to right, #d4af37, #e2b714)'
                }
              }} 
            />
          </Box>
        )}
      </Box>

      {/* Cart Item List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        {cart.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500' }}>
              <ShoppingBag size={28} />
            </Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'grey.300' }}>Your shopping bag is currently empty.</Typography>
            <Button 
              variant="contained" 
              onClick={() => setIsCartOpen(false)}
              sx={{ 
                bgcolor: '#d4af37', 
                color: 'black', 
                fontWeight: 'bold', 
                '&:hover': { bgcolor: '#b5952f' },
                px: 4, py: 1.5,
                borderRadius: 1
              }}
            >
              START SHOPPING
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, pt: index > 0 ? 2 : 0, mt: index > 0 ? 2 : 0, borderTop: index > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <Box 
                  component="img" 
                  src={item.customization?.finalPreviewDataUrl || item.product.images[0]}
                  alt={item.product.name}
                  sx={{ width: 80, height: 96, objectFit: 'cover', borderRadius: 1, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.product.name}
                      </Typography>
                      <IconButton onClick={() => removeFromCart(item.id)} sx={{ p: 0.5, color: 'grey.500', '&:hover': { color: '#f87171' } }}>
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '0.6875rem', color: 'grey.400', mt: 0.5 }}>
                      Size: <strong style={{ color: 'var(--text-primary)' }}>{item.selectedSize}</strong> | Colour: <strong style={{ color: 'var(--text-primary)' }}>{item.selectedColor}</strong>
                    </Typography>
                    {item.customization && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 1, color: '#D4AF37', fontFamily: 'monospace' }}>
                        <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Sparkles size={11} /> Bespoke: {item.customization.printTechnique}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'grey.300', fontSize: '0.5625rem', mt: 0.5 }}>
                          <Typography component="span">Zone: {item.customization.placement.replace('_', ' ')}</Typography>
                          {item.customization.customText && <Typography component="span" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>"{item.customization.customText}"</Typography>}
                        </Box>
                        {item.customization.uploadedArtworkUrl && (
                          <Typography sx={{ fontSize: '0.5625rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 0.5, pt: 0.5 }}>
                            ✓ Custom Graphic Uploaded
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
                      <IconButton onClick={() => updateCartQuantity(item.id, -1)} sx={{ width: 24, height: 24, p: 0, color: 'var(--text-primary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>-</Typography></IconButton>
                      <Typography sx={{ width: 28, textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.quantity}</Typography>
                      <IconButton onClick={() => updateCartQuantity(item.id, 1)} sx={{ width: 24, height: 24, p: 0, color: 'var(--text-primary)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>+</Typography></IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      LKR {(item.unitPrice * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer & Checkout Area */}
      {cart.length > 0 && (
        <Box sx={{ p: 3, bgcolor: '#08090d', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          
          {/* Coupon Form */}
          <Box sx={{ mb: 2 }}>
            {appliedCoupon ? (
              <Box sx={{ p: 1.5, bgcolor: 'rgba(2, 44, 34, 0.4)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                  <Tag size={14} /> COUPON APPLIED: '{appliedCoupon.code}'
                </Typography>
                <Button onClick={removeCoupon} sx={{ minWidth: 0, p: 0, fontSize: '0.75rem', color: '#f87171', fontWeight: 'bold', textTransform: 'none', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}>
                  Remove
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleApplyCoupon} sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  fullWidth
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon Code (e.g. VALKNUT10)"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: '#141620', 
                      color: 'var(--text-primary)', 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'grey.500',
                      opacity: 1
                    }
                  }}
                />
                <Button type="submit" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 'bold', '&:hover': { borderColor: '#d4af37', color: '#d4af37' } }}>
                  Apply
                </Button>
              </Box>
            )}
            {couponError && <Typography sx={{ fontSize: '0.6875rem', color: '#f87171', mt: 0.5, fontWeight: 600 }}>{couponError}</Typography>}
          </Box>

          {/* Price Totals Summary */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: 'grey.300' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 'inherit' }}>Subtotal:</Typography>
              <Typography sx={{ fontSize: 'inherit', fontWeight: 600, color: 'var(--text-primary)' }}>LKR {cartSubtotal.toLocaleString()}</Typography>
            </Box>
            {cartDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                <Typography sx={{ fontSize: 'inherit' }}>Discount:</Typography>
                <Typography sx={{ fontSize: 'inherit', fontWeight: 600 }}>- LKR {cartDiscount.toLocaleString()}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 'inherit' }}>Estimated Shipping:</Typography>
              <Typography sx={{ fontSize: 'inherit', fontWeight: 600, color: 'var(--text-primary)' }}>
                {cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, mt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>TOTAL:</Typography>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, color: '#d4af37' }}>LKR {cartTotal.toLocaleString()}</Typography>
            </Box>
          </Box>

          {/* Action Buttons: Proceed to Checkout & View Bag */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleProceedToCheckout}
              sx={{
                bgcolor: '#d4af37',
                color: 'black',
                py: 1.5,
                fontWeight: 800,
                fontSize: '0.75rem',
                boxShadow: '0 4px 14px 0 rgba(212,175,55,0.3)',
                '&:hover': { bgcolor: '#b5952f', boxShadow: '0 6px 20px rgba(212,175,55,0.4)' }
              }}
              endIcon={<ArrowRight size={16} />}
            >
              PROCEED TO CHECKOUT
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setIsCartOpen(false);
                window.location.hash = '#/cart';
              }}
              sx={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'grey.300',
                py: 1.25,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--text-primary)' }
              }}
            >
              VIEW FULL SHOPPING BAG
            </Button>
          </Box>

        </Box>
      )}
    </Drawer>
  );
};
