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
    <div className={`flex flex-col ${alignContainer} mb-10 sm:mb-14 max-w-3xl ${isCenter ? 'mx-auto' : ''} ${className}`}>
      {/* Eyebrow Tag */}
      {eyebrow && (
        <span className="text-[#D4AF37] text-xs font-mono font-bold tracking-[0.3em] uppercase block mb-3.5">
          {eyebrow}
        </span>
      )}

      {/* Main Headline with Generous Line Height */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.18] sm:leading-[1.2] max-w-3xl">
        {title}
      </h2>

      {/* Subtitle with Proper Spacing */}
      {subtitle && (
        <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed font-normal">
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
