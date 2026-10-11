import React from 'react';
import type { PrintTechniqueType } from '../../types/ecommerce';
import { Sparkles, Eye } from 'lucide-react';
import { Box, Typography } from '@mui/material';

interface StudioCanvasPreviewProps {
  garmentColorHex: string;
  placement: 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE';
  onPlacementChange: (placement: 'FRONT' | 'BACK' | 'LEFT_SLEEVE' | 'RIGHT_SLEEVE') => void;
  customText: string;
  textColor: string;
  textFont: string;
  textSize: number;
  textPos: { x: number; y: number };
  textUppercase: boolean;
  uploadedArtworkUrl?: string;
  sigilSvgPath?: string;
  artworkScale: number;
  artworkRotation: number;
  artworkPos: { x: number; y: number };
  artworkEffect: 'original' | 'monochrome' | 'gold_foil' | 'invert';
  printTechnique: PrintTechniqueType;
}

export const StudioCanvasPreview: React.FC<StudioCanvasPreviewProps> = ({
  garmentColorHex,
  placement,
  onPlacementChange,
  customText,
  textColor,
  textFont,
  textSize,
  textPos,
  textUppercase,
  uploadedArtworkUrl,
  sigilSvgPath,
  artworkScale,
  artworkRotation,
  artworkPos,
  artworkEffect,
  printTechnique
}) => {
  // Determine Visual Technique CSS Effects
  const getTechniqueStyle = (): { filter?: string; textShadow?: string; boxShadow?: string } => {
    switch (printTechnique) {
      case 'High-Density 3D Puff Rubber':
        return {
          filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.85)) drop-shadow(0px 1px 1px rgba(255,255,255,0.2))',
          textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.2)'
        };
      case 'Gold Metallic Embroidery':
        return {
          filter: 'drop-shadow(0 2px 4px rgba(212,175,55,0.4)) contrast(120%)',
          textShadow: '0 0 8px rgba(212,175,55,0.6), 0 2px 4px rgba(0,0,0,0.9)'
        };
      case 'Reflective 3M Laser Print':
        return {
          filter: 'drop-shadow(0 0 10px rgba(200,225,255,0.8)) brightness(1.25)',
          textShadow: '0 0 12px rgba(200,225,255,0.9), 0 2px 4px rgba(0,0,0,0.9)'
        };
      case 'Direct-to-Garment (DTG)':
        return {
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4)) opacity(0.95)'
        };
      default:
        return {
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
        };
    }
  };

  const getArtworkEffectFilter = () => {
    switch (artworkEffect) {
      case 'monochrome':
        return 'grayscale(100%) contrast(140%)';
      case 'gold_foil':
        return 'sepia(100%) saturate(300%) hue-rotate(5deg) brightness(1.1)';
      case 'invert':
        return 'invert(100%)';
      default:
        return 'none';
    }
  };

  const techniqueStyles = getTechniqueStyle();
  const isLightGarment = garmentColorHex.toLowerCase() === '#eaeaea' || garmentColorHex.toLowerCase() === '#eaeaeb' || garmentColorHex.toLowerCase() === '#f3f3f5' || garmentColorHex.toLowerCase() === '#ffffff';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 2, fontFamily: '"Inter", sans-serif' }}>
      
      {/* 1. Perspective Switcher Tabs */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 0.5, 
          p: 0.5, 
          bgcolor: 'var(--bg-surface)', 
          borderRadius: 2, 
          border: '1px solid var(--border-subtle)', 
          width: '100%', 
          maxWidth: '400px'
        }}
      >
        {(
          [
            { id: 'FRONT', label: 'FRONT CHEST' },
            { id: 'BACK', label: 'BACK FULL' },
            { id: 'LEFT_SLEEVE', label: 'L. SLEEVE' },
            { id: 'RIGHT_SLEEVE', label: 'R. SLEEVE' }
          ] as const
        ).map((tab) => {
          const isActive = placement === tab.id;
          return (
            <Box
              component="button"
              key={tab.id}
              onClick={() => onPlacementChange(tab.id)}
              sx={{
                flex: 1,
                py: 1,
                px: 1,
                borderRadius: 1,
                fontSize: '0.625rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                ...(isActive ? {
                  bgcolor: '#D4AF37',
                  color: '#000000',
                  boxShadow: '0 4px 10px rgba(212,175,55,0.3)',
                } : {
                  bgcolor: 'transparent',
                  color: 'var(--text-secondary)',
                  '&:hover': {
                    color: 'var(--text-primary)',
                    bgcolor: 'var(--border-subtle)'
                  }
                })
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Box>

      {/* 2. Layered Visual Garment Canvas */}
      <Box 
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '4/5',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          transition: 'all 0.3s ease',
          background: `radial-gradient(circle at 50% 40%, ${garmentColorHex} 0%, var(--bg-card-inner) 100%)`
        }}
      >
        {/* Background Grid Pattern & Ambient Studio Lighting */}
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
            opacity: 0.4
          }} 
        />

        {/* Realistic SVG Garment Silhouette Layer */}
        <Box sx={{ position: 'relative', width: '86%', height: '86%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Vector Garment Body */}
          <Box
            component="svg"
            viewBox="0 0 400 480"
            sx={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
              transition: 'all 0.3s ease'
            }}
          >
            <defs>
              {/* Garment Fabric Gradient & Wrinkles */}
              <linearGradient id="garmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={garmentColorHex} stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
              </linearGradient>

              <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Front & Back Silhouette */}
            {(placement === 'FRONT' || placement === 'BACK') && (
              <g>
                {/* T-Shirt / Hoodie Outline Shape */}
                <path
                  d="M 130 50 
                     C 160 70, 240 70, 270 50 
                     L 370 120 
                     L 330 180 
                     L 290 155 
                     L 290 440 
                     L 110 440 
                     L 110 155 
                     L 70 180 
                     L 30 120 Z"
                  fill="url(#garmentGrad)"
                  stroke={isLightGarment ? '#999' : '#ffffff20'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Collar Ribbing */}
                <path
                  d={placement === 'FRONT' 
                    ? "M 130 50 Q 200 100 270 50 Q 200 68 130 50" 
                    : "M 130 50 Q 200 65 270 50 Q 200 55 130 50"}
                  fill={garmentColorHex}
                  stroke={isLightGarment ? '#666' : '#D4AF37'}
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                {/* Tactical Seams & Shadows */}
                <path d="M 110 155 L 130 50" stroke="#000000" strokeWidth="1.5" opacity="0.4" />
                <path d="M 290 155 L 270 50" stroke="#000000" strokeWidth="1.5" opacity="0.4" />
                <path d="M 110 435 L 290 435" stroke="#ffffff15" strokeWidth="2" />
              </g>
            )}

            {/* Sleeve Silhouettes */}
            {(placement === 'LEFT_SLEEVE' || placement === 'RIGHT_SLEEVE') && (
              <g>
                <path
                  d="M 100 60 L 300 60 L 260 440 L 140 440 Z"
                  fill="url(#garmentGrad)"
                  stroke={isLightGarment ? '#999' : '#ffffff20'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M 100 60 Q 200 80 300 60" stroke="#000000" strokeWidth="2" opacity="0.4" fill="none" />
                <path d="M 140 435 L 260 435" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
              </g>
            )}
          </Box>

          {/* 3. Interactive Print Area Bounding Box */}
          <Box 
            sx={{
              position: 'absolute',
              border: '1px dashed rgba(212,175,55,0.4)',
              borderRadius: 1,
              bgcolor: 'rgba(212,175,55,0.05)',
              transition: 'all 0.3s ease',
              pointerEvents: 'none',
              ...(placement === 'FRONT' 
                ? { left: 48, right: 48, top: 96, bottom: 96 } 
                : placement === 'BACK' 
                  ? { left: 32, right: 32, top: 64, bottom: 64 } 
                  : { left: 64, right: 64, top: 64, bottom: 64 })
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 4, 
                left: 8, 
                fontSize: '0.5rem', 
                fontWeight: 'bold', 
                color: 'primary.main', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                opacity: 0.7 
              }}
            >
              <Sparkles size={8} />
              <Typography component="span">{placement.replace('_', ' ')} PRINT ZONE</Typography>
            </Box>
          </Box>

          {/* 4. Layer: Uploaded Artwork / Sigil Preset */}
          {(uploadedArtworkUrl || sigilSvgPath) && (
            <Box
              sx={{
                position: 'absolute',
                pointerEvents: 'none',
                transition: 'transform 0.075s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                left: `${artworkPos.x}%`,
                top: `${artworkPos.y}%`,
                width: `${artworkScale}%`,
                transform: `translate(-50%, -50%) rotate(${artworkRotation}deg)`,
                ...techniqueStyles
              }}
            >
              {uploadedArtworkUrl ? (
                <Box
                  component="img"
                  src={uploadedArtworkUrl}
                  alt="Custom Artwork"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    transition: 'all 0.3s ease',
                    filter: getArtworkEffectFilter()
                  }}
                />
              ) : sigilSvgPath ? (
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto' }}>
                  <path
                    d={sigilSvgPath}
                    fill={artworkEffect === 'gold_foil' ? '#D4AF37' : textColor}
                    stroke={artworkEffect === 'gold_foil' ? '#F6E05E' : textColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </Box>
          )}

          {/* 5. Layer: Custom Typography Text */}
          {customText.trim() !== '' && (
            <Box
              sx={{
                position: 'absolute',
                pointerEvents: 'none',
                textAlign: 'center',
                transition: 'all 0.075s ease',
                userSelect: 'none',
                left: `${textPos.x}%`,
                top: `${textPos.y}%`,
                transform: 'translate(-50%, -50%)',
                color: textColor,
                fontFamily: textFont,
                fontSize: `${textSize}px`,
                textTransform: textUppercase ? 'uppercase' : 'none',
                letterSpacing: textUppercase ? '0.15em' : 'normal',
                lineHeight: 1.1,
                maxWidth: '85%',
                ...techniqueStyles
              }}
            >
              {customText}
            </Box>
          )}

        </Box>

        {/* Technique Badge on Preview */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 12, 
            left: 12, 
            px: 1.5, 
            py: 0.5, 
            bgcolor: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(4px)', 
            border: '1px solid rgba(212,175,55,0.4)', 
            borderRadius: 1, 
            fontSize: '0.5625rem', 
            color: 'primary.main', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)' 
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', animation: 'pulse 2s infinite' }} />
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}>
            {printTechnique}
          </Typography>
        </Box>

        {/* Live Vector View Indicator */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 12, 
            right: 12, 
            fontSize: '0.5625rem', 
            color: 'var(--text-secondary)', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5 
          }}
        >
          <Eye size={12} color="#D4AF37" />
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
            2D LAYERED CAD
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};
