import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(_, page) => onPageChange(page)}
      className={className}
      sx={{
        '& .MuiPagination-ul': {
          justifyContent: 'center',
          gap: '8px',
        }
      }}
      renderItem={(item) => (
        <PaginationItem
          slots={{ previous: () => <ChevronLeft size={16} />, next: () => <ChevronRight size={16} /> }}
          {...item}
          sx={{
            margin: 0,
            width: '36px',
            height: '36px',
            minWidth: '36px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '12px',
            color: '#cbd5e1', // slate-300
            backgroundColor: '#12141E',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s',
            '&:hover': {
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: '#12141E',
            },
            '&.Mui-selected': {
              backgroundColor: '#D4AF37',
              color: 'black',
              borderColor: '#D4AF37',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              '&:hover': {
                backgroundColor: '#e2b714',
              }
            },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
            '&.MuiPaginationItem-ellipsis': {
              border: 'none',
              backgroundColor: 'transparent',
              color: '#475569', // slate-600
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
          }}
        />
      )}
    />
  );
};
