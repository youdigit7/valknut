import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  showCloseButton = true,
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizeClasses} bg-[#0E1017] border border-white/10 rounded-[2px] shadow-2xl overflow-hidden z-10 my-8`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5 bg-[#12141E]/40">
            <div>
              {title && (
                <h3 className="text-lg font-black uppercase text-white font-syne tracking-wider">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-[2px] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
