import React from 'react';
import type { PrintTechniqueType } from '../../types/ecommerce';
import { Sparkles, Eye } from 'lucide-react';

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
    <div className="flex flex-col items-center w-full space-y-4 font-mono">
      
      {/* 1. Perspective Switcher Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-[#0E1017] rounded-md border border-white/10 w-full max-w-sm">
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
            <button
              key={tab.id}
              onClick={() => onPlacementChange(tab.id)}
              className={`flex-1 py-1.5 px-2 rounded text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Layered Visual Garment Canvas */}
      <div 
        className="relative w-full max-w-[400px] aspect-[4/5] rounded-lg overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center select-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${garmentColorHex} 0%, #060709 100%)`
        }}
      >
        {/* Background Grid Pattern & Ambient Studio Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

        {/* Realistic SVG Garment Silhouette Layer */}
        <div className="relative w-[86%] h-[86%] flex items-center justify-center">
          
          {/* Vector Garment Body */}
          <svg
            viewBox="0 0 400 480"
            className="w-full h-full filter drop-shadow-2xl transition-all duration-300"
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
          </svg>

          {/* 3. Interactive Print Area Bounding Box */}
          <div 
            className={`absolute border border-dashed rounded transition-all pointer-events-none ${
              placement === 'FRONT' 
                ? 'inset-x-12 top-24 bottom-24 border-[#D4AF37]/40 bg-[#D4AF37]/5' 
                : placement === 'BACK' 
                  ? 'inset-x-8 top-16 bottom-16 border-[#D4AF37]/40 bg-[#D4AF37]/5' 
                  : 'inset-x-16 top-16 bottom-16 border-[#D4AF37]/40 bg-[#D4AF37]/5'
            }`}
          >
            <div className="absolute top-1 left-2 text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 opacity-70">
              <Sparkles size={8} />
              <span>{placement.replace('_', ' ')} PRINT ZONE</span>
            </div>
          </div>

          {/* 4. Layer: Uploaded Artwork / Sigil Preset */}
          {(uploadedArtworkUrl || sigilSvgPath) && (
            <div
              className="absolute pointer-events-none transition-transform duration-75 flex items-center justify-center"
              style={{
                left: `${artworkPos.x}%`,
                top: `${artworkPos.y}%`,
                width: `${artworkScale}%`,
                transform: `translate(-50%, -50%) rotate(${artworkRotation}deg)`,
                ...techniqueStyles
              }}
            >
              {uploadedArtworkUrl ? (
                <img
                  src={uploadedArtworkUrl}
                  alt="Custom Artwork"
                  className="w-full h-auto object-contain transition-all"
                  style={{ filter: getArtworkEffectFilter() }}
                />
              ) : sigilSvgPath ? (
                <svg viewBox="0 0 100 100" className="w-full h-auto">
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
            </div>
          )}

          {/* 5. Layer: Custom Typography Text */}
          {customText.trim() !== '' && (
            <div
              className="absolute pointer-events-none text-center transition-all duration-75 select-none"
              style={{
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
            </div>
          )}

        </div>

        {/* Technique Badge on Preview */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 rounded text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>{printTechnique}</span>
        </div>

        {/* Live Vector View Indicator */}
        <div className="absolute bottom-3 right-3 text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <Eye size={12} className="text-[#D4AF37]" />
          <span>2D LAYERED CAD</span>
        </div>
      </div>

    </div>
  );
};
