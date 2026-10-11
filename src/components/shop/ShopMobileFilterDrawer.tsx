import React from 'react';
import { Drawer, Box, Button, Typography, IconButton } from '@mui/material';
import { ShopSidebarFilters } from './ShopSidebarFilters';
import type { FilterState } from './ShopSidebarFilters';
import { ArrowRight, RotateCcw, X, Filter } from 'lucide-react';

interface ShopMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  facets: any;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  matchingCount: number;
}

export const ShopMobileFilterDrawer: React.FC<ShopMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  facets,
  onChange,
  onReset,
  matchingCount
}) => {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }
        },
        paper: {
          sx: {
            width: { xs: '85vw', sm: 400 },
            bgcolor: 'var(--bg-main)',
            borderRight: '1px solid var(--border-subtle)',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'var(--bg-surface)' }}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Filter size={16} color="#D4AF37" /> FILTER & REFINE
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: '"Inter", sans-serif', mt: 0.5 }}>
            Customize your streetwear selection
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'var(--border-strong)', borderRadius: 3 } }}>
        <ShopSidebarFilters
          filters={filters}
          facets={facets}
          onChange={onChange}
          onReset={onReset}
          isMobileDrawer={true}
        />
      </Box>

      <Box sx={{ p: 3, borderTop: '1px solid var(--border-subtle)', bgcolor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          onClick={onReset}
          startIcon={<RotateCcw size={14} />}
          sx={{
            px: 3, py: 1.5, bgcolor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 1,
            color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 'bold',
            '&:hover': { bgcolor: 'var(--bg-card)', color: 'var(--text-primary)' }
          }}
        >
          RESET
        </Button>
        <Button
          onClick={onClose}
          endIcon={<ArrowRight size={14} />}
          sx={{
            flex: 1, py: 1.5, bgcolor: 'primary.main', color: 'black', fontWeight: 900, fontSize: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 1, boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
            transition: 'all 0.3s', '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' }
          }}
        >
          VIEW {matchingCount} {matchingCount === 1 ? 'PIECE' : 'PIECES'}
        </Button>
      </Box>
    </Drawer>
  );
};
