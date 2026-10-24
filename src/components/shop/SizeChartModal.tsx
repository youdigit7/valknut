import React, { useState, useEffect } from 'react';
import { X, Ruler } from 'lucide-react';
import { 
  Box, 
  Typography, 
  Modal, 
  Backdrop, 
  Fade, 
  IconButton, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory?: string;
}

type TabType = 'MEN' | 'WOMEN' | 'BOTTOMS';

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, subCategory }) => {
  const [unit, setUnit] = useState<'CM' | 'INCHES'>('CM');
  const [activeTab, setActiveTab] = useState<TabType>('MEN');

  // Auto-switch to BOTTOMS if subCategory is pants/joggers/jeans
  useEffect(() => {
    if (subCategory) {
      const lower = subCategory.toLowerCase();
      if (lower.includes('pant') || lower.includes('jogger') || lower.includes('jean')) {
        setActiveTab('BOTTOMS');
      } else {
        setActiveTab('MEN');
      }
    }
  }, [subCategory, isOpen]);

  const menSizes = [
    { size: 'XS', col1Cm: '98-104', col2Cm: '70', col3Cm: '52', col1In: '38-41', col2In: '27.5', col3In: '20.5' },
    { size: 'S', col1Cm: '106-112', col2Cm: '72', col3Cm: '54', col1In: '42-44', col2In: '28.3', col3In: '21.2' },
    { size: 'M', col1Cm: '114-120', col2Cm: '74', col3Cm: '56', col1In: '45-47', col2In: '29.1', col3In: '22.0' },
    { size: 'L', col1Cm: '122-128', col2Cm: '76', col3Cm: '58', col1In: '48-50', col2In: '29.9', col3In: '22.8' },
    { size: 'XL', col1Cm: '130-136', col2Cm: '78', col3Cm: '60', col1In: '51-53', col2In: '30.7', col3In: '23.6' },
    { size: 'XXL', col1Cm: '138-144', col2Cm: '80', col3Cm: '62', col1In: '54-56', col2In: '31.5', col3In: '24.4' },
    { size: 'XXXL', col1Cm: '146-152', col2Cm: '82', col3Cm: '64', col1In: '57-60', col2In: '32.3', col3In: '25.2' }
  ];

  const womenSizes = [
    { size: 'XS', col1Cm: '88-92', col2Cm: '44', col3Cm: '40', col1In: '34.5-36', col2In: '17.3', col3In: '15.7' },
    { size: 'S', col1Cm: '94-98', col2Cm: '46', col3Cm: '42', col1In: '37-38.5', col2In: '18.1', col3In: '16.5' },
    { size: 'M', col1Cm: '100-104', col2Cm: '48', col3Cm: '44', col1In: '39-41', col2In: '18.9', col3In: '17.3' },
    { size: 'L', col1Cm: '106-110', col2Cm: '50', col3Cm: '46', col1In: '41.5-43', col2In: '19.7', col3In: '18.1' },
    { size: 'XL', col1Cm: '112-116', col2Cm: '52', col3Cm: '48', col1In: '44-45.5', col2In: '20.5', col3In: '18.9' }
  ];

  const bottomSizes = [
    { size: 'XS', col1Cm: '68-73', col2Cm: '100', col3Cm: '73', col1In: '27-29', col2In: '39.4', col3In: '28.7' },
    { size: 'S', col1Cm: '74-78', col2Cm: '102', col3Cm: '74', col1In: '29-31', col2In: '40.1', col3In: '29.1' },
    { size: 'M', col1Cm: '79-84', col2Cm: '104', col3Cm: '75', col1In: '31-33', col2In: '40.9', col3In: '29.5' },
    { size: 'L', col1Cm: '85-90', col2Cm: '106', col3Cm: '76', col1In: '33-35', col2In: '41.7', col3In: '29.9' },
    { size: 'XL', col1Cm: '91-96', col2Cm: '108', col3Cm: '77', col1In: '36-38', col2In: '42.5', col3In: '30.3' },
    { size: 'XXL', col1Cm: '97-102', col2Cm: '110', col3Cm: '78', col1In: '38-40', col2In: '43.3', col3In: '30.7' },
    { size: 'XXXL', col1Cm: '103-108', col2Cm: '112', col3Cm: '79', col1In: '41-43', col2In: '44.1', col3In: '31.1' }
  ];

  const currentData = activeTab === 'MEN' ? menSizes : activeTab === 'WOMEN' ? womenSizes : bottomSizes;

  const colHeaders = activeTab === 'BOTTOMS' 
    ? { col1: `Waist (${unit})`, col2: `Length (${unit})`, col3: `Inseam (${unit})` }
    : { col1: `Chest (${unit})`, col2: `Length (${unit})`, col3: `Shoulder (${unit})` };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      disableRestoreFocus
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1400 }
        },
      }}
      sx={{ zIndex: 1400 }}
    >
      <Fade in={isOpen}>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '92%', 
            maxWidth: 680, 
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'var(--bg-surface)', 
            border: '1px solid rgba(212,175,55,0.4)', 
            borderRadius: 2, 
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)', 
            p: { xs: 2.5, sm: 4 }, 
            outline: 'none', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5 
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Ruler color="#d4af37" size={24} />
              <Box>
                <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1.125rem' }, fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Outfit", sans-serif' }}>
                  VALKNUT OFFICIAL SIZE GUIDE
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif' }}>Architectural Fit & Sizing Matrix</Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose} 
              aria-label="Close size guide"
              sx={{ color: 'var(--text-secondary)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* Tab & Unit Controls */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 1, border: '1px solid var(--border-subtle)', gap: 0.5, overflowX: 'auto', maxWidth: '100%' }}>
              <Button
                onClick={() => setActiveTab('MEN')}
                sx={{
                  px: { xs: 1, sm: 1.5 }, py: 0.5, fontSize: '0.6875rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 1, fontFamily: '"Inter", sans-serif', minWidth: 'auto', whiteSpace: 'nowrap',
                  ...(activeTab === 'MEN' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                Men / Unisex
              </Button>
              <Button
                onClick={() => setActiveTab('WOMEN')}
                sx={{
                  px: { xs: 1, sm: 1.5 }, py: 0.5, fontSize: '0.6875rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 1, fontFamily: '"Inter", sans-serif', minWidth: 'auto', whiteSpace: 'nowrap',
                  ...(activeTab === 'WOMEN' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                Women's Fit
              </Button>
              <Button
                onClick={() => setActiveTab('BOTTOMS')}
                sx={{
                  px: { xs: 1, sm: 1.5 }, py: 0.5, fontSize: '0.6875rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 1, fontFamily: '"Inter", sans-serif', minWidth: 'auto', whiteSpace: 'nowrap',
                  ...(activeTab === 'BOTTOMS' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                Pants & Joggers
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 1, border: '1px solid var(--border-subtle)', gap: 0.5 }}>
              <Button
                onClick={() => setUnit('CM')}
                sx={{
                  px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', borderRadius: 1, fontFamily: '"Inter", sans-serif', minWidth: 'auto',
                  ...(unit === 'CM' ? { bgcolor: 'var(--text-primary)', color: 'black', '&:hover': { bgcolor: '#f1f5f9' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                CM
              </Button>
              <Button
                onClick={() => setUnit('INCHES')}
                sx={{
                  px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', borderRadius: 1, fontFamily: '"Inter", sans-serif', minWidth: 'auto',
                  ...(unit === 'INCHES' ? { bgcolor: 'var(--text-primary)', color: 'black', '&:hover': { bgcolor: '#f1f5f9' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                INCHES
              </Button>
            </Box>
          </Box>

          {/* Size Table */}
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 1, backgroundImage: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 440 }} size="small" aria-label="size chart table">
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-subtle)' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>Size</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>{colHeaders.col1}</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>{colHeaders.col2}</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>{colHeaders.col3}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow key={row.size} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }, transition: 'background-color 0.2s' }}>
                    <TableCell sx={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 800, borderBottom: '1px solid var(--border-subtle)' }}>{row.size}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>{unit === 'CM' ? row.col1Cm : row.col1In}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>{unit === 'CM' ? row.col2Cm : row.col2In}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>{unit === 'CM' ? row.col3Cm : row.col3In}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Measuring Tip */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 1, border: '1px solid var(--border-subtle)' }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'primary.main', mb: 0.5, fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              FIT NOTE:
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"Inter", sans-serif' }}>
              VALKNUT garments are cut in our signature relaxed/oversized drop-shoulder profile. 
              If you prefer a closer tailored fit, we recommend selecting one size down.
            </Typography>
          </Box>

        </Box>
      </Fade>
    </Modal>
  );
};
