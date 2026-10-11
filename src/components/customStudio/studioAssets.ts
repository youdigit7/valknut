import type { PrintTechniqueType } from '../../types/ecommerce';

export interface SigilPreset {
  id: string;
  name: string;
  category: string;
  svgPath: string;
  description: string;
}

export interface TypographyFont {
  id: string;
  name: string;
  fontFamily: string;
  sample: string;
  category: string;
}

export interface TechniqueInfo {
  id: PrintTechniqueType;
  name: string;
  fee: number;
  description: string;
  badge: string;
  visualEffect: 'matte' | 'puff3d' | 'metallic_gold' | 'soft_dtg' | 'reflective_3m';
}

export const VALKNUT_SIGIL_PRESETS: SigilPreset[] = [
  {
    id: 'sigil-valknut',
    name: 'Valknut Tri-Knot',
    category: 'Sacred Norse',
    description: 'The ancient knot of slain warriors and sovereign resolve.',
    svgPath: 'M 50 10 L 90 80 L 10 80 Z M 50 25 L 25 70 L 75 70 Z'
  },
  {
    id: 'sigil-vegvisir',
    name: 'Vegvisir Compass',
    category: 'Runic Stave',
    description: 'The Icelandic runic compass: Never lose your way in storms.',
    svgPath: 'M50,15 L50,85 M15,50 L85,50 M25,25 L75,75 M25,75 L75,25 M45,15 L55,15 M45,85 L55,85 M15,45 L15,55 M85,45 L85,55'
  },
  {
    id: 'sigil-aegishjalmur',
    name: 'Helm of Awe',
    category: 'Protection Stave',
    description: 'Ancient magical stave for invincibility in physical and mental battles.',
    svgPath: 'M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22 M40,25 L60,25 M40,75 L60,75 M25,40 L25,60 M75,40 L75,60'
  },
  {
    id: 'sigil-fenrir',
    name: 'Fenrir Wolf Crest',
    category: 'Mythology',
    description: 'The untamed giant wolf of Norse prophecy breaking all chains.',
    svgPath: 'M 20 80 Q 50 10 80 80 Q 65 50 50 65 Q 35 50 20 80 Z'
  },
  {
    id: 'sigil-cyber-vk',
    name: 'Cyber Valknut 2026',
    category: 'Futuristic Streetwear',
    description: 'Brutalist geometric streetwear emblem engineered in Colombo.',
    svgPath: 'M 50 5 L 95 30 L 95 70 L 50 95 L 5 70 L 5 30 Z M 50 20 L 80 38 L 80 62 L 50 80 L 20 62 L 20 38 Z'
  }
];

export const STUDIO_FONTS: TypographyFont[] = [
  {
    id: 'outfit',
    name: 'Outfit Geometric',
    fontFamily: '"Outfit", sans-serif',
    sample: 'VALKNUT ARCHIVE',
    category: 'Brutalist Streetwear'
  },
  {
    id: 'cinzel',
    name: 'Cinzel Luxury Serif',
    fontFamily: '"Cinzel", serif',
    sample: 'SOVEREIGN ESTATE',
    category: 'High-Fashion Lux'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    fontFamily: '"Space Grotesk", sans-serif',
    sample: 'SHADOW DIVISION',
    category: 'Cyber Tactical'
  },
  {
    id: 'mono',
    name: 'Inter Tech Mono',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    sample: 'SPEC_NO.8802',
    category: 'Industrial Tech'
  },
  {
    id: 'impact',
    name: 'Bebas Oversized',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    sample: 'HEAVYWEIGHT 320',
    category: 'Boxy Poster'
  }
];

export const PRINT_TECHNIQUES: TechniqueInfo[] = [
  {
    id: 'High-Density 3D Puff Rubber',
    name: 'High-Density 3D Puff Rubber',
    fee: 850,
    description: 'Elevated matte silicone rubber print with tactile 2.5mm 3D pop effect.',
    badge: 'MOST POPULAR',
    visualEffect: 'puff3d'
  },
  {
    id: 'Gold Metallic Embroidery',
    name: 'Gold Metallic Thread Embroidery',
    fee: 1800,
    description: 'High-tensile Japanese Madeira gold thread with micro-stitched sheen.',
    badge: 'LUXURY SIGNATURE',
    visualEffect: 'metallic_gold'
  },
  {
    id: 'Direct-to-Garment (DTG)',
    name: 'Direct-to-Garment (DTG) Photorealistic',
    fee: 1200,
    description: '1200 DPI water-based pigment inks embedded directly into cotton weave.',
    badge: 'FULL COLOR',
    visualEffect: 'soft_dtg'
  },
  {
    id: 'Reflective 3M Laser Print',
    name: '3M™ Scotchlite™ Reflective Laser',
    fee: 1450,
    description: 'Silver reflective micro-glass bead technology reflecting headlights in darkness.',
    badge: 'NIGHT RUN',
    visualEffect: 'reflective_3m'
  },
  {
    id: 'Screen Print',
    name: 'Standard Plastisol Screen Print',
    fee: 0,
    description: 'Classic durable high-opacity streetwear screen print.',
    badge: 'INCLUDED BASE',
    visualEffect: 'matte'
  }
];

export const STUDIO_COLORS = [
  { name: 'Onyx Black', hex: '#0A0B0E', borderHex: '#333742' },
  { name: 'Shadow White', hex: '#EAEAEB', borderHex: '#B0B4C0' },
  { name: 'Slate Charcoal', hex: '#1F232D', borderHex: '#3F4659' },
  { name: 'Oxblood Crimson', hex: '#4A0E17', borderHex: '#8C1F2D' },
  { name: 'Tactical Pine', hex: '#14261B', borderHex: '#2E593E' },
  { name: 'Desert Taupe', hex: '#3E372E', borderHex: '#6E6252' }
];

export const STUDIO_TEXT_COLORS = [
  { name: 'Valhalla Gold', hex: '#D4AF37' },
  { name: 'Bone White', hex: '#FFFFFF' },
  { name: 'Onyx Black', hex: '#0A0A0C' },
  { name: 'Cyber Neon Cyan', hex: '#00F0FF' },
  { name: 'Oxblood Red', hex: '#E53E3E' },
  { name: 'Tactical Olive', hex: '#68D391' },
  { name: 'Silver Chrome', hex: '#CBD5E1' }
];
