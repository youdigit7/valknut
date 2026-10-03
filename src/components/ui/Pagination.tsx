import React from 'react';
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 font-mono ${className}`}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-300 hover:text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {getPageNumbers().map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-600 text-xs">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-[2px] transition-all ${
              isCurrent
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'border border-white/10 text-slate-300 hover:text-white hover:border-white/30 bg-[#12141E]'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-[2px] text-slate-300 hover:text-white hover:border-[#D4AF37] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
