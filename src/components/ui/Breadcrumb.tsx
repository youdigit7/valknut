import React from 'react';
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
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-xs font-mono text-slate-400 ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />}
            {isLast ? (
              <span className="text-white font-semibold truncate uppercase tracking-wider">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="hover:text-[#D4AF37] transition-colors uppercase tracking-wider"
              >
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="hover:text-[#D4AF37] transition-colors uppercase tracking-wider"
              >
                {item.label}
              </button>
            ) : (
              <span className="uppercase tracking-wider">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
