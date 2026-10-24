import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

  const seedProducts = [
    {
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
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png'],
      tags: ['Oversized', 'Heavyweight', '480GSM', 'Celestial Mountain', 'Best Seller', 'Dark Luxury'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true
    },
    {
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
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png'],
      tags: ['Oversized Tee', 'Puff Rubber', 'Mind Control', 'Graphic Tee', 'Signature'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: false
    },
    {
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
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png'],
      tags: ['Acid Wash', 'Vintage Wash', 'Celestial Mountain', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true
    },
    {
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
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png'],
      tags: ['Women', 'Crop Hoodie', 'Minimal', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true
    },
    {
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
      images: ['https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png'],
      tags: ['Women', 'Oversized Tee', 'Minimalist', 'Streetwear'],
      is_customizable: true,
      is_best_seller: true,
      is_new_arrival: true
    }
  ];

  for (const p of seedProducts) {
    const { error: upErr } = await client.from('products').upsert(p, { onConflict: 'slug' });
    if (upErr) {
      console.error(`Product upsert error for ${p.slug}:`, upErr.message);
      continue;
    }
    console.log(`✓ Upserted product: ${p.name}`);

    // Variants for XS, S, M, L, XL, XXL, XXXL in Onyx Black
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    for (const sz of sizes) {
      const v = {
        product_id: p.id,
        size: sz,
        color: 'Onyx Black',
        color_hex: '#0a0a0c',
        sku: `${p.slug.toUpperCase().slice(0, 10)}-${sz}`,
        stock: 25
      };
      const { error: vErr } = await client.from('product_variants').upsert(v, { onConflict: 'sku' });
      if (vErr) console.warn(`Variant upsert notice (${sz}):`, vErr.message);
    }
  }

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
