import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  XCircle,
  Lock
} from 'lucide-react';
import type { Order } from '../../types/ecommerce';

interface OnePaySandboxModalProps {
  open: boolean;
  order: Order | null;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export const OnePaySandboxModal: React.FC<OnePaySandboxModalProps> = ({
  open,
  order,
  onSuccess,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'lankaqr' | 'banking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) return null;

  const handleSimulatePayment = (status: 'SUCCESS' | 'FAIL') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (status === 'SUCCESS') {
        const txnId = `ONEPAY-SANDBOX-TXN-${Date.now()}`;
        onSuccess(txnId);
      } else {
        onCancel();
      }
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#0e1117',
            color: '#ffffff',
            borderRadius: 3,
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            overflow: 'hidden'
          }
        }
      }}
    >
      {/* Top Header - OnePay Brand Identity */}
      <Box sx={{ bgcolor: '#0B2545', p: 3, pb: 2.5, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                bgcolor: '#00B4D8',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.9rem',
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              OnePay<span style={{ color: '#FFD166' }}>.</span>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#90E0EF', fontWeight: 600 }}>
              Payment Gateway
            </Typography>
          </Box>
          <Chip
            label="SANDBOX TEST MODE"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 209, 102, 0.2)',
              color: '#FFD166',
              fontWeight: 800,
              fontSize: '0.625rem',
              letterSpacing: '0.08em',
              border: '1px solid rgba(255, 209, 102, 0.4)'
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#CAF0F8' }}>
          Merchant: <strong style={{ color: '#ffffff' }}>VALKNUT Official (Pvt) Ltd</strong>
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#CAF0F8' }}>
          Ref: <span style={{ fontFamily: 'monospace', color: '#FFD166' }}>{order.orderNumber}</span>
        </Typography>

        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#90E0EF' }}>
            Amount Due
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            LKR {order.totalAmount.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="info" sx={{ bgcolor: 'rgba(0, 180, 216, 0.1)', color: '#90E0EF', border: '1px solid rgba(0, 180, 216, 0.3)', mb: 2.5, '& .MuiAlert-icon': { color: '#00B4D8' }, fontSize: '0.75rem' }}>
          <strong>OnePay Testing Simulator:</strong> You can test approval and rejection scenarios before charging real money on your approved live account.
        </Alert>

        {/* Payment Channels Tabs */}
        <Typography sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', mb: 1, fontWeight: 700 }}>
          Simulated Payment Channel
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
          <Box
            onClick={() => setSelectedMethod('card')}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: selectedMethod === 'card' ? '#00B4D8' : 'rgba(255,255,255,0.1)',
              bgcolor: selectedMethod === 'card' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <CreditCard size={20} style={{ margin: '0 auto 6px', color: selectedMethod === 'card' ? '#00B4D8' : '#888' }} />
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>Card</Typography>
          </Box>

          <Box
            onClick={() => setSelectedMethod('lankaqr')}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: selectedMethod === 'lankaqr' ? '#00B4D8' : 'rgba(255,255,255,0.1)',
              bgcolor: selectedMethod === 'lankaqr' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <QrCode size={20} style={{ margin: '0 auto 6px', color: selectedMethod === 'lankaqr' ? '#00B4D8' : '#888' }} />
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>LankaQR</Typography>
          </Box>

          <Box
            onClick={() => setSelectedMethod('banking')}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: selectedMethod === 'banking' ? '#00B4D8' : 'rgba(255,255,255,0.1)',
              bgcolor: selectedMethod === 'banking' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={20} style={{ margin: '0 auto 6px', color: selectedMethod === 'banking' ? '#00B4D8' : '#888' }} />
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>Online Bank</Typography>
          </Box>
        </Box>

        {/* Selected Channel Details */}
        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)', mb: 3 }}>
          {selectedMethod === 'card' && (
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#CAF0F8', mb: 0.5 }}>
                Test Visa / Mastercard:
              </Typography>
              <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#FFD166', letterSpacing: '0.1em' }}>
                4000 0000 0000 0001
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                Exp: 12/28 | CVV: 123 | 3D-Secure: Automated Sandbox Auth
              </Typography>
            </Box>
          )}

          {selectedMethod === 'lankaqr' && (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#CAF0F8', mb: 1 }}>
                LankaQR Instant Payment:
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
                Simulating scan from Commercial Bank Q+ / Frimi / Genie / iPay
              </Typography>
            </Box>
          )}

          {selectedMethod === 'banking' && (
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#CAF0F8', mb: 0.5 }}>
                Direct CEFT / Internet Banking:
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)' }}>
                Direct debit connection to Bank of Ceylon, Sampath, or HNB test node.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Security badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'rgba(255,255,255,0.4)', mb: 3, fontSize: '0.6875rem' }}>
          <Lock size={12} />
          <span>256-Bit SSL Encrypted | OnePay Verified</span>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment('SUCCESS')}
            sx={{
              bgcolor: '#00B4D8',
              color: '#000000',
              fontWeight: 800,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.8125rem',
              letterSpacing: '0.05em',
              py: 1.5,
              '&:hover': { bgcolor: '#90E0EF' },
              display: 'flex',
              gap: 1
            }}
          >
            {isProcessing ? (
              <CircularProgress size={18} sx={{ color: '#000000' }} />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>CONFIRM & SIMULATE SUCCESSFUL PAYMENT</span>
              </>
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment('FAIL')}
            sx={{
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.75rem',
              py: 1,
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }
            }}
          >
            <XCircle size={14} style={{ marginRight: 6 }} />
            Simulate Payment Cancellation / Decline
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
