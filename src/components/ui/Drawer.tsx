import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  position?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'right',
  width = 'md',
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[width];

  const positionClasses = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 ${positionClasses} w-full ${widthClasses} bg-[#0D0E12] border-${
          position === 'right' ? 'l' : 'r'
        } border-white/10 shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#12141E]/50">
          <div>
            {title && (
              <h3 className="text-sm font-black uppercase text-white tracking-[0.2em] font-syne">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-white/10 bg-[#12141E]/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
