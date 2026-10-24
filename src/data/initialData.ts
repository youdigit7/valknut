import type { Product, Coupon, Order } from '../types/ecommerce';
import menAcidWashTee from '../assets/products/men-acid-wash-tee.jpg';
import menTacticalJoggers from '../assets/products/men-tactical-joggers.jpg';
import menSovereignHoodie from '../assets/products/men-sovereign-hoodie.jpg';
import menMindControlTee from '../assets/products/men-mind-control-tee.jpg';
import womenCropHoodie from '../assets/products/women-crop-hoodie.jpg';
import womenOversizedTee from '../assets/products/women-oversized-tee.jpg';
import essentialsCrossbodyBag from '../assets/products/essentials-crossbody-bag.jpg';
import essentialsTumbler from '../assets/products/essentials-tumbler.jpg';
import essentialsSnapbackCap from '../assets/products/essentials-snapback-cap.jpg';
import essentialsLeatherWallet from '../assets/products/essentials-leather-wallet.jpg';

export const DEMO_CUSTOMER_EMAILS = [
  'kasun.perera@example.lk',
  'dilini.s@example.com'
];

export const DEMO_ORDER_IDS = ['ord-1001', 'ord-1002'];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MEN: Sovereign Hoodie (Customizable)
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'VALKNUT Celestial Mountain 480GSM Sovereign Hoodie',
    slug: 'valknut-celestial-mountain-sovereign-hoodie',
    description: 'The pinnacle of dark luxury streetwear. Engineered from 480GSM ultra-heavyweight combed organic cotton with double-lined architectural hood, dropped shoulders, and the iconic celestial mountain & crescent moon artwork with sacred geometry typography.',
    material: '100% Combed Organic Heavy Cotton (480 GSM) - Made in Sri Lanka',
    careInstructions: 'Machine wash cold inside out (30°C). Wash with similar colors. Line dry in shade. Do not iron print directly.',
    price: 14500,
    salePrice: 12500,
    category: 'MEN',
    subCategory: 'Hoodies',
    collection: 'DARK SOVEREIGN 2026',
    images: [menSovereignHoodie],
    tags: ['Oversized', 'Heavyweight', '480GSM', 'Celestial Mountain', 'Best Seller', 'Dark Luxury'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-01T00:00:00Z',
    variants: [
      { id: 'v1-0', size: 'XS', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-XS', stock: 10 },
      { id: 'v1-1', size: 'S', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-S', stock: 15 },
      { id: 'v1-2', size: 'M', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-M', stock: 28 },
      { id: 'v1-3', size: 'L', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-L', stock: 22 },
      { id: 'v1-4', size: 'XL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-XL', stock: 14 },
      { id: 'v1-5', size: 'XXL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-XXL', stock: 8 },
      { id: 'v1-6', size: 'XXXL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-XXXL', stock: 6 }
    ]
  },
  // 2. MEN: Mind Control Oversized Tee (Customizable)
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Mind Control Heavyweight Oversized Tee',
    slug: 'mind-control-heavyweight-oversized-tee',
    description: 'Featuring the signature VALKNUT triangle knot insignia and bold "OWN YOUR MIND. CONTROL YOUR WORLD." back print with high-density puff rubber ink. Cut with a boxy oversized silhouette, reinforced 1.2" neck ribbing, and pre-shrunk finish.',
    material: '100% Combed Cotton Heavy Jersey (280 GSM) - Made in Sri Lanka',
    careInstructions: 'Machine wash cold inside out (30°C). Do not bleach. Hang dry in shade. Low heat iron on reverse.',
    price: 6800,
    category: 'MEN',
    subCategory: 'Oversized T-Shirts',
    collection: 'ESSENTIAL SIGNATURE',
    images: [menMindControlTee],
    tags: ['Oversized Tee', 'Puff Rubber', 'Mind Control', 'Graphic Tee', 'Signature'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-08-15T00:00:00Z',
    variants: [
      { id: 'v2-0', size: 'XS', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-XS', stock: 20 },
      { id: 'v2-1', size: 'S', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-S', stock: 35 },
      { id: 'v2-2', size: 'M', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-M', stock: 50 },
      { id: 'v2-3', size: 'L', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-L', stock: 40 },
      { id: 'v2-4', size: 'XL', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-XL', stock: 25 },
      { id: 'v2-5', size: 'XXL', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-XXL', stock: 12 },
      { id: 'v2-6', size: 'XXXL', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-XXXL', stock: 10 }
    ]
  },
  // 3. MEN: Celestial Mountain Acid Wash Tee (Customizable)
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Celestial Mountain Acid Wash Oversized Tee',
    slug: 'celestial-mountain-acid-wash-oversized-tee',
    description: 'Custom mineral vintage washed heavyweight tee featuring high-precision celestial occult mountain graphic, solar eclipse circle, and esoteric VALKNUT glyphs.',
    material: '100% Acid-Washed Combed Cotton (300 GSM)',
    careInstructions: 'Cold gentle wash. Wash separately for first 2 washes due to vintage dye. Line dry.',
    price: 7400,
    salePrice: 6500,
    category: 'MEN',
    subCategory: 'Oversized T-Shirts',
    collection: 'DARK SOVEREIGN 2026',
    images: [menAcidWashTee],
    tags: ['Acid Wash', 'Vintage Wash', 'Celestial Mountain', 'Streetwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-10T00:00:00Z',
    variants: [
      { id: 'v3-0', size: 'XS', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-XS', stock: 15 },
      { id: 'v3-1', size: 'S', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-S', stock: 20 },
      { id: 'v3-2', size: 'M', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-M', stock: 35 },
      { id: 'v3-3', size: 'L', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-L', stock: 30 },
      { id: 'v3-4', size: 'XL', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-XL', stock: 15 },
      { id: 'v3-5', size: 'XXL', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-XXL', stock: 10 },
      { id: 'v3-6', size: 'XXXL', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-XXXL', stock: 8 }
    ]
  },
  // 4. MEN: Tactical Joggers
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Valknut Stealth Tech Tactical Joggers',
    slug: 'valknut-stealth-tech-tactical-joggers',
    description: 'Precision engineered cargo joggers with multi-pocket utility zip closures, ergonomic knee darting, adjustable cinch cuffs, and water-repellent matte stretch woven body.',
    material: '88% Nylon, 12% Elastane Matte Technical Weave',
    careInstructions: 'Machine wash 30°C. Do not use fabric softeners. Tumble dry low.',
    price: 11200,
    salePrice: 9800,
    category: 'MEN',
    subCategory: 'Joggers',
    collection: 'STEALTH LABS',
    images: [menTacticalJoggers],
    tags: ['Techwear', 'Cargo', 'Joggers', 'Utility'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-15T00:00:00Z',
    variants: [
      { id: 'v7-0', size: 'XS', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-XS', stock: 10 },
      { id: 'v7-1', size: 'S', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-S', stock: 12 },
      { id: 'v7-2', size: 'M', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-M', stock: 22 },
      { id: 'v7-3', size: 'L', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-L', stock: 18 },
      { id: 'v7-4', size: 'XL', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-XL', stock: 8 },
      { id: 'v7-5', size: 'XXL', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-XXL', stock: 6 },
      { id: 'v7-6', size: 'XXXL', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-XXXL', stock: 5 }
    ]
  },
  // 5. WOMEN: Sculpted Crop Hoodie (Customizable)
  {
    id: '00000000-0000-0000-0000-000000000008',
    name: 'VALKNUT Femme Sculpted Crop Hoodie',
    slug: 'valknut-femme-sculpted-crop-hoodie',
    description: 'High-lux women’s cropped silhouette featuring raw-edge hemline, extended ribbed wrist cuffs, and tonal high-density metallic chest embroidery.',
    material: '85% Organic Cotton, 15% Polyester Fleece (360 GSM)',
    careInstructions: 'Hand wash or delicate cycle cold. Dry flat.',
    price: 9500,
    category: 'WOMEN',
    subCategory: 'Hoodies',
    collection: 'VALKNUT FEMME',
    images: [womenCropHoodie],
    tags: ['Women', 'Crop Hoodie', 'Minimal', 'Streetwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-12T00:00:00Z',
    variants: [
      { id: 'v8-0', size: 'XS', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-XS', stock: 12 },
      { id: 'v8-1', size: 'S', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-S', stock: 18 },
      { id: 'v8-2', size: 'M', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-M', stock: 25 },
      { id: 'v8-3', size: 'L', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-L', stock: 14 },
      { id: 'v8-4', size: 'XL', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-XL', stock: 10 }
    ]
  },
  // 6. WOMEN: Femme Minimalist Oversized Tee (Customizable)
  {
    id: '00000000-0000-0000-0000-000000000009',
    name: 'VALKNUT Femme Minimalist Oversized Tee',
    slug: 'valknut-femme-minimalist-oversized-tee',
    description: 'Relaxed drop-shoulder oversized streetwear tee engineered from heavyweight 280GSM combed cotton jersey. Featuring the signature Valknut chest insignia with clean architectural drape.',
    material: '100% Combed Heavy Cotton Jersey (280 GSM) - Made in Sri Lanka',
    careInstructions: 'Machine wash cold inside out (30°C). Do not bleach. Hang dry in shade.',
    price: 6800,
    category: 'WOMEN',
    subCategory: 'Oversized T-Shirts',
    collection: 'VALKNUT FEMME',
    images: [womenOversizedTee],
    tags: ['Women', 'Oversized Tee', 'Minimalist', 'Streetwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-18T00:00:00Z',
    variants: [
      { id: 'v9-0', size: 'XS', color: 'Washed Black', colorHex: '#121214', sku: 'VK-W-TS-BLK-XS', stock: 16 },
      { id: 'v9-1', size: 'S', color: 'Washed Black', colorHex: '#121214', sku: 'VK-W-TS-BLK-S', stock: 24 },
      { id: 'v9-2', size: 'M', color: 'Washed Black', colorHex: '#121214', sku: 'VK-W-TS-BLK-M', stock: 32 },
      { id: 'v9-3', size: 'L', color: 'Washed Black', colorHex: '#121214', sku: 'VK-W-TS-BLK-L', stock: 18 },
      { id: 'v9-4', size: 'XL', color: 'Washed Black', colorHex: '#121214', sku: 'VK-W-TS-BLK-XL', stock: 12 }
    ]
  },
  // 7. ESSENTIALS: Tactical Crossbody Bag
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Valknut Stealth Tactical Utility Crossbody Bag',
    slug: 'valknut-stealth-tactical-crossbody-bag',
    description: 'Constructed from ballistic Cordura 1000D matte fabric with YKK weather-sealed zippers, Fidlock magnetic buckle strap, internal organizer sleeve, and matte rubberized VALKNUT seal.',
    material: 'Cordura 1000D Water-Resistant Ballistic Nylon',
    careInstructions: 'Wipe clean with a microfiber cloth and warm soapy water.',
    price: 6900,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'STEALTH LABS',
    images: [essentialsCrossbodyBag],
    tags: ['Crossbody', 'Utility Bag', 'Cordura', 'Accessories', 'Stealth'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-08-20T00:00:00Z',
    variants: [
      { id: 'v4-1', size: 'M', color: 'Matte Onyx', colorHex: '#121214', sku: 'VK-BAG-BLK-ONE', stock: 45 }
    ]
  },
  // 8. ESSENTIALS: Insulated Tumbler
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Valknut Monolith Double-Wall Insulated Tumbler',
    slug: 'valknut-monolith-insulated-tumbler',
    description: '500ml 18/8 food-grade stainless steel with double-wall copper vacuum insulation (keeps drinks cold for 24h, hot for 12h), condensation-free matte powder coat, and laser-etched VALKNUT emblem.',
    material: '18/8 Pro-Grade Stainless Steel with Textured Matte Powder Coating',
    careInstructions: 'Hand wash recommended with mild detergent.',
    price: 4800,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'EVERYDAY ESSENTIALS',
    images: [essentialsTumbler],
    tags: ['Tumbler', 'Drinkware', 'Stainless Steel', 'Insulated'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-08-22T00:00:00Z',
    variants: [
      { id: 'v5-1', size: 'M', color: 'Stealth Black', colorHex: '#0e0e10', sku: 'VK-TMB-BLK-500', stock: 60 }
    ]
  },
  // 9. ESSENTIALS: Saffiano RFID Wallet
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Valknut Saffiano Leather RFID Slim Bifold Wallet',
    slug: 'valknut-saffiano-leather-rfid-wallet',
    description: 'Full-grain matte Saffiano leather featuring 6 precision-cut card slots, dual cash compartment, RFID anti-theft blocking lining, and embossed metallic silver VALKNUT insignia.',
    material: 'Genuine Saffiano Leather & RFID Shield Weave',
    careInstructions: 'Treat with leather conditioner twice annually.',
    price: 5200,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'ACCESSORY SERIES',
    images: [essentialsLeatherWallet],
    tags: ['Leather Wallet', 'RFID Blocking', 'Accessories', 'Saffiano'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-08-25T00:00:00Z',
    variants: [
      { id: 'v6-1', size: 'M', color: 'Midnight Black', colorHex: '#08080a', sku: 'VK-WLT-BLK-ONE', stock: 35 }
    ]
  },
  // 10. ESSENTIALS: 3D Embroidered Snapback Cap
  {
    id: '00000000-0000-0000-0000-000000000010',
    name: 'VALKNUT Monolith 3D Embroidered Snapback Cap',
    slug: 'valknut-monolith-snapback-cap',
    description: 'Structured 6-panel high crown snapback with dense 3D gold/white embroidery, moisture-wicking internal sweatband, and matte black brass buckle closure.',
    material: '100% Heavy Wool Blend / Twill',
    careInstructions: 'Spot clean with damp cloth.',
    price: 4200,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'ACCESSORY SERIES',
    images: [essentialsSnapbackCap],
    tags: ['Accessories', 'Cap', 'Snapback', 'Headwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-08-28T00:00:00Z',
    variants: [
      { id: 'v10-1', size: 'M', color: 'Matte Black', colorHex: '#000000', sku: 'VK-CAP-BLK-ONE', stock: 65 }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'VALKNUT10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 5000,
    expiryDate: '2026-12-31',
    active: true
  },
  {
    code: 'CONTROL20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 15000,
    expiryDate: '2026-12-31',
    active: true
  },
  {
    code: 'FREESHIP',
    discountType: 'FIXED',
    discountValue: 450,
    minOrderAmount: 8000,
    expiryDate: '2026-12-31',
    active: true
  }
];

export const SAMPLE_ORDERS: Order[] = [];
