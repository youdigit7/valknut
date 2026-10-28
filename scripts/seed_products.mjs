import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Mirrors INITIAL_PRODUCTS in src/data/initialData.ts (same ids, slugs and SKUs).
// Images are the Cloudinary-hosted copies of src/assets/products/*.jpg.
const IMG = (name) => `https://res.cloudinary.com/ofrariny/image/upload/valknut/${name}.jpg`;

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const sizedVariants = (skuPrefix, color, colorHex, stocks, sizes = APPAREL_SIZES) =>
  sizes.map((size, i) => ({ size, color, color_hex: colorHex, sku: `${skuPrefix}-${size}`, stock: stocks[i] }));

const seedProducts = [
  {
    product: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'VALKNUT Celestial Mountain 480GSM Sovereign Hoodie',
      slug: 'valknut-celestial-mountain-sovereign-hoodie',
      description: 'The pinnacle of dark luxury streetwear. Engineered from 480GSM ultra-heavyweight combed organic cotton with double-lined architectural hood, dropped shoulders, and the iconic celestial mountain & crescent moon artwork with sacred geometry typography.',
      material: '100% Combed Organic Heavy Cotton (480 GSM) - Made in Sri Lanka',
      care_instructions: 'Machine wash cold inside out (30°C). Wash with similar colors. Line dry in shade. Do not iron print directly.',
      price: 14500,
      sale_price: 12500,
      category: 'MEN',
      sub_category: 'Hoodies',
      collection: 'DARK SOVEREIGN 2026',
      images: [IMG('men-sovereign-hoodie')],
      tags: ['Oversized', 'Heavyweight', '480GSM', 'Celestial Mountain', 'Best Seller', 'Dark Luxury'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-09-01T00:00:00Z'
    },
    variants: sizedVariants('VK-HD-BLK', 'Onyx Black', '#0a0a0c', [10, 15, 28, 22, 14, 8, 6])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Mind Control Heavyweight Oversized Tee',
      slug: 'mind-control-heavyweight-oversized-tee',
      description: 'Featuring the signature VALKNUT triangle knot insignia and bold "OWN YOUR MIND. CONTROL YOUR WORLD." back print with high-density puff rubber ink. Cut with a boxy oversized silhouette, reinforced 1.2" neck ribbing, and pre-shrunk finish.',
      material: '100% Combed Cotton Heavy Jersey (280 GSM) - Made in Sri Lanka',
      care_instructions: 'Machine wash cold inside out (30°C). Do not bleach. Hang dry in shade. Low heat iron on reverse.',
      price: 6800,
      sale_price: null,
      category: 'MEN',
      sub_category: 'Oversized T-Shirts',
      collection: 'ESSENTIAL SIGNATURE',
      images: [IMG('men-mind-control-tee')],
      tags: ['Oversized Tee', 'Puff Rubber', 'Mind Control', 'Graphic Tee', 'Signature'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: false,
      created_at: '2026-08-15T00:00:00Z'
    },
    variants: sizedVariants('VK-TS-BLK', 'Pitch Black', '#101012', [20, 35, 50, 40, 25, 12, 10])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Celestial Mountain Acid Wash Oversized Tee',
      slug: 'celestial-mountain-acid-wash-oversized-tee',
      description: 'Custom mineral vintage washed heavyweight tee featuring high-precision celestial occult mountain graphic, solar eclipse circle, and esoteric VALKNUT glyphs.',
      material: '100% Acid-Washed Combed Cotton (300 GSM)',
      care_instructions: 'Cold gentle wash. Wash separately for first 2 washes due to vintage dye. Line dry.',
      price: 7400,
      sale_price: 6500,
      category: 'MEN',
      sub_category: 'Oversized T-Shirts',
      collection: 'DARK SOVEREIGN 2026',
      images: [IMG('men-acid-wash-tee')],
      tags: ['Acid Wash', 'Vintage Wash', 'Celestial Mountain', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-09-10T00:00:00Z'
    },
    variants: sizedVariants('VK-CLST-CHR', 'Washed Charcoal', '#25262a', [15, 20, 35, 30, 15, 10, 8])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000007',
      name: 'Valknut Stealth Tech Tactical Joggers',
      slug: 'valknut-stealth-tech-tactical-joggers',
      description: 'Precision engineered cargo joggers with multi-pocket utility zip closures, ergonomic knee darting, adjustable cinch cuffs, and water-repellent matte stretch woven body.',
      material: '88% Nylon, 12% Elastane Matte Technical Weave',
      care_instructions: 'Machine wash 30°C. Do not use fabric softeners. Tumble dry low.',
      price: 11200,
      sale_price: 9800,
      category: 'MEN',
      sub_category: 'Joggers',
      collection: 'STEALTH LABS',
      images: [IMG('men-tactical-joggers')],
      tags: ['Techwear', 'Cargo', 'Joggers', 'Utility'],
      is_customizable: false,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-09-15T00:00:00Z'
    },
    variants: sizedVariants('VK-JG-BLK', 'Shadow Black', '#141416', [10, 12, 22, 18, 8, 6, 5])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000008',
      name: 'VALKNUT Femme Sculpted Crop Hoodie',
      slug: 'valknut-femme-sculpted-crop-hoodie',
      description: 'High-lux women’s cropped silhouette featuring raw-edge hemline, extended ribbed wrist cuffs, and tonal high-density metallic chest embroidery.',
      material: '85% Organic Cotton, 15% Polyester Fleece (360 GSM)',
      care_instructions: 'Hand wash or delicate cycle cold. Dry flat.',
      price: 9500,
      sale_price: null,
      category: 'WOMEN',
      sub_category: 'Hoodies',
      collection: 'VALKNUT FEMME',
      images: [IMG('women-crop-hoodie')],
      tags: ['Women', 'Crop Hoodie', 'Minimal', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-09-12T00:00:00Z'
    },
    variants: sizedVariants('VK-W-HD-BLK', 'Matte Black', '#0d0d0f', [12, 18, 25, 14, 10], ['XS', 'S', 'M', 'L', 'XL'])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000009',
      name: 'VALKNUT Femme Minimalist Oversized Tee',
      slug: 'valknut-femme-minimalist-oversized-tee',
      description: 'Relaxed drop-shoulder oversized streetwear tee engineered from heavyweight 280GSM combed cotton jersey. Featuring the signature Valknut chest insignia with clean architectural drape.',
      material: '100% Combed Heavy Cotton Jersey (280 GSM) - Made in Sri Lanka',
      care_instructions: 'Machine wash cold inside out (30°C). Do not bleach. Hang dry in shade.',
      price: 6800,
      sale_price: null,
      category: 'WOMEN',
      sub_category: 'Oversized T-Shirts',
      collection: 'VALKNUT FEMME',
      images: [IMG('women-oversized-tee')],
      tags: ['Women', 'Oversized Tee', 'Minimalist', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-09-18T00:00:00Z'
    },
    variants: sizedVariants('VK-W-TS-BLK', 'Washed Black', '#121214', [16, 24, 32, 18, 12], ['XS', 'S', 'M', 'L', 'XL'])
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Valknut Stealth Tactical Utility Crossbody Bag',
      slug: 'valknut-stealth-tactical-crossbody-bag',
      description: 'Constructed from ballistic Cordura 1000D matte fabric with YKK weather-sealed zippers, Fidlock magnetic buckle strap, internal organizer sleeve, and matte rubberized VALKNUT seal.',
      material: 'Cordura 1000D Water-Resistant Ballistic Nylon',
      care_instructions: 'Wipe clean with a microfiber cloth and warm soapy water.',
      price: 6900,
      sale_price: null,
      category: 'ESSENTIALS',
      sub_category: 'Accessories',
      collection: 'STEALTH LABS',
      images: [IMG('essentials-crossbody-bag')],
      tags: ['Crossbody', 'Utility Bag', 'Cordura', 'Accessories', 'Stealth'],
      is_customizable: false,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-08-20T00:00:00Z'
    },
    variants: [{ size: 'M', color: 'Matte Onyx', color_hex: '#121214', sku: 'VK-BAG-BLK-ONE', stock: 45 }]
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Valknut Monolith Double-Wall Insulated Tumbler',
      slug: 'valknut-monolith-insulated-tumbler',
      description: '500ml 18/8 food-grade stainless steel with double-wall copper vacuum insulation (keeps drinks cold for 24h, hot for 12h), condensation-free matte powder coat, and laser-etched VALKNUT emblem.',
      material: '18/8 Pro-Grade Stainless Steel with Textured Matte Powder Coating',
      care_instructions: 'Hand wash recommended with mild detergent.',
      price: 4800,
      sale_price: null,
      category: 'ESSENTIALS',
      sub_category: 'Accessories',
      collection: 'EVERYDAY ESSENTIALS',
      images: [IMG('essentials-tumbler')],
      tags: ['Tumbler', 'Drinkware', 'Stainless Steel', 'Insulated'],
      is_customizable: false,
      is_best_seller: true,
      is_new_arrival: false,
      created_at: '2026-08-22T00:00:00Z'
    },
    variants: [{ size: 'M', color: 'Stealth Black', color_hex: '#0e0e10', sku: 'VK-TMB-BLK-500', stock: 60 }]
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000006',
      name: 'Valknut Saffiano Leather RFID Slim Bifold Wallet',
      slug: 'valknut-saffiano-leather-rfid-wallet',
      description: 'Full-grain matte Saffiano leather featuring 6 precision-cut card slots, dual cash compartment, RFID anti-theft blocking lining, and embossed metallic silver VALKNUT insignia.',
      material: 'Genuine Saffiano Leather & RFID Shield Weave',
      care_instructions: 'Treat with leather conditioner twice annually.',
      price: 5200,
      sale_price: null,
      category: 'ESSENTIALS',
      sub_category: 'Accessories',
      collection: 'ACCESSORY SERIES',
      images: [IMG('essentials-leather-wallet')],
      tags: ['Leather Wallet', 'RFID Blocking', 'Accessories', 'Saffiano'],
      is_customizable: false,
      is_best_seller: true,
      is_new_arrival: true,
      created_at: '2026-08-25T00:00:00Z'
    },
    variants: [{ size: 'M', color: 'Midnight Black', color_hex: '#08080a', sku: 'VK-WLT-BLK-ONE', stock: 35 }]
  },
  {
    product: {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'VALKNUT Monolith 3D Embroidered Snapback Cap',
      slug: 'valknut-monolith-snapback-cap',
      description: 'Structured 6-panel high crown snapback with dense 3D gold/white embroidery, moisture-wicking internal sweatband, and matte black brass buckle closure.',
      material: '100% Heavy Wool Blend / Twill',
      care_instructions: 'Spot clean with damp cloth.',
      price: 4200,
      sale_price: null,
      category: 'ESSENTIALS',
      sub_category: 'Accessories',
      collection: 'ACCESSORY SERIES',
      images: [IMG('essentials-snapback-cap')],
      tags: ['Accessories', 'Cap', 'Snapback', 'Headwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: false,
      created_at: '2026-08-28T00:00:00Z'
    },
    variants: [{ size: 'M', color: 'Matte Black', color_hex: '#000000', sku: 'VK-CAP-BLK-ONE', stock: 65 }]
  }
];

async function seed() {
  const env = fs.readFileSync('.env', 'utf8');
  const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const anonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

  if (!url || !anonKey) {
    console.error('Missing Supabase credentials in .env');
    return;
  }

  const client = createClient(url, anonKey);
  const { data: auth, error: aErr } = await client.auth.signInWithPassword({
    email: 'valknutofficial4@gmail.com',
    password: '123456'
  });

  if (aErr) {
    console.error('Admin Auth Failed:', aErr.message);
    return;
  }
  console.log('✓ Admin authenticated:', auth.user.email);

  let ok = 0;
  for (const { product, variants } of seedProducts) {
    const { error: upErr } = await client.from('products').upsert(product, { onConflict: 'id' });
    if (upErr) {
      console.error(`✗ Product upsert error for ${product.slug}:`, upErr.message);
      continue;
    }

    const rows = variants.map((v) => ({ ...v, product_id: product.id }));
    const { error: vErr } = await client.from('product_variants').upsert(rows, { onConflict: 'sku' });
    if (vErr) {
      console.error(`✗ Variant upsert error for ${product.slug}:`, vErr.message);
      continue;
    }
    ok += 1;
    console.log(`✓ ${product.name} (${rows.length} variants)`);
  }

  console.log(`Seeding completed: ${ok}/${seedProducts.length} products saved.`);
  await client.auth.signOut();
}

seed().catch(console.error);
