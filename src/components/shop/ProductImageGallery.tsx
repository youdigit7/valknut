import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  Maximize2, 
  Sparkles 
} from 'lucide-react';
import { Box, Typography, IconButton, Button, Modal, Backdrop, Fade } from '@mui/material';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isCustomizable?: boolean;
  onOpenCustomStudio?: () => void;
  className?: string;
  activeColorImage?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  isCustomizable = false,
  onOpenCustomStudio,
  className = '',
  activeColorImage
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

  useEffect(() => {
    if (activeColorImage) {
      const idx = displayImages.indexOf(activeColorImage);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [activeColorImage, displayImages]);

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
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', lg: 'row' }, gap: { xs: 2, sm: 3 }, height: '100%' }} className={className}>
      
      {/* 1. Thumbnail Strip (Desktop Vertical / Mobile Horizontal) */}
      {displayImages.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', lg: 'column' },
            gap: 1.5,
            overflowX: { xs: 'auto', lg: 'hidden' },
            overflowY: { xs: 'hidden', lg: 'auto' },
            maxHeight: { lg: 640 },
            pb: { xs: 1, lg: 0 },
            flexShrink: 0,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {displayImages.map((img, idx) => (
            <Box
              component="button"
              key={idx}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 80, sm: 96 },
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: '#141620',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                border: '1px solid',
                ...(activeIndex === idx ? {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 10px rgba(212,175,55,0.3)',
                  opacity: 1
                } : {
                  borderColor: 'rgba(255,255,255,0.1)',
                  opacity: 0.6,
                  '&:hover': { opacity: 1, borderColor: 'rgba(255,255,255,0.3)' }
                })
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {activeIndex === idx && (
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(212,175,55,0.1)', pointerEvents: 'none' }} />
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* 2. Main Large Image Viewer */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box
          onMouseEnter={() => setIsHoverZooming(true)}
          onMouseLeave={() => setIsHoverZooming(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          sx={{
            position: 'relative',
            aspectRatio: '3/4',
            maxHeight: 640,
            width: '100%',
            bgcolor: '#12141F',
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            cursor: 'crosshair',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            userSelect: 'none',
            '&:hover .overlay-action': { opacity: 1 }
          }}
        >
          {/* Main Image with Zoom Magnification */}
          <Box
            component="img"
            src={currentImage}
            alt={`${productName} — Heavyweight Luxury Streetwear Garment View ${activeIndex + 1}`}
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.2s ease-out',
              transform: isHoverZooming ? 'scale(1.5)' : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
          />

          {/* Floating Action: Lightbox Fullscreen */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="overlay-action"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'var(--text-secondary)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              opacity: { xs: 1, lg: 0 },
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.9)', color: 'var(--text-primary)' }
            }}
            title="Expand Fullscreen Gallery"
          >
            <Maximize2 size={16} />
          </IconButton>

          {/* Custom Studio Floating Pill */}
          {isCustomizable && onOpenCustomStudio && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomStudio();
              }}
              sx={{
                position: 'absolute',
                top: 14,
                left: 14,
                bgcolor: 'rgba(13,14,21,0.85)',
                color: 'primary.main',
                border: '1px solid rgba(212,175,55,0.5)',
                backdropFilter: 'blur(10px)',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.625rem',
                fontFamily: '"JetBrains Mono", sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: 'primary.main', color: 'black' }
              }}
            >
              <Sparkles size={13} /> CUSTOM STUDIO READY
            </Button>
          )}

          {/* Hover Zoom Tip */}
          <Box
            className="overlay-action"
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.5,
              bgcolor: 'rgba(0,0,0,0.6)',
              borderRadius: 1,
              backdropFilter: 'blur(4px)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
          >
            <ZoomIn size={12} color="#D4AF37" />
            <Typography sx={{ fontSize: '0.625rem', fontFamily: '"JetBrains Mono", sans-serif', color: 'var(--text-secondary)' }}>Hover to zoom • Click to expand</Typography>
          </Box>

          {/* Mobile Swipe Indicators & Arrows */}
          {displayImages.length > 1 && (
            <>
              <IconButton
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="overlay-action"
                sx={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  opacity: { xs: 1, lg: 0 }, transition: 'all 0.3s ease', '&:hover': { bgcolor: 'black' }
                }}
              >
                <ChevronLeft size={18} />
              </IconButton>
              <IconButton
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="overlay-action"
                sx={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  opacity: { xs: 1, lg: 0 }, transition: 'all 0.3s ease', '&:hover': { bgcolor: 'black' }
                }}
              >
                <ChevronRight size={18} />
              </IconButton>

              {/* Mobile Dot Indicators */}
              <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.5, borderRadius: 10, backdropFilter: 'blur(4px)' }}>
                {displayImages.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{ width: activeIndex === idx ? 16 : 6, height: 6, borderRadius: '50%', transition: 'all 0.3s ease', bgcolor: activeIndex === idx ? 'primary.main' : 'rgba(255,255,255,0.4)' }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* 3. Fullscreen Lightbox Modal */}
      <Modal
        open={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { bgcolor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }
          },
        }}
      >
        <Fade in={isLightboxOpen}>
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 2, sm: 4 }, outline: 'none' }} onClick={() => setIsLightboxOpen(false)}>
            
            {/* Header */}
            <Box sx={{ w: '100%', width: '100%', maxWidth: 1200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
              <Typography sx={{ fontSize: '0.75rem', fontFamily: '"JetBrains Mono", sans-serif', fontWeight: 'bold', letterSpacing: '0.2em', color: 'primary.main', textTransform: 'uppercase' }}>
                {productName} — ({activeIndex + 1}/{displayImages.length})
              </Typography>
              <IconButton onClick={() => setIsLightboxOpen(false)} sx={{ color: 'var(--text-secondary)', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <X size={22} />
              </IconButton>
            </Box>

            {/* Main View */}
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 1000, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }} onClick={(e) => e.stopPropagation()}>
              <Box
                component="img"
                src={currentImage}
                alt={productName}
                sx={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
              />

              {displayImages.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrev}
                    sx={{ position: 'absolute', left: { xs: -16, sm: -48 }, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, bgcolor: 'rgba(0,0,0,0.8)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
                  >
                    <ChevronLeft size={22} />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    sx={{ position: 'absolute', right: { xs: -16, sm: -48 }, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, bgcolor: 'rgba(0,0,0,0.8)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'primary.main', color: 'black' } }}
                  >
                    <ChevronRight size={22} />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Lightbox Thumbnails Bottom */}
            {displayImages.length > 1 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', py: 1, zIndex: 10, maxWidth: '100%', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {displayImages.map((img, idx) => (
                  <Box
                    component="button"
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                    sx={{
                      width: 56, height: 64, borderRadius: 1, overflow: 'hidden', border: '1px solid', transition: 'all 0.3s ease', cursor: 'pointer', flexShrink: 0,
                      ...(activeIndex === idx ? { borderColor: 'primary.main', transform: 'scale(1.05)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' } : { borderColor: 'rgba(255,255,255,0.2)', opacity: 0.5, '&:hover': { opacity: 1 } })
                    }}
                  >
                    <Box component="img" src={img} alt="Thumb" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};
