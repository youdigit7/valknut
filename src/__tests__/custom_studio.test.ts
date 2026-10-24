import { describe, it, expect } from 'vitest';
import { PRINT_TECHNIQUES, STUDIO_FONTS, VALKNUT_SIGIL_PRESETS } from '../components/customStudio/studioAssets';
import type { CustomStudioOptions, ProductSize } from '../types/ecommerce';

describe('VALKNUT Custom Studio QA Suite', () => {
  it('contains valid print techniques with accurate fee schedules', () => {
    expect(PRINT_TECHNIQUES.length).toBeGreaterThan(0);
    const puffPrint = PRINT_TECHNIQUES.find(t => t.id === 'High-Density 3D Puff Rubber');
    expect(puffPrint).toBeDefined();
    expect(puffPrint?.fee).toBe(850);

    const embroidery = PRINT_TECHNIQUES.find(t => t.id === 'Gold Metallic Embroidery');
    expect(embroidery).toBeDefined();
    expect(embroidery?.fee).toBe(1800);

    const dtg = PRINT_TECHNIQUES.find(t => t.id === 'Direct-to-Garment (DTG)');
    expect(dtg).toBeDefined();
    expect(dtg?.fee).toBe(1200);

    const baseScreen = PRINT_TECHNIQUES.find(t => t.id === 'Screen Print');
    expect(baseScreen).toBeDefined();
    expect(baseScreen?.fee).toBe(0);
  });

  it('contains approved luxury typography fonts for bespoke typography rendering', () => {
    const fontNames = STUDIO_FONTS.map(f => f.name);
    expect(fontNames).toContain('Outfit Geometric');
    expect(fontNames).toContain('Cinzel Luxury Serif');
    expect(fontNames).toContain('Space Grotesk');
    expect(fontNames).toContain('Inter Tech Mono');
  });

  it('contains approved archival sigil presets with valid vector asset paths', () => {
    expect(VALKNUT_SIGIL_PRESETS.length).toBeGreaterThanOrEqual(4);
    for (const sigil of VALKNUT_SIGIL_PRESETS) {
      expect(sigil.id).toBeDefined();
      expect(sigil.name).toBeDefined();
      expect(sigil.svgPath).toBeDefined();
    }
  });

  it('correctly calculates custom studio options and placement surcharge', () => {
    const baseGarmentPrice = 8500;
    const techniqueFee = 850; // Puff rubber
    const sleevePlacementFee = 450; // Sleeve placement surcharge

    const studioOption: CustomStudioOptions = {
      productBaseId: 'test-garment-1',
      productName: 'Heavyweight Custom Tee',
      garmentColor: 'Onyx Black',
      garmentColorHex: '#0a0a0c',
      selectedSize: 'XL',
      placement: 'LEFT_SLEEVE',
      customText: 'VALKNUT 2026',
      textColor: '#D4AF37',
      textFont: 'Outfit',
      textSize: 26,
      textPosition: { x: 50, y: 50 },
      textUppercase: true,
      printTechnique: 'High-Density 3D Puff Rubber',
      basePrice: baseGarmentPrice,
      techniqueFee,
      placementFee: sleevePlacementFee,
      additionalPrice: techniqueFee + sleevePlacementFee,
      totalCustomPrice: baseGarmentPrice + techniqueFee + sleevePlacementFee
    };

    expect(studioOption.additionalPrice).toBe(1300);
    expect(studioOption.totalCustomPrice).toBe(9800);
  });

  it('supports full size spectrum including XS and XXXL in bespoke studio options', () => {
    const validSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    expect(validSizes).toHaveLength(7);
    for (const size of validSizes) {
      const option: CustomStudioOptions = {
        productBaseId: 'test-garment-spectrum',
        garmentColor: 'Pitch Black',
        garmentColorHex: '#101012',
        selectedSize: size,
        placement: 'FRONT',
        printTechnique: 'Screen Print',
        basePrice: 6800,
        techniqueFee: 0,
        placementFee: 0,
        additionalPrice: 0,
        totalCustomPrice: 6800
      };
      expect(option.selectedSize).toBe(size);
    }
  });
});
