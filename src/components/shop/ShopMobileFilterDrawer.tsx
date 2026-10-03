import React from 'react';
import { Drawer } from '../ui/Drawer';
import { ShopSidebarFilters } from './ShopSidebarFilters';
import type { FilterState } from './ShopSidebarFilters';
import { ArrowRight, RotateCcw } from 'lucide-react';

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
      isOpen={isOpen}
      onClose={onClose}
      title="FILTER & REFINE"
      subtitle="Customize your streetwear selection"
      position="left"
      width="md"
      footer={
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-[2px] text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-white/10"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#E2B714] text-black font-extrabold text-xs tracking-widest uppercase rounded-[2px] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
          >
            <span>View {matchingCount} {matchingCount === 1 ? 'Piece' : 'Pieces'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      }
    >
      <div className="py-2">
        <ShopSidebarFilters
          filters={filters}
          facets={facets}
          onChange={onChange}
          onReset={onReset}
          isMobileDrawer={true}
        />
      </div>
    </Drawer>
  );
};
