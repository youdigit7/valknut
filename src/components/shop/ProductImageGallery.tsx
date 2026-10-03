import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  Maximize2, 
  Sparkles 
} from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isCustomizable?: boolean;
  onOpenCustomStudio?: () => void;
  className?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  isCustomizable = false,
  onOpenCustomStudio,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Touch swipe handling for mobile
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  const displayImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85'];

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
  };

  return (
    <div className={`flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 ${className}`}>
      
      {/* 1. Thumbnail Strip (Desktop Vertical / Mobile Horizontal) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[560px] pb-2 lg:pb-0 scrollbar-none flex-shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-20 sm:w-20 sm:h-24 rounded-[2px] overflow-hidden bg-[#141620] flex-shrink-0 transition-all cursor-pointer relative border ${
                activeIndex === idx
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 opacity-100 shadow-md'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              {activeIndex === idx && (
                <div className="absolute inset-0 bg-[#D4AF37]/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Large Image Viewer */}
      <div className="flex-1 relative">
        <div
          className="relative aspect-[3/4] max-h-[640px] w-full bg-[#12141F] rounded-[3px] border border-white/10 overflow-hidden group select-none cursor-crosshair shadow-2xl"
          onMouseEnter={() => setIsHoverZooming(true)}
          onMouseLeave={() => setIsHoverZooming(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Main Image with Zoom Magnification */}
          <img
            src={currentImage}
            alt={`${productName} — Heavyweight Luxury Streetwear Garment View ${activeIndex + 1}`}
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full object-cover object-center transition-transform duration-200 ${
              isHoverZooming ? 'scale-150 origin-[var(--zoom-x)_var(--zoom-y)]' : 'scale-100'
            }`}
            style={{
              // @ts-ignore
              '--zoom-x': `${zoomPosition.x}%`,
              '--zoom-y': `${zoomPosition.y}%`
            }}
          />

          {/* Floating Action: Lightbox Fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3.5 right-3.5 p-2 bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white rounded-[2px] backdrop-blur-md border border-white/15 transition-all opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            title="Expand Fullscreen Gallery"
          >
            <Maximize2 size={16} />
          </button>

          {/* Custom Studio Floating Pill */}
          {isCustomizable && onOpenCustomStudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomStudio();
              }}
              className="absolute top-3.5 left-3.5 px-3 py-1.5 bg-[#0D0E15]/85 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-[2px] text-[10px] font-mono font-bold tracking-widest uppercase border border-[#D4AF37]/50 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Sparkles size={13} />
              <span>CUSTOM STUDIO READY</span>
            </button>
          )}

          {/* Hover Zoom Tip */}
          <div className="absolute bottom-3 left-3 hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-black/60 rounded-[2px] text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={12} className="text-[#D4AF37]" />
            <span>Hover to zoom • Click to expand</span>
          </div>

          {/* Mobile Swipe Indicators & Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all lg:opacity-0 lg:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all lg:opacity-0 lg:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Mobile Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:hidden bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {displayImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeIndex === idx ? 'bg-[#D4AF37] w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="w-full max-w-6xl flex items-center justify-between z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              {productName} — ({activeIndex + 1}/{displayImages.length})
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-[2px] bg-white/10 transition-colors"
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>
          </div>

          {/* Main View */}
          <div 
            className="relative max-w-5xl max-h-[78vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={productName}
              className="max-w-full max-h-[75vh] object-contain rounded-[2px] shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center border border-white/20 transition-all shadow-2xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center border border-white/20 transition-all shadow-2xl"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails Bottom */}
          {displayImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-2 z-10">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`w-14 h-16 rounded-[2px] overflow-hidden border transition-all ${
                    activeIndex === idx
                      ? 'border-[#D4AF37] scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
