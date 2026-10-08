import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'CM' | 'INCHES'>('CM');
  const [activeTab, setActiveTab] = useState<'MEN' | 'WOMEN'>('MEN');

  const menSizes = [
    { size: 'S', chestCm: '106-112', lengthCm: '72', shoulderCm: '54', chestIn: '42-44', lengthIn: '28.3', shoulderIn: '21.2' },
    { size: 'M', chestCm: '114-120', lengthCm: '74', shoulderCm: '56', chestIn: '45-47', lengthIn: '29.1', shoulderIn: '22.0' },
    { size: 'L', chestCm: '122-128', lengthCm: '76', shoulderCm: '58', chestIn: '48-50', lengthIn: '29.9', shoulderIn: '22.8' },
    { size: 'XL', chestCm: '130-136', lengthCm: '78', shoulderCm: '60', chestIn: '51-53', lengthIn: '30.7', shoulderIn: '23.6' },
    { size: 'XXL', chestCm: '138-144', lengthCm: '80', shoulderCm: '62', chestIn: '54-56', lengthIn: '31.5', shoulderIn: '24.4' }
  ];

  const womenSizes = [
    { size: 'S', chestCm: '94-98', lengthCm: '46', shoulderCm: '42', chestIn: '37-38.5', lengthIn: '18.1', shoulderIn: '16.5' },
    { size: 'M', chestCm: '100-104', lengthCm: '48', shoulderCm: '44', chestIn: '39-41', lengthIn: '18.9', shoulderIn: '17.3' },
    { size: 'L', chestCm: '106-110', lengthCm: '50', shoulderCm: '46', chestIn: '41.5-43', lengthIn: '19.7', shoulderIn: '18.1' }
  ];

  const currentData = activeTab === 'MEN' ? menSizes : womenSizes;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 672, bgcolor: 'var(--bg-surface)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 2, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', p: 4, outline: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Ruler color="#d4af37" size={24} />
              <Box>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Syne", sans-serif' }}>
                  VALKNUT OFFICIAL SIZE GUIDE
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: '"JetBrains Mono", sans-serif' }}>Architectural Heavyweight Fit & Sizing Matrix</Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'var(--text-secondary)', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Tab & Unit Controls */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setActiveTab('MEN')}
                sx={{
                  px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 1, fontFamily: '"JetBrains Mono", sans-serif',
                  ...(activeTab === 'MEN' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                MEN / UNISEX FIT
              </Button>
              <Button
                onClick={() => setActiveTab('WOMEN')}
                sx={{
                  px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: 1, fontFamily: '"JetBrains Mono", sans-serif',
                  ...(activeTab === 'WOMEN' ? { bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                WOMEN'S FIT
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setUnit('CM')}
                sx={{
                  px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', borderRadius: 1, fontFamily: '"JetBrains Mono", sans-serif', minWidth: 'auto',
                  ...(unit === 'CM' ? { bgcolor: 'var(--text-primary)', color: 'black', '&:hover': { bgcolor: '#f1f5f9' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                CM
              </Button>
              <Button
                onClick={() => setUnit('INCHES')}
                sx={{
                  px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 'bold', borderRadius: 1, fontFamily: '"JetBrains Mono", sans-serif', minWidth: 'auto',
                  ...(unit === 'INCHES' ? { bgcolor: 'var(--text-primary)', color: 'black', '&:hover': { bgcolor: '#f1f5f9' } } : { color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)' } })
                }}
              >
                INCHES
              </Button>
            </Box>
          </Box>

          {/* Size Table */}
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, backgroundImage: 'none' }}>
            <Table sx={{ minWidth: 500 }} aria-label="size chart table">
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>Size</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>Chest ({unit})</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>Length ({unit})</TableCell>
                  <TableCell sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: 'none' }}>Shoulder ({unit})</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow key={row.size} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }, transition: 'background-color 0.3s' }}>
                    <TableCell sx={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.size}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{unit === 'CM' ? row.chestCm : row.chestIn}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{unit === 'CM' ? row.lengthCm : row.lengthIn}</TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{unit === 'CM' ? row.shoulderCm : row.shoulderIn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Measuring Tip */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-primary)', mb: 0.5, fontFamily: '"JetBrains Mono", sans-serif' }}>FIT NOTE:</Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"JetBrains Mono", sans-serif' }}>
              VALKNUT tops are cut in our signature signature relaxed/oversized drop-shoulder profile. 
              If you prefer a closer tailored fit, we recommend selecting one size down.
            </Typography>
          </Box>

        </Box>
      </Fade>
    </Modal>
  );
};
