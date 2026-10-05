import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography as MuiTypography } from '@mui/material';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <MuiBreadcrumbs 
      separator={<ChevronRight size={12} className="text-slate-600" />} 
      aria-label="breadcrumb"
      className={`text-xs font-mono text-slate-400 ${className}`}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        if (isLast) {
          return (
            <MuiTypography key={idx} className="text-white font-semibold truncate uppercase tracking-wider text-xs font-mono">
              {item.label}
            </MuiTypography>
          );
        }

        if (item.href) {
          return (
            <MuiLink
              key={idx}
              href={item.href}
              underline="none"
              className="hover:text-[#D4AF37] text-slate-400 transition-colors uppercase tracking-wider text-xs font-mono"
            >
              {item.label}
            </MuiLink>
          );
        }

        return (
          <MuiLink
            key={idx}
            component="button"
            underline="none"
            onClick={item.onClick}
            className="hover:text-[#D4AF37] text-slate-400 transition-colors uppercase tracking-wider font-mono text-xs"
          >
            {item.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
};
