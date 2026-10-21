import type { CategoryType, Product } from '../types/ecommerce';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, any>[];
}

const BASE_URL = 'https://valknutofficial.com';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85';

/**
 * Generates Schema.org Organization structured data
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${BASE_URL}/#organization`,
    name: 'VALKNUT Official',
    alternateName: 'VALKNUT Dark Luxury Streetwear',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: DEFAULT_OG_IMAGE,
    description: 'Premier dark luxury streetwear brand in Sri Lanka. 480GSM heavyweight hoodies, boxy oversized tees, tactical wear, and bespoke Custom Studio apparel.',
    slogan: 'OWN YOUR MIND. CONTROL YOUR WORLD.',
    foundingDate: '2026',
    currenciesAccepted: 'LKR, USD',
    paymentAccepted: 'Koko, OnePay, eWAY, Visa, MasterCard, Cash on Delivery',
    priceRange: 'LKR 4200 - LKR 14500',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Galle Road, Kollupitiya',
      addressLocality: 'Colombo',
      addressRegion: 'Western Province',
      postalCode: '00300',
      addressCountry: 'LK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.9271,
      longitude: 79.8612
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+94761125786',
      contactType: 'customer service',
      areaServed: 'LK',
      availableLanguage: ['English', 'Sinhala']
    },
    sameAs: [
      'https://instagram.com/valknutofficial1',
      'https://tiktok.com/@valknutofficial5',
      'https://youtube.com/@valknutofficial',
      'https://www.facebook.com/profile.php?id=61590816716304'
    ]
  };
}

/**
 * Generates Schema.org WebSite structured data with SearchAction
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'VALKNUT Official',
    description: 'Sri Lanka Dark Luxury Heavyweight Streetwear & Apparel',
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/#/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * Generates Schema.org Product structured data
 */
export function getProductJsonLd(product: Product) {
  const effectivePrice = product.salePrice ?? product.price;
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const images = Array.isArray(product?.images) ? product.images : [];
  const totalStock = variants.reduce((sum, v) => sum + (v.stock ?? v.stockCount ?? 0), 0);
  const primaryImage = images[0] || DEFAULT_OG_IMAGE;
  const canonicalUrl = `${BASE_URL}/#/product/${product.slug}`;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: product.name,
    image: images.length > 0 ? images : [primaryImage],
    description: product.description,
    sku: variants[0]?.sku || `VK-${(product.slug || 'ITEM').toUpperCase().slice(0, 8)}`,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'VALKNUT Official'
    },
    category: product.category,
    material: product.material,
    color: variants.map((v) => v.color).join(', '),
    size: variants.map((v) => v.size).join(', '),
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'LKR',
      price: effectivePrice,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@id': `${BASE_URL}/#organization`
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'LKR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LK'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          cutoffTime: '16:00:00+05:30',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

/**
 * Generates Schema.org ItemList for catalog and category pages
 */
export function getCollectionJsonLd(title: string, products: Product[], canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: canonicalUrl,
    description: `Shop the ${title} collection from VALKNUT Official Sri Lanka.`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 12).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/#/product/${prod.slug}`,
        name: prod.name,
        image: prod.images[0]
      }))
    }
  };
}

/**
 * SEO metadata generator for Shop / Category views
 */
export function getShopSEOMetadata(
  category?: CategoryType | 'ALL',
  subCategory?: string | 'ALL',
  collection?: string | 'ALL',
  products: Product[] = []
): SEOMetadata {
  const breadcrumbItems = [
    { name: 'Home', url: '/#/' },
    { name: 'Shop', url: '/#/shop' }
  ];

  // Subcategory specific
  if (subCategory && subCategory !== 'ALL') {
    const subCatName = subCategory;
    const catPrefix = category && category !== 'ALL' ? `${category}'s ` : '';
    const cleanSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
    const catSlug = category && category !== 'ALL' ? `${category.toLowerCase()}/` : '';
    const canonical = `${BASE_URL}/#/shop/${catSlug}${cleanSlug}`;

    if (category && category !== 'ALL') {
      breadcrumbItems.push({ name: `${category}`, url: `/#/shop/${category.toLowerCase()}` });
    }
    breadcrumbItems.push({ name: subCatName, url: `/#/shop/${catSlug}${cleanSlug}` });

    const title = `${catPrefix}${subCatName} | VALKNUT Official Sri Lanka`;
    const description = `Explore premium dark luxury ${catPrefix.toLowerCase()}${subCatName.toLowerCase()} crafted from heavy organic cotton with architectural silhouettes and sacred Norse geometry in Sri Lanka. Fast islandwide delivery.`;

    return {
      title,
      description,
      keywords: `${subCatName.toLowerCase()} sri lanka, ${catPrefix.toLowerCase()}${subCatName.toLowerCase()} colombo, 480gsm heavyweight hoodies, oversized streetwear lk, dark luxury valknut`,
      canonicalUrl: canonical,
      ogTitle: `${catPrefix}${subCatName} — VALKNUT Official`,
      ogDescription: `Heavy drape, minimalist occult typography, and supreme craftsmanship in Sri Lanka. Own Your Mind.`,
      ogImage: products[0]?.images[0] || DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: [
        getBreadcrumbSchema(breadcrumbItems),
        getCollectionJsonLd(title, products, canonical)
      ]
    };
  }

  // Collection specific
  if (collection && collection !== 'ALL') {
    const colSlug = collection.toLowerCase().replace(/\s+/g, '-');
    const canonical = `${BASE_URL}/#/shop?collection=${colSlug}`;
    breadcrumbItems.push({ name: collection, url: `/#/shop?collection=${colSlug}` });

    const title = `${collection} Drop | VALKNUT Official`;
    const description = `Shop the limited edition ${collection} capsule collection by VALKNUT Official. Ultra-heavyweight organic cotton apparel made in Sri Lanka.`;

    return {
      title,
      description,
      keywords: `${collection.toLowerCase()}, streetwear capsule sri lanka, valknut collection drop, dark streetwear colombo`,
      canonicalUrl: canonical,
      ogTitle: `${collection} Drop — VALKNUT Official`,
      ogDescription: `Limited drop streetwear from VALKNUT. Own Your Mind. Control Your World.`,
      ogImage: products[0]?.images[0] || DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: [
        getBreadcrumbSchema(breadcrumbItems),
        getCollectionJsonLd(title, products, canonical)
      ]
    };
  }

  // Category specific
  if (category === 'MEN') {
    const canonical = `${BASE_URL}/#/shop/men`;
    breadcrumbItems.push({ name: "Men's Streetwear", url: '/#/shop/men' });
    const title = "Men's Luxury Streetwear & Heavyweight Apparel | VALKNUT Official";
    const description = "Shop VALKNUT Men's dark luxury streetwear in Sri Lanka. 480GSM sovereign hoodies, boxy oversized t-shirts, tactical cargo joggers, and bespoke studio pieces.";

    return {
      title,
      description,
      keywords: 'men streetwear sri lanka, oversized t shirts men colombo, heavyweight hoodies men lk, pump cover gym, dark clothing men',
      canonicalUrl: canonical,
      ogTitle: "Men's Heavyweight Streetwear Collection — VALKNUT Official",
      ogDescription: 'Engineered for sovereignty and uncompromised presence. Made in Sri Lanka.',
      ogImage: products.find((p) => p.category === 'MEN')?.images[0] || DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: [
        getBreadcrumbSchema(breadcrumbItems),
        getCollectionJsonLd(title, products, canonical)
      ]
    };
  }

  if (category === 'WOMEN') {
    const canonical = `${BASE_URL}/#/shop/women`;
    breadcrumbItems.push({ name: "Women's Streetwear", url: '/#/shop/women' });
    const title = "Women's Sculpted Streetwear & Hoodies | VALKNUT Official";
    const description = "Discover VALKNUT Women's high-fashion streetwear. Raw-edge crop hoodies, boxy oversized tees, and luxury minimalist essentials in Sri Lanka.";

    return {
      title,
      description,
      keywords: 'women streetwear sri lanka, crop hoodies colombo, oversized tees women lk, dark luxury fashion women',
      canonicalUrl: canonical,
      ogTitle: "Women's Sculpted Streetwear — VALKNUT Official",
      ogDescription: 'Minimalist power aesthetics and heavyweight luxury cotton for women.',
      ogImage: products.find((p) => p.category === 'WOMEN')?.images[0] || DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: [
        getBreadcrumbSchema(breadcrumbItems),
        getCollectionJsonLd(title, products, canonical)
      ]
    };
  }

  if (category === 'ESSENTIALS') {
    const canonical = `${BASE_URL}/#/shop/essentials`;
    breadcrumbItems.push({ name: 'Everyday Essentials', url: '/#/shop/essentials' });
    const title = 'Everyday Essentials & Tactical Gear | VALKNUT Official';
    const description = 'Shop VALKNUT Everyday Essentials, Cordura tactical crossbody bags, 3D snapback caps, stainless steel insulated tumblers, and RFID leather wallets.';

    return {
      title,
      description,
      keywords: 'streetwear accessories sri lanka, tactical crossbody colombo, snapback cap lk, gym pump cover, insulated tumbler',
      canonicalUrl: canonical,
      ogTitle: 'Everyday Essentials & Tactical Accessories — VALKNUT Official',
      ogDescription: 'Functional luxury streetwear accessories and everyday core staples.',
      ogImage: products.find((p) => p.category === 'ESSENTIALS')?.images[0] || DEFAULT_OG_IMAGE,
      ogType: 'website',
      jsonLd: [
        getBreadcrumbSchema(breadcrumbItems),
        getCollectionJsonLd(title, products, canonical)
      ]
    };
  }

  // Default Shop All
  const canonical = `${BASE_URL}/#/shop`;
  const title = 'Shop All Dark Luxury Streetwear & Apparel | VALKNUT Official';
  const description = 'Browse the complete VALKNUT Official luxury streetwear catalog in Sri Lanka. 480GSM heavyweight hoodies, boxy graphic tees, tactical accessories, and custom studio garments.';

  return {
    title,
    description,
    keywords: 'streetwear sri lanka, valknut official shop, oversized t shirts colombo, luxury streetwear lk, koko pay clothes, buy hoodies sri lanka',
    canonicalUrl: canonical,
    ogTitle: 'VALKNUT Official — Complete Streetwear Catalog',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. Premium dark luxury garments engineered in Colombo.',
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    jsonLd: [
      getBreadcrumbSchema(breadcrumbItems),
      getCollectionJsonLd(title, products, canonical)
    ]
  };
}

/**
 * SEO metadata generator for Product Details
 */
export function getProductSEOMetadata(product: Product): SEOMetadata {
  const effectivePrice = product.salePrice ?? product.price;
  const images = Array.isArray(product?.images) ? product.images : [];
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const primaryImage = images[0] || DEFAULT_OG_IMAGE;
  const totalStock = variants.reduce((sum, v) => sum + (v.stock ?? v.stockCount ?? 0), 0);
  const isAvailable = totalStock > 0;
  const canonicalUrl = `${BASE_URL}/#/product/${product.slug}`;

  const breadcrumbs = [
    { name: 'Home', url: '/#/' },
    { name: 'Shop', url: '/#/shop' },
    { name: product.category, url: `/#/shop/${product.category.toLowerCase()}` },
    { name: product.name, url: `/#/product/${product.slug}` }
  ];

  return {
    title: `${product.name} | VALKNUT Official Sri Lanka`,
    description: `${product.description.slice(0, 155)}... Engineered with 480GSM heavy drape in Sri Lanka. Islandwide delivery & Koko 3x instalments available.`,
    keywords: `${product.name.toLowerCase()}, ${product.subCategory.toLowerCase()} sri lanka, valknut official, heavyweight streetwear colombo, buy ${product.subCategory.toLowerCase()}`,
    canonicalUrl,
    ogTitle: `${product.name} — VALKNUT Official`,
    ogDescription: `LKR ${effectivePrice.toLocaleString()} — ${product.material}. ${isAvailable ? 'In Stock Ready to Ship' : 'Limited Drop'}.`,
    ogImage: primaryImage,
    ogType: 'product',
    twitterCard: 'summary_large_image',
    jsonLd: [
      getBreadcrumbSchema(breadcrumbs),
      getProductJsonLd(product)
    ]
  };
}

/**
 * Custom Studio SEO Metadata
 */
export function getCustomStudioSEOMetadata(): SEOMetadata {
  const canonicalUrl = `${BASE_URL}/#/custom-studio`;
  const breadcrumbs = [
    { name: 'Home', url: '/#/' },
    { name: 'Custom Studio', url: '/#/custom-studio' }
  ];

  return {
    title: 'VALKNUT Custom Studio | Bespoke Luxury Streetwear & 3D Print Customizer',
    description: 'Design bespoke 480GSM hoodies, oversized tees, and luxury apparel. Upload artwork, add sacred Norse typography, and choose metallic gold embroidery or 3D puff print in Sri Lanka.',
    keywords: 'custom streetwear sri lanka, custom print tshirts colombo, bespoke hoodies lk, puff print custom clothes, gold embroidery streetwear',
    canonicalUrl,
    ogTitle: 'VALKNUT Custom Studio — Bespoke Dark Luxury Streetwear',
    ogDescription: 'Design your sovereign piece. Multi-perspective CAD preview, 3D puff print, and metallic gold embroidery.',
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    jsonLd: [
      getBreadcrumbSchema(breadcrumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'VALKNUT Bespoke Apparel Custom Studio',
        provider: {
          '@id': `${BASE_URL}/#organization`
        },
        serviceType: 'Bespoke Streetwear Customization',
        description: 'Multi-view 2D CAD visual preview, high-density puff rubber ink, metallic embroidery, and custom graphic print application on premium heavyweight garments.',
        areaServed: 'LK',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'LKR',
          price: '6800'
        }
      }
    ]
  };
}

/**
 * Applies dynamic SEO metadata to document head and injects JSON-LD script tags
 */
export function applySEOMetadata(metadata: SEOMetadata, structuredProduct?: Product) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = metadata.title;

  // Helper function to update or create meta tags
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMeta('title', metadata.title);
  setMeta('description', metadata.description);
  setMeta('keywords', metadata.keywords);
  setMeta('robots', 'index, follow, max-image-preview:large');

  // Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', metadata.canonicalUrl);

  // OpenGraph Tags
  setMeta('og:title', metadata.ogTitle || metadata.title, true);
  setMeta('og:description', metadata.ogDescription || metadata.description, true);
  setMeta('og:url', metadata.canonicalUrl, true);
  setMeta('og:type', metadata.ogType || 'website', true);
  setMeta('og:site_name', 'VALKNUT Official', true);
  setMeta('og:locale', 'en_US', true);
  if (metadata.ogImage) {
    setMeta('og:image', metadata.ogImage, true);
    setMeta('og:image:alt', metadata.title, true);
  }

  // Twitter Tags
  setMeta('twitter:card', metadata.twitterCard || 'summary_large_image');
  setMeta('twitter:site', '@valknutofficial');
  setMeta('twitter:creator', '@valknutofficial');
  setMeta('twitter:title', metadata.ogTitle || metadata.title);
  setMeta('twitter:description', metadata.ogDescription || metadata.description);
  if (metadata.ogImage) {
    setMeta('twitter:image', metadata.ogImage);
  }

  // Inject or Update Dynamic JSON-LD Structured Data
  let dynamicScript = document.getElementById('dynamic-jsonld-schema');
  if (!dynamicScript) {
    dynamicScript = document.createElement('script');
    dynamicScript.id = 'dynamic-jsonld-schema';
    dynamicScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(dynamicScript);
  }

  const schemasToInject: any[] = metadata.jsonLd ? [...metadata.jsonLd] : [];
  if (structuredProduct) {
    schemasToInject.push(getProductJsonLd(structuredProduct));
  }

  if (schemasToInject.length > 0) {
    dynamicScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemasToInject
    });
  } else {
    dynamicScript.textContent = '';
  }
}
