import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';
import { EmptyState } from '../ui/EmptyState';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Box, Typography, Button, IconButton, LinearProgress, InputBase, Grid } from '@mui/material';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    products,
    setSelectedProduct,
    addToCart
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const FREE_SHIPPING_LIMIT = 10000;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_LIMIT) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleProceedCheckout = () => {
    window.location.hash = '#/checkout';
  };

  // Recommended pieces
  const cartProductIds = cart.map((c) => c.productId);
  const recommendedDrops = products
    .filter((p) => !cartProductIds.includes(p.id))
    .slice(0, 4);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'var(--bg-main)', py: { xs: 4, sm: 6 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>

        {/* Breadcrumb Hierarchy */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', mb: 3 }}>
          <Box component="a" href="#/" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Home</Box>
          <ChevronRight size={12} />
          <Box component="a" href="#/shop" sx={{ color: 'var(--text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--text-primary)' }, transition: 'color 0.3s' }}>Shop</Box>
          <ChevronRight size={12} />
          <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'primary.main', fontFamily: 'inherit' }}>Shopping Bag ({totalItemCount})</Typography>
        </Box>

        {/* Page Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 3, mb: 4, gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', letterSpacing: '0.3em', color: 'primary.main', textTransform: 'uppercase', mb: 0.5 }}>
              YOUR SELECTED PIECES
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Syne", sans-serif', letterSpacing: '-0.02em' }}>
              SHOPPING BAG
            </Typography>
          </Box>

          <Button
            href="#/shop"
            startIcon={<ArrowLeft size={14} />}
            sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
          >
            CONTINUE EXPLORING
          </Button>
        </Box>

        {/* Empty State */}
        {cart.length === 0 ? (
          <Box sx={{ py: 8, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <EmptyState
              title="YOUR SHOPPING BAG IS EMPTY"
              description="Looks like you haven't added any luxury streetwear garments or bespoke items to your bag yet."
              actionText="BROWSE LATEST DROPS"
              onAction={() => {
                window.location.hash = '#/shop';
              }}
            />

            {/* Quick Best Sellers Suggestion */}
            {recommendedDrops.length > 0 && (
              <Box sx={{ pt: 6, mt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: 1000, textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-primary)', fontFamily: '"Syne", sans-serif', mb: 3 }}>
                  TRENDING VALKNUT DROPS
                </Typography>
                <Grid container spacing={2}>
                  {recommendedDrops.map((p) => (
                    <Grid size={{ xs: 12, md: 6 }} key={p.id}>
                      <ProductCard
                        product={p}
                        onQuickView={(prod) => setSelectedProduct(prod)}
                        onAddToCart={() => {
                          const fv = p.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
                          addToCart(p, fv.size as any, fv.color, fv.colorHex, 1);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ) : (
          /* Main Cart Content: 2-Column Grid */
          <Grid container spacing={{ xs: 4, lg: 6 }} sx={{ alignItems: 'flex-start' }}>

            {/* Left Column (8 Cols): Items List & Free Shipping Meter */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Free Shipping Progress Meter */}
                <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1.5, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
                      <Truck size={16} color="#D4AF37" />
                      {cartSubtotal >= FREE_SHIPPING_LIMIT ? (
                        <Box component="span" sx={{ color: 'success.main' }}>YOU QUALIFY FOR FREE ISLANDWIDE SHIPPING!</Box>
                      ) : (
                        <Box component="span">
                          Add <Box component="strong" sx={{ color: 'primary.main' }}>LKR {(FREE_SHIPPING_LIMIT - cartSubtotal).toLocaleString()}</Box> more for FREE Shipping!
                        </Box>
                      )}
                    </Box>
                    <Box component="span" sx={{ color: 'var(--text-secondary)', fontWeight: 'normal', display: { xs: 'none', sm: 'inline' } }}>
                      Target: LKR {FREE_SHIPPING_LIMIT.toLocaleString()}
                    </Box>
                  </Box>

                  <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(to right, #D4AF37, #E2B714)', borderRadius: 4 } }} />
                </Box>

                {/* Items List Card */}
                <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                  {cart.map((item, idx) => (
                    <Box key={item.id} sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, alignItems: { sm: 'center' }, justifyContent: 'space-between', borderBottom: idx < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>

                      {/* Item Thumbnail & Basic Info */}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <Box
                          component="a"
                          href={`#/product/${item.product.slug}`}
                          sx={{ width: { xs: 80, sm: 96 }, height: { xs: 96, sm: 112 }, borderRadius: 1, overflow: 'hidden', bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, position: 'relative', display: 'block', '&:hover img': { transform: 'scale(1.05)' } }}
                        >
                          <Box
                            component="img"
                            src={item.customization?.finalPreviewDataUrl || item.product.images[0]}
                            alt={item.product.name}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', letterSpacing: '0.1em', color: 'primary.main', textTransform: 'uppercase' }}>
                            {item.product.subCategory}
                          </Typography>

                          <Typography
                            component="a"
                            href={`#/product/${item.product.slug}`}
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: '"Syne", sans-serif', textDecoration: 'none', transition: 'color 0.3s', '&:hover': { color: 'primary.main' }, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {item.product.name}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                            <Typography sx={{ fontSize: 'inherit' }}>Size: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.selectedSize}</Box></Typography>
                            <Typography sx={{ fontSize: 'inherit' }}>•</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: 'inherit' }}>Colour: <Box component="strong" sx={{ color: 'var(--text-primary)' }}>{item.selectedColor}</Box></Typography>
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', bgcolor: item.selectedColorHex }} />
                            </Box>
                          </Box>

                          {/* Custom Studio Label */}
                          {item.customization && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 1, color: 'primary.main', fontFamily: '"JetBrains Mono", sans-serif' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', fontSize: '0.6875rem' }}>
                                <Sparkles size={12} />
                                <Typography sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Bespoke: {item.customization.printTechnique} ({item.customization.placement.replace('_', ' ')})</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, color: 'var(--text-secondary)', fontSize: '0.625rem', mt: 0.5 }}>
                                {item.customization.customText && <Typography sx={{ fontSize: 'inherit' }}>Text: "{item.customization.customText}"</Typography>}
                                {item.customization.textFont && <Typography sx={{ fontSize: 'inherit' }}>Font: {item.customization.textFont}</Typography>}
                                {item.customization.uploadedArtworkUrl && <Typography sx={{ fontSize: 'inherit', color: 'success.main' }}>✓ Custom Artwork Attached</Typography>}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Quantity & Item Subtotal */}
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', width: { xs: '100%', sm: 'auto' }, gap: 2, pt: { xs: 2, sm: 0 }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', sm: 'none' } }}>
                        {/* Quantity Controller */}
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#131520', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, p: 0.25 }}>
                          <IconButton onClick={() => updateCartQuantity(item.id, -1)} sx={{ width: 28, height: 28, borderRadius: 0, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
                            <Minus size={13} />
                          </IconButton>
                          <Typography sx={{ width: 32, textAlign: 'center', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton onClick={() => updateCartQuantity(item.id, 1)} sx={{ width: 28, height: 28, borderRadius: 0, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } }}>
                            <Plus size={13} />
                          </IconButton>
                        </Box>

                        {/* Total and Trash */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 900, fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-primary)' }}>
                              LKR {(item.unitPrice * item.quantity).toLocaleString()}
                            </Typography>
                            {item.quantity > 1 && (
                              <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>
                                LKR {item.unitPrice.toLocaleString()} each
                              </Typography>
                            )}
                          </Box>

                          <IconButton onClick={() => removeFromCart(item.id)} sx={{ p: 1, color: 'var(--text-secondary)', '&:hover': { color: 'error.main', bgcolor: 'rgba(255,255,255,0.05)' }, borderRadius: 1 }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </Box>

                    </Box>
                  ))}
                </Box>

                {/* Trust Features Bar */}
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>
                      <Truck size={16} color="#D4AF37" />
                      <Typography sx={{ fontSize: 'inherit' }}>Fast 2-3 Day Colombo Delivery</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>
                      <ShieldCheck size={16} color="#D4AF37" />
                      <Typography sx={{ fontSize: 'inherit' }}>100% Guaranteed Heavy Cotton</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={16} color="#D4AF37" />
                      <Typography sx={{ fontSize: 'inherit' }}>7-Day Hassle-Free Exchange</Typography>
                    </Box>
                  </Grid>
                </Grid>

              </Box>
            </Grid>

            {/* Right Column (4 Cols): Order Summary & Checkout Panel */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ position: { lg: 'sticky' }, top: { lg: 112 } }}>
              <Box sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: { xs: 3, sm: 4 }, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-primary)', fontFamily: '"Syne", sans-serif', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                  ORDER SUMMARY
                </Typography>

                {/* Promo Code Applicator */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    PROMO CODE
                  </Typography>

                  {appliedCoupon ? (
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'success.main', fontFamily: '"JetBrains Mono", sans-serif' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                        <Tag size={14} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>'{appliedCoupon.code}' APPLIED</Typography>
                      </Box>
                      <Button
                        onClick={removeCoupon}
                        sx={{ fontSize: '0.75rem', color: 'error.main', fontWeight: 'bold', minWidth: 'auto', p: 0, '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={handleApplyCoupon} sx={{ display: 'flex', gap: 1 }}>
                      <InputBase
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="e.g. VALKNUT10"
                        sx={{ flex: 1, bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1, px: 2, py: 1, color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', '& input::placeholder': { color: 'var(--text-secondary)', textTransform: 'none' }, '&.Mui-focused': { borderColor: 'primary.main' } }}
                      />
                      <Button
                        type="submit"
                        sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                      >
                        Apply
                      </Button>
                    </Box>
                  )}

                  {couponMsg && (
                    <Typography sx={{ fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", sans-serif', color: couponMsg.isError ? 'error.main' : 'success.main' }}>
                      {couponMsg.text}
                    </Typography>
                  )}
                </Box>

                {/* Price Breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Bag Subtotal:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'var(--text-primary)' }}>LKR {cartSubtotal.toLocaleString()}</Typography>
                  </Box>

                  {cartDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                      <Typography sx={{ fontSize: 'inherit' }}>Discount Coupon:</Typography>
                      <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>- LKR {cartDiscount.toLocaleString()}</Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Estimated Shipping:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: cartShipping === 0 ? 'success.main' : 'white' }}>
                      {cartShipping === 0 ? 'FREE' : `LKR ${cartShipping.toLocaleString()}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"Syne", sans-serif', color: 'var(--text-primary)' }}>ESTIMATED TOTAL:</Typography>
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 900, color: 'primary.main', fontFamily: '"JetBrains Mono", sans-serif' }}>LKR {cartTotal.toLocaleString()}</Typography>
                  </Box>
                </Box>

                {/* Checkout CTA */}
                <Button
                  onClick={handleProceedCheckout}
                  endIcon={<ArrowRight size={16} />}
                  sx={{ width: '100%', py: 2, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 1, boxShadow: '0 4px 20px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(212,175,55,0.3)' } }}
                >
                  PROCEED TO CHECKOUT
                </Button>

                {/* Payment Options Supported */}
                <Box sx={{ pt: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    ACCEPTED PAYMENT GATEWAYS
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: 1, fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>
                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5 }}>Koko BNPL (3x 0%)</Box>
                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5 }}>OnePay</Box>
                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5 }}>Cash on Delivery</Box>
                  </Box>
                </Box>

              </Box>
            </Grid>

          </Grid>
        )}

      </Box>
    </Box>
  );
};
