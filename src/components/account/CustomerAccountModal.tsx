import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types/ecommerce';
import { 
  X, 
  User, 
  Package, 
  ExternalLink, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { Modal, Backdrop, Fade, Box, Typography, IconButton, Button, TextField } from '@mui/material';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    setIsAccountOpen, 
    user, 
    loginUser, 
    logoutUser, 
    orders, 
    setIsAdminOpen 
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PROFILE'>('ORDERS');

  if (!isAccountOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginUser(emailInput, nameInput || 'VALKNUT Customer');
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
      color: 'white',
      fontFamily: '"JetBrains Mono", sans-serif',
      fontSize: '0.75rem',
      bgcolor: '#141620',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
    },
    '& .MuiInputLabel-root': { color: 'text.secondary', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif' },
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
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 768, maxHeight: '90vh', bgcolor: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', outline: 'none' }}>
          
          {/* Header */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#08090d', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <User color="#d4af37" size={22} />
              <Box>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Syne", sans-serif' }}>
                  VALKNUT CUSTOMER PORTAL
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontFamily: '"JetBrains Mono", sans-serif' }}>
                  {user ? `Logged in as ${user.name}` : 'Sign in to view orders & saved address'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsAccountOpen(false)} sx={{ color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Modal Body */}
          {!user ? (
            /* LOGIN FORM */
            <Box sx={{ p: { xs: 3, sm: 4 }, maxWidth: 400, mx: 'auto', w: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'primary.main', mb: 0.5, fontFamily: '"JetBrains Mono", sans-serif' }}>
                  ACCESS YOUR ACCOUNT
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', fontFamily: '"Syne", sans-serif' }}>
                  SIGN IN / REGISTER
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField fullWidth required label="Full Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="e.g. Kasun Perera" variant="outlined" sx={textFieldStyles} />
                <TextField fullWidth required type="email" label="Email Address" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="kasun@example.com" variant="outlined" sx={textFieldStyles} />
                <Button type="submit" sx={{ mt: 1, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' } }}>
                  SIGN IN TO ACCOUNT
                </Button>
              </Box>
            </Box>
          ) : (
            /* LOGGED IN PORTAL */
            <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto', maxHeight: 'calc(90vh - 77px)', display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Navigation Tabs */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => setActiveTab('ORDERS')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', ...(activeTab === 'ORDERS' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }) }}
                  >
                    ORDER HISTORY ({userOrders.length})
                  </Button>
                  <Button
                    onClick={() => setActiveTab('PROFILE')}
                    sx={{ px: 2, py: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"JetBrains Mono", sans-serif', textTransform: 'uppercase', ...(activeTab === 'PROFILE' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: 'white' } }) }}
                  >
                    PROFILE DETAILS
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.isAdmin && (
                    <Button
                      onClick={() => { setIsAccountOpen(false); setIsAdminOpen(true); }}
                      startIcon={<ShieldCheck size={14} />}
                      sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"JetBrains Mono", sans-serif', color: 'primary.main', '&:hover': { bgcolor: 'rgba(212,175,55,0.2)' } }}
                    >
                      OPEN ADMIN
                    </Button>
                  )}
                  <Button
                    onClick={logoutUser}
                    startIcon={<LogOut size={14} />}
                    sx={{ px: 1.5, py: 0.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold', fontFamily: '"JetBrains Mono", sans-serif', color: 'text.secondary', '&:hover': { bgcolor: 'rgba(153,27,27,0.4)', color: 'error.light' } }}
                  >
                    Sign Out
                  </Button>
                </Box>
              </Box>

              {/* Orders Tab View */}
              {activeTab === 'ORDERS' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {userOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <Package color="rgba(255,255,255,0.4)" size={32} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'text.secondary', fontFamily: '"JetBrains Mono", sans-serif' }}>No orders found under your account.</Typography>
                    </Box>
                  ) : (
                    userOrders.map(order => {
                      const stepNum = getStatusStep(order.orderStatus);

                      return (
                        <Box key={order.id} sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          
                          {/* Top Summary Bar */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'primary.main', fontFamily: '"JetBrains Mono", sans-serif' }}>{order.orderNumber}</Typography>
                              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontFamily: '"JetBrains Mono", sans-serif' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: 'white', fontFamily: '"JetBrains Mono", sans-serif' }}>LKR {order.totalAmount.toLocaleString()}</Typography>
                              <Typography sx={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", sans-serif' }}>{order.paymentGateway} ({order.paymentStatus})</Typography>
                            </Box>
                          </Box>

                          {/* Order Items Breakdown */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {order.items.map((ci: any, idx: number) => {
                              const img = ci.customization?.finalPreviewDataUrl || ci.imageUrl || ci.product?.images?.[0] || '';
                              const name = ci.productName || ci.product?.name || 'VALKNUT Piece';
                              const size = ci.size || ci.selectedSize || 'M';

                              return (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem' }}>
                                  {img ? (
                                    <Box component="img" src={img} alt={name} sx={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 1, bgcolor: '#141620' }} />
                                  ) : (
                                    <Box sx={{ width: 40, height: 48, bgcolor: '#141620', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5625rem', fontFamily: '"JetBrains Mono", sans-serif' }}>VK</Box>
                                  )}
                                  <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 'bold', color: 'white', textTransform: 'uppercase', fontFamily: '"Syne", sans-serif' }}>{name}</Typography>
                                    <Typography sx={{ fontSize: '0.625rem', color: 'text.secondary', fontFamily: '"JetBrains Mono", sans-serif' }}>Size: {size} | Qty: {ci.quantity}</Typography>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>

                          {/* Live Tracking Progress Timeline */}
                          <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, fontSize: '0.6875rem', fontWeight: 'bold', fontFamily: '"JetBrains Mono", sans-serif', color: 'text.secondary' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: 'inherit' }}>SHIPPING STATUS:</Typography>
                                <Typography sx={{ fontSize: 'inherit', color: 'primary.main', textTransform: 'uppercase' }}>{order.orderStatus}</Typography>
                              </Box>
                              {order.awbNumber && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.625rem' }}>
                                  <Typography sx={{ fontSize: 'inherit' }}>AWB:</Typography>
                                  <Typography sx={{ fontSize: 'inherit', color: 'white' }}>{order.awbNumber}</Typography>
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
                                    <Box sx={{ height: 6, borderRadius: 3, mb: 0.5, bgcolor: isCompleted ? 'primary.main' : 'rgba(255,255,255,0.1)' }} />
                                    <Typography sx={{ fontSize: '0.5625rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: '"JetBrains Mono", sans-serif', color: isCompleted ? 'white' : 'text.secondary' }}>{stName}</Typography>
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
                                  sx={{ minWidth: 'auto', p: 0, fontSize: '0.75rem', fontWeight: 'bold', color: 'primary.main', fontFamily: '"JetBrains Mono", sans-serif', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
                                >
                                  Track with {order.courierName || 'Courier'}
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

              {/* Profile Tab View */}
              {activeTab === 'PROFILE' && (
                <Box sx={{ bgcolor: '#141620', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Name:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'white' }}>{user.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Email:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'white' }}>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 1.5 }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Phone:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'white' }}>{user.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 'inherit' }}>Role:</Typography>
                    <Typography sx={{ fontSize: 'inherit', fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>{user.isAdmin ? 'Store Admin & Owner' : 'VALKNUT VIP Member'}</Typography>
                  </Box>
                </Box>
              )}

            </Box>
          )}

        </Box>
      </Fade>
    </Modal>
  );
};
