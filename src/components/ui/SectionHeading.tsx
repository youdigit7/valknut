import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  linkText,
  linkHref,
  onLinkClick,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';
  const isRight = align === 'right';

  const alignContainer = isCenter
    ? 'text-center items-center justify-center mx-auto'
    : isRight
    ? 'text-right items-end justify-end'
    : 'text-left items-start justify-between';

  return (
    <div className={`flex flex-col ${alignContainer} mb-7 sm:mb-10 lg:mb-12 max-w-3xl ${isCenter ? 'mx-auto' : ''} ${className}`}>
      {/* Eyebrow Tag */}
      {eyebrow && (
        <span className="text-[#D4AF37] text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase block mb-2 sm:mb-3">
          {eyebrow}
        </span>
      )}

      {/* Main Headline with Responsive Fluid Sizing */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.14] sm:leading-[1.18] max-w-3xl break-words">
        {title}
      </h2>

      {/* Subtitle with Adaptive Padding */}
      {subtitle && (
        <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2.5 sm:mt-3.5 max-w-2xl leading-relaxed font-normal">
          {subtitle}
        </p>
      )}

      {/* Action Link */}
      {linkText && (linkHref || onLinkClick) && (
        <div className={`mt-5 ${isCenter ? 'flex justify-center' : ''}`}>
          <a
            href={linkHref || '#'}
            onClick={(e) => {
              if (onLinkClick) {
                e.preventDefault();
                onLinkClick();
              }
            }}
            className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-extrabold tracking-[0.2em] uppercase underline underline-offset-8 hover:text-[#E2B714] transition-all group py-1"
          >
            <span>{linkText}</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 font-mono">→</span>
          </a>
        </div>
      )}
    </div>
  );
};
