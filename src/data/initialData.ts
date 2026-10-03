import type { Product, Coupon, Order } from '../types/ecommerce';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'VALKNUT Celestial Mountain 480GSM Sovereign Hoodie',
    slug: 'valknut-celestial-mountain-sovereign-hoodie',
    description: 'The pinnacle of dark luxury streetwear. Engineered from 480GSM ultra-heavyweight combed organic cotton with double-lined architectural hood, dropped shoulders, and the iconic celestial mountain & crescent moon artwork with sacred geometry typography.',
    material: '100% Combed Organic Heavy Cotton (480 GSM) - Made in Sri Lanka',
    careInstructions: 'Machine wash cold inside out (30°C). Wash with similar colors. Line dry in shade. Do not iron print directly. Do not dry clean.',
    price: 14500,
    salePrice: 12500,
    category: 'MEN',
    subCategory: 'Hoodies',
    collection: 'DARK SOVEREIGN 2026',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Oversized', 'Heavyweight', '480GSM', 'Celestial Mountain', 'Best Seller', 'Dark Luxury'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-01T00:00:00Z',
    variants: [
      { id: 'v1-1', size: 'S', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-S', stock: 15 },
      { id: 'v1-2', size: 'M', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-M', stock: 28 },
      { id: 'v1-3', size: 'L', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-L', stock: 22 },
      { id: 'v1-4', size: 'XL', color: 'Onyx Black', colorHex: '#0a0a0c', sku: 'VK-HD-BLK-XL', stock: 14 },
      { id: 'v1-5', size: 'M', color: 'Oyster Beige', colorHex: '#e3dcce', sku: 'VK-HD-BGE-M', stock: 18 },
      { id: 'v1-6', size: 'L', color: 'Oyster Beige', colorHex: '#e3dcce', sku: 'VK-HD-BGE-L', stock: 12 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Mind Control Heavyweight Oversized Tee',
    slug: 'mind-control-heavyweight-oversized-tee',
    description: 'Featuring the signature VALKNUT triangle knot insignia and bold "OWN YOUR MIND. CONTROL YOUR WORLD." back print with high-density puff rubber ink. Cut with a boxy oversized silhouette, reinforced 1.2" neck ribbing, and pre-shrunk finish.',
    material: '100% Combed Cotton Heavy Jersey (280 GSM) - Made in Sri Lanka',
    careInstructions: 'Machine wash cold inside out (30°C). Do not bleach. Hang dry in shade. Low heat iron on reverse.',
    price: 6800,
    category: 'MEN',
    subCategory: 'Oversized T-Shirts',
    collection: 'ESSENTIAL SIGNATURE',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Oversized Tee', 'Puff Rubber', 'Mind Control', 'Graphic Tee', 'Signature'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-08-15T00:00:00Z',
    variants: [
      { id: 'v2-1', size: 'S', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-S', stock: 35 },
      { id: 'v2-2', size: 'M', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-M', stock: 50 },
      { id: 'v2-3', size: 'L', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-L', stock: 40 },
      { id: 'v2-4', size: 'XL', color: 'Pitch Black', colorHex: '#101012', sku: 'VK-TS-BLK-XL', stock: 25 },
      { id: 'v2-5', size: 'M', color: 'Bone White', colorHex: '#ede8dd', sku: 'VK-TS-WHT-M', stock: 20 },
      { id: 'v2-6', size: 'L', color: 'Bone White', colorHex: '#ede8dd', sku: 'VK-TS-WHT-L', stock: 15 }
    ]
  },
  {
    id: 'prod-3',
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
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Acid Wash', 'Vintage Wash', 'Celestial Mountain', 'Streetwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-12T00:00:00Z',
    variants: [
      { id: 'v3-1', size: 'S', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-S', stock: 20 },
      { id: 'v3-2', size: 'M', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-M', stock: 35 },
      { id: 'v3-3', size: 'L', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-L', stock: 30 },
      { id: 'v3-4', size: 'XL', color: 'Washed Charcoal', colorHex: '#25262a', sku: 'VK-CLST-CHR-XL', stock: 15 },
      { id: 'v3-5', size: 'M', color: 'Oatmeal Stone', colorHex: '#dcd6c8', sku: 'VK-CLST-OAT-M', stock: 16 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Valknut Stealth Tactical Utility Crossbody Bag',
    slug: 'valknut-stealth-tactical-crossbody-bag',
    description: 'Constructed from ballistic Cordura 1000D matte fabric with YKK weather-sealed zippers, Fidlock magnetic buckle strap, internal organizer sleeve, and matte rubberized VALKNUT seal.',
    material: 'Cordura 1000D Water-Resistant Ballistic Nylon',
    careInstructions: 'Wipe clean with a microfiber cloth and warm soapy water.',
    price: 6900,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'STEALTH LABS',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Crossbody', 'Utility Bag', 'Cordura', 'Accessories', 'Stealth'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-15T00:00:00Z',
    variants: [
      { id: 'v4-1', size: 'M', color: 'Matte Onyx', colorHex: '#121214', sku: 'VK-BAG-BLK-ONE', stock: 45 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Valknut Monolith Double-Wall Insulated Tumbler',
    slug: 'valknut-monolith-insulated-tumbler',
    description: '500ml 18/8 food-grade stainless steel with double-wall copper vacuum insulation (keeps drinks cold for 24h, hot for 12h), condensation-free matte powder coat, and laser-etched VALKNUT emblem.',
    material: '18/8 Pro-Grade Stainless Steel with Textured Matte Powder Coating',
    careInstructions: 'Hand wash recommended with mild detergent.',
    price: 4800,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'EVERYDAY ESSENTIALS',
    images: [
      'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Tumbler', 'Drinkware', 'Stainless Steel', 'Insulated'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-07-28T00:00:00Z',
    variants: [
      { id: 'v5-1', size: 'M', color: 'Stealth Black', colorHex: '#0e0e10', sku: 'VK-TMB-BLK-500', stock: 60 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Valknut Saffiano Leather RFID Slim Bifold Wallet',
    slug: 'valknut-saffiano-leather-rfid-wallet',
    description: 'Full-grain matte Saffiano leather featuring 6 precision-cut card slots, dual cash compartment, RFID anti-theft blocking lining, and embossed metallic silver VALKNUT insignia.',
    material: 'Genuine Saffiano Leather & RFID Shield Weave',
    careInstructions: 'Treat with leather conditioner twice annually.',
    price: 5200,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'ACCESSORY SERIES',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Leather Wallet', 'RFID Blocking', 'Accessories', 'Saffiano'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-08-30T00:00:00Z',
    variants: [
      { id: 'v6-1', size: 'M', color: 'Midnight Black', colorHex: '#08080a', sku: 'VK-WLT-BLK-ONE', stock: 35 }
    ]
  },
  {
    id: 'prod-7',
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
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Techwear', 'Cargo', 'Joggers', 'Utility'],
    isCustomizable: false,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-09-10T00:00:00Z',
    variants: [
      { id: 'v7-1', size: 'S', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-S', stock: 12 },
      { id: 'v7-2', size: 'M', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-M', stock: 22 },
      { id: 'v7-3', size: 'L', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-L', stock: 18 },
      { id: 'v7-4', size: 'XL', color: 'Shadow Black', colorHex: '#141416', sku: 'VK-JG-BLK-XL', stock: 8 }
    ]
  },
  {
    id: 'prod-8',
    name: 'VALKNUT Femme Sculpted Crop Hoodie',
    slug: 'valknut-femme-sculpted-crop-hoodie',
    description: 'High-lux women’s cropped silhouette featuring raw-edge hemline, extended ribbed wrist cuffs, and tonal high-density metallic chest embroidery.',
    material: '85% Organic Cotton, 15% Polyester Fleece (360 GSM)',
    careInstructions: 'Hand wash or delicate cycle cold. Dry flat.',
    price: 9500,
    category: 'WOMEN',
    subCategory: 'Hoodies',
    collection: 'VALKNUT FEMME',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Women', 'Crop Hoodie', 'Minimal', 'Streetwear'],
    isCustomizable: true,
    isBestSeller: false,
    isNewArrival: true,
    createdAt: '2026-09-18T00:00:00Z',
    variants: [
      { id: 'v8-1', size: 'S', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-S', stock: 18 },
      { id: 'v8-2', size: 'M', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-M', stock: 25 },
      { id: 'v8-3', size: 'L', color: 'Matte Black', colorHex: '#0d0d0f', sku: 'VK-W-HD-BLK-L', stock: 14 },
      { id: 'v8-4', size: 'M', color: 'Sage Olive', colorHex: '#464f3e', sku: 'VK-W-HD-OLV-M', stock: 10 }
    ]
  },
  {
    id: 'prod-9',
    name: 'Essential Oversized Boxy Gym Pump Cover',
    slug: 'essential-oversized-boxy-pump-cover',
    description: 'Engineered for iron warriors and streetwear purists. Ultra-durable double-stitched 310GSM heavyweight jersey with relaxed dropped armholes and anti-fade reactive dye.',
    material: '100% Ring-Spun Combed Cotton Heavy Jersey - Made in Sri Lanka',
    careInstructions: 'Cold wash. Line dry in shade.',
    price: 5900,
    category: 'ESSENTIALS',
    subCategory: 'Core products',
    collection: 'EVERYDAY ESSENTIALS',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Activewear', 'Pump Cover', 'Essentials', 'Gym', 'Oversized'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-07-20T00:00:00Z',
    variants: [
      { id: 'v9-1', size: 'S', color: 'Obsidian Black', colorHex: '#111113', sku: 'VK-ESS-BLK-S', stock: 30 },
      { id: 'v9-2', size: 'M', color: 'Obsidian Black', colorHex: '#111113', sku: 'VK-ESS-BLK-M', stock: 45 },
      { id: 'v9-3', size: 'L', color: 'Obsidian Black', colorHex: '#111113', sku: 'VK-ESS-BLK-L', stock: 38 },
      { id: 'v9-4', size: 'XL', color: 'Obsidian Black', colorHex: '#111113', sku: 'VK-ESS-BLK-XL', stock: 22 }
    ]
  },
  {
    id: 'prod-10',
    name: 'VALKNUT Monolith 3D Embroidered Snapback Cap',
    slug: 'valknut-monolith-snapback-cap',
    description: 'Structured 6-panel high crown snapback with dense 3D gold/white embroidery, moisture-wicking internal sweatband, and matte black brass buckle closure.',
    material: '100% Heavy Wool Blend / Twill',
    careInstructions: 'Spot clean with damp cloth.',
    price: 4200,
    category: 'ESSENTIALS',
    subCategory: 'Accessories',
    collection: 'ACCESSORY SERIES',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85'
    ],
    tags: ['Accessories', 'Cap', 'Snapback', 'Headwear'],
    isCustomizable: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: '2026-06-10T00:00:00Z',
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

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VK-2026-8801',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerInfo: {
      fullName: 'Kasun Perera',
      email: 'kasun.perera@example.lk',
      phone: '+94771234567',
      addressLine1: 'No 45, Galle Road',
      city: 'Colombo 03',
      district: 'Western Province',
      postalCode: '00300'
    },
    items: [
      {
        id: 'oi-sample-1',
        productId: 'prod-1',
        productName: INITIAL_PRODUCTS[0].name,
        productSlug: INITIAL_PRODUCTS[0].slug,
        sku: 'VK-HD-OVR-BLK-L',
        size: 'L',
        color: 'Onyx Black',
        colorHex: '#0a0a0c',
        quantity: 1,
        unitPrice: 12500,
        originalPrice: 14500,
        subtotal: 12500,
        imageUrl: INITIAL_PRODUCTS[0].images[0],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    subtotal: 12500,
    discountAmount: 1250,
    shippingCharge: 0,
    totalAmount: 11250,
    couponCode: 'VALKNUT10',
    paymentGateway: 'Koko',
    paymentStatus: 'PAID',
    orderStatus: 'Shipped',
    shippingInfo: {
      shippingMethodId: 'standard',
      shippingMethodName: 'Standard Islandwide Delivery',
      shippingCharge: 0,
      estimatedDays: '2-4 Business Days',
      courierName: 'Pronto Lanka Express',
      awbNumber: 'PRN-99882103',
      trackingNumber: 'TRK-VK-2026-8801',
      trackingUrl: 'https://valknutofficial.com/#/track-order?order=VK-2026-8801',
      shippingStatus: 'In Transit',
      dispatchedAt: new Date(Date.now() - 86400000).toISOString()
    },
    paymentRecord: {
      id: 'pay-sample-1',
      orderId: 'ord-1001',
      paymentMethod: 'Koko',
      transactionId: 'TXN-KOKO-99882',
      amount: 11250,
      currency: 'LKR',
      status: 'PAID',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    statusHistory: [
      {
        id: 'osh-sample-1',
        orderId: 'ord-1001',
        status: 'Payment Confirmed',
        comment: 'Paid via Koko BNPL',
        updatedBy: 'System',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'osh-sample-2',
        orderId: 'ord-1001',
        status: 'Shipped',
        comment: 'Dispatched via Pronto Lanka. AWB PRN-99882103',
        updatedBy: 'Warehouse Dispatch',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    courierName: 'Pronto Lanka Express',
    awbNumber: 'PRN-99882103',
    trackingLink: 'https://valknutofficial.com/#/track-order?order=VK-2026-8801'
  },
  {
    id: 'ord-1002',
    orderNumber: 'VK-2026-8802',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customerInfo: {
      fullName: 'Dilini Senanayake',
      email: 'dilini.s@example.com',
      phone: '+94719876543',
      addressLine1: '128 Kandy Road',
      city: 'Kiribathgoda',
      district: 'Western Province',
      postalCode: '11600'
    },
    items: [
      {
        id: 'oi-sample-2',
        productId: 'prod-2',
        productName: INITIAL_PRODUCTS[1].name,
        productSlug: INITIAL_PRODUCTS[1].slug,
        sku: 'VK-TS-RVD-BLK-M',
        size: 'M',
        color: 'Pitch Black',
        colorHex: '#101012',
        quantity: 2,
        unitPrice: 8300,
        originalPrice: 6800,
        subtotal: 16600,
        imageUrl: INITIAL_PRODUCTS[1].images[0],
        customization: {
          productBaseId: 'prod-2',
          garmentColor: 'Pitch Black',
          garmentColorHex: '#101012',
          selectedSize: 'M',
          placement: 'BACK',
          customText: 'VALKNUT SQUAD 2026',
          textColor: '#e2b714',
          textFont: 'Impact',
          printTechnique: 'High-Density 3D Puff Rubber',
          basePrice: 15100,
          techniqueFee: 850,
          placementFee: 0,
          additionalPrice: 850,
          totalCustomPrice: 15950
        },
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    subtotal: 16600,
    discountAmount: 0,
    shippingCharge: 0,
    totalAmount: 16600,
    paymentGateway: 'OnePay',
    paymentStatus: 'PAID',
    orderStatus: 'Processing',
    shippingInfo: {
      shippingMethodId: 'standard',
      shippingMethodName: 'Standard Islandwide Delivery',
      shippingCharge: 0,
      estimatedDays: '2-4 Business Days',
      courierName: 'Fargo Express',
      awbNumber: 'FRG-445102',
      trackingNumber: 'TRK-VK-2026-8802',
      trackingUrl: 'https://valknutofficial.com/#/track-order?order=VK-2026-8802',
      shippingStatus: 'Pending'
    },
    paymentRecord: {
      id: 'pay-sample-2',
      orderId: 'ord-1002',
      paymentMethod: 'OnePay',
      transactionId: 'TXN-ONEPAY-44510',
      amount: 16600,
      currency: 'LKR',
      status: 'PAID',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    statusHistory: [
      {
        id: 'osh-sample-3',
        orderId: 'ord-1002',
        status: 'Payment Confirmed',
        comment: 'Paid via OnePay Direct IPG',
        updatedBy: 'System',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'osh-sample-4',
        orderId: 'ord-1002',
        status: 'Processing',
        comment: 'Custom artwork sent to production press',
        updatedBy: 'Studio Production',
        createdAt: new Date(Date.now() - 86400000 * 1 + 3600000).toISOString()
      }
    ],
    courierName: 'Fargo Express',
    awbNumber: 'FRG-445102',
    trackingLink: 'https://valknutofficial.com/#/track-order?order=VK-2026-8802'
  }
];
