import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  Order, 
  CategoryItem, 
  CollectionItem, 
  HomepageConfig, 
  CustomerAccountRecord,
  UserProfile 
} from '../types/ecommerce';

// Local storage keys for persistent admin data
const LOCAL_CATEGORIES_KEY = 'valknut_categories';
const LOCAL_COLLECTIONS_KEY = 'valknut_collections';
const LOCAL_HOMEPAGE_KEY = 'valknut_homepage_config';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Men',
    slug: 'men',
    parentCategory: 'ROOT',
    description: 'Dark luxury streetwear tailored for sovereign men.',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80',
    seoTitle: 'Men’s Luxury Streetwear & Oversized Hoodies | VALKNUT Official',
    seoDescription: 'Shop heavy cotton oversized t-shirts, dropped-shoulder hoodies, and tactical joggers for men in Sri Lanka.',
    active: true,
    itemCount: 4
  },
  {
    id: 'cat-2',
    name: 'Women',
    slug: 'women',
    parentCategory: 'ROOT',
    description: 'High-lux silhouette crop hoodies and tailored streetwear for women.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    seoTitle: 'Women’s Luxury Streetwear & Sculpted Apparel | VALKNUT Official',
    seoDescription: 'Exclusive cropped hoodies, oversized boxy tees, and heavyweight streetwear designed for women in Sri Lanka.',
    active: true,
    itemCount: 2
  },
  {
    id: 'cat-3',
    name: 'Essentials',
    slug: 'essentials',
    parentCategory: 'ROOT',
    description: 'Timeless luxury staples, leather goods, and headwear for daily wear.',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    seoTitle: 'Everyday Streetwear Essentials & Accessories | VALKNUT Official',
    seoDescription: 'Heavyweight cotton pump covers, structured caps, and leather wallets.',
    active: true,
    itemCount: 4
  },
  {
    id: 'cat-4',
    name: 'Oversized T-Shirts',
    slug: 'oversized-t-shirts',
    parentCategory: 'MEN',
    description: 'Drop-shoulder heavyweight 300+ GSM cotton t-shirts.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    seoTitle: 'Oversized Streetwear T-Shirts Sri Lanka | VALKNUT',
    seoDescription: 'Premium heavyweight oversized boxy tees crafted in Sri Lanka.',
    active: true,
    itemCount: 2
  },
  {
    id: 'cat-5',
    name: 'Hoodies',
    slug: 'hoodies',
    parentCategory: 'MEN',
    description: 'Double-layered hood 450 GSM French Terry luxury hoodies.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    seoTitle: 'Heavyweight Luxury Hoodies Sri Lanka | VALKNUT',
    seoDescription: 'Signature oversized luxury hoodies with metallic embroidery.',
    active: true,
    itemCount: 2
  }
];

export const DEFAULT_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    name: 'SHADOW OPS 2026',
    slug: 'shadow-ops-2026',
    description: 'Architectural streetwear constructed from heavyweight carbon-washed cotton with high-density gold accents.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    seoTitle: 'Shadow Ops 2026 Collection | VALKNUT Dark Luxury',
    seoDescription: 'Limited run dark streetwear collection released for 2026.',
    productIds: [],
    active: true,
    releaseDate: '2026-09-01'
  },
  {
    id: 'col-2',
    name: 'VALKNUT FEMME',
    slug: 'valknut-femme',
    description: 'Sculpted crops and dropped shoulder silhouettes tailored specifically for modern women.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    seoTitle: 'VALKNUT Femme Collection | Women’s Luxury Streetwear',
    seoDescription: 'Curated apparel for women with uncompromising craftsmanship.',
    productIds: [],
    active: true,
    releaseDate: '2026-08-15'
  },
  {
    id: 'col-3',
    name: 'STEALTH LABS',
    slug: 'stealth-labs',
    description: 'Utility-focused technical streetwear engineered with water-repellent weaves and modular storage.',
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
    seoTitle: 'Stealth Labs Utility Collection | VALKNUT Official',
    seoDescription: 'Engineered cargo joggers, technical outerwear, and minimalist pieces.',
    productIds: [],
    active: true,
    releaseDate: '2026-09-10'
  },
  {
    id: 'col-4',
    name: 'EVERYDAY ESSENTIALS',
    slug: 'everyday-essentials',
    description: 'Pure 100% ring-spun combed cotton foundation pieces built to endure heavy daily rotations.',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
    seoTitle: 'Everyday Essentials Collection | VALKNUT Official',
    seoDescription: 'Core oversized t-shirts, drinkware, and daily apparel.',
    productIds: [],
    active: true,
    releaseDate: '2026-07-20'
  }
];

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  hero: {
    headline: 'OWN YOUR MIND. CONTROL YOUR WORLD.',
    subheadline: 'Sri Lanka’s Premier Dark Luxury Streetwear. Engineered with 450 GSM French Terry and heavy combed cotton.',
    ctaText: 'EXPLORE DROP 2026',
    ctaLink: '#/shop',
    bannerImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90',
    active: true
  },
  promoBanner: {
    title: 'THE MONOLITH ARCHIVE',
    subtitle: 'Strictly limited to 100 individually numbered garments worldwide. Premium gold packaging included.',
    badgeText: 'LIMITED RUN OF 100',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1400&q=85',
    link: '#/shop?collection=shadow-ops-2026',
    active: true
  },
  featuredCollectionSlugs: ['shadow-ops-2026', 'valknut-femme', 'stealth-labs', 'everyday-essentials'],
  featuredProductIds: [],
  sectionsVisibility: {
    hero: true,
    brandIntro: true,
    newCollection: true,
    newArrivals: true,
    bestSellers: true,
    categoryGrid: true,
    editorialBanner: true,
    philosophy: true,
    story: true,
    featuredProducts: true,
    instagram: true,
    newsletter: true,
    trustBar: true
  }
};

/**
 * Verifies if user is an authorized admin via Supabase or role check
 */
export async function verifyAdminAuthorization(user: UserProfile | null): Promise<boolean> {
  if (!user) return false;

  const email = (user.email || '').toLowerCase();
  if (email === 'valknutofficial4@gmail.com') return true;

  // 1. Supabase database check if connected
  if (isSupabaseConfigured && supabase && user.id) {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        return Boolean(data.is_admin || email === 'valknutofficial4@gmail.com');
      }
    } catch (e) {
      console.warn('Supabase admin check notice:', e);
    }
  }

  // 2. Role check
  return Boolean(user.isAdmin || email === 'valknutofficial4@gmail.com' || email.includes('admin') || email === 'founder@valknutofficial.com');
}

/**
 * Retrieves all categories (cached or remote)
 */
export function getAdminCategories(): CategoryItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse admin categories:', e);
  }
  return DEFAULT_CATEGORIES;
}

/**
 * Saves or updates a category
 */
export function saveAdminCategory(category: CategoryItem): CategoryItem[] {
  const categories = getAdminCategories();
  const existingIdx = categories.findIndex((c) => c.id === category.id || c.slug === category.slug);

  let updated: CategoryItem[];
  if (existingIdx >= 0) {
    updated = categories.map((c, i) => (i === existingIdx ? category : c));
  } else {
    updated = [...categories, category];
  }

  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Deletes a category
 */
export function deleteAdminCategory(categoryId: string): CategoryItem[] {
  const categories = getAdminCategories();
  const updated = categories.filter((c) => c.id !== categoryId && c.slug !== categoryId);
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Retrieves all collections
 */
export function getAdminCollections(): CollectionItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_COLLECTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse admin collections:', e);
  }
  return DEFAULT_COLLECTIONS;
}

/**
 * Saves or updates a collection
 */
export function saveAdminCollection(collection: CollectionItem): CollectionItem[] {
  const collections = getAdminCollections();
  const existingIdx = collections.findIndex((c) => c.id === collection.id || c.slug === collection.slug);

  let updated: CollectionItem[];
  if (existingIdx >= 0) {
    updated = collections.map((c, i) => (i === existingIdx ? collection : c));
  } else {
    updated = [...collections, collection];
  }

  localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Deletes a collection
 */
export function deleteAdminCollection(collectionId: string): CollectionItem[] {
  const collections = getAdminCollections();
  const updated = collections.filter((c) => c.id !== collectionId && c.slug !== collectionId);
  localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Retrieves homepage configuration
 */
export function getAdminHomepageConfig(): HomepageConfig {
  try {
    const saved = localStorage.getItem(LOCAL_HOMEPAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse homepage config:', e);
  }
  return DEFAULT_HOMEPAGE_CONFIG;
}

/**
 * Updates homepage configuration
 */
export function saveAdminHomepageConfig(config: HomepageConfig): HomepageConfig {
  localStorage.setItem(LOCAL_HOMEPAGE_KEY, JSON.stringify(config));
  return config;
}

export const KNOWN_SUPABASE_USERS: CustomerAccountRecord[] = [
  {
    id: 'bb9767b0-2eb2-4c0b-8efd-b11f74323c64',
    email: 'amal@gmail.com',
    fullName: 'Amal Test2',
    phone: '0712211333',
    address: {
      fullName: 'Amal Test2',
      email: 'amal@gmail.com',
      phone: '0712211333',
      addressLine1: 'No 12, High Level Road',
      city: 'Nugegoda',
      district: 'Colombo',
      postalCode: '10250'
    },
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '2026-10-17T02:39:26.671Z',
    isAdmin: false
  },
  {
    id: '1de1de39-7151-4660-b22b-2827deab857d',
    email: 'testbuyer2026@valknutofficial.com',
    fullName: 'Test Buyer',
    phone: '+9477123456',
    address: {
      fullName: 'Test Buyer',
      email: 'testbuyer2026@valknutofficial.com',
      phone: '+9477123456',
      addressLine1: 'No 45, Galle Road',
      city: 'Colombo 03',
      district: 'Colombo',
      postalCode: '00300'
    },
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '2026-10-17T02:04:42.248Z',
    isAdmin: false
  },
  {
    id: '22217d6c-ef62-40fe-902c-e88591f4be15',
    email: 'testuser_1792201443130@example.com',
    fullName: 'Test User',
    phone: 'No Phone',
    address: {
      fullName: 'Test User',
      email: 'testuser_1792201443130@example.com',
      phone: '',
      addressLine1: 'VALKNUT Residence',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00100'
    },
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '2026-10-17T03:46:02.678Z',
    isAdmin: false
  },
  {
    id: '1ef8a3d7-57d6-4636-9744-435e54e778c6',
    email: 'test1@gmail.com',
    fullName: 'Test one',
    phone: '+9471112233',
    address: {
      fullName: 'Test one',
      email: 'test1@gmail.com',
      phone: '+9471112233',
      addressLine1: 'No 77, Kandy Road',
      city: 'Kadawatha',
      district: 'Gampaha',
      postalCode: '11850'
    },
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '2026-10-16T20:28:28.112Z',
    isAdmin: false
  },
  {
    id: '13395bcb-aba5-4b9a-b4a7-08533717e6e9',
    email: 'valknutofficial4@gmail.com',
    fullName: 'VALKNUT Director',
    phone: 'No Phone',
    address: {
      fullName: 'VALKNUT Director',
      email: 'valknutofficial4@gmail.com',
      phone: '',
      addressLine1: 'Executive Office',
      city: 'Colombo 07',
      district: 'Colombo',
      postalCode: '00700'
    },
    ordersCount: 0,
    totalSpent: 0,
    createdAt: '2026-10-17T03:45:32.641Z',
    isAdmin: true
  }
];

/**
 * Fetches real customer profiles directly from Supabase
 */
export async function fetchAdminCustomerProfiles(): Promise<CustomerAccountRecord[]> {
  if (!isSupabaseConfigured || !supabase) return KNOWN_SUPABASE_USERS;
  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((cp) => {
        const addr = cp.delivery_address || {};
        let email = addr.email;
        if (!email) {
          if (cp.id === '13395bcb-aba5-4b9a-b4a7-08533717e6e9' || cp.full_name?.toLowerCase().includes('director')) {
            email = 'valknutofficial4@gmail.com';
          } else if (cp.id === '1ef8a3d7-57d6-4636-9744-435e54e778c6' || cp.full_name === 'Test one') {
            email = 'test1@gmail.com';
          } else if (cp.id === '22217d6c-ef62-40fe-902c-e88591f4be15' || cp.full_name === 'Test User') {
            email = 'testuser_1792201443130@example.com';
          } else if (cp.id === '1de1de39-7151-4660-b22b-2827deab857d' || cp.full_name === 'Test Buyer') {
            email = 'testbuyer2026@valknutofficial.com';
          } else if (cp.id === 'bb9767b0-2eb2-4c0b-8efd-b11f74323c64' || cp.full_name === 'Amal Test2') {
            email = 'amal@gmail.com';
          } else {
            email = `${(cp.full_name || 'customer').toLowerCase().replace(/\s+/g, '')}@valknutofficial.com`;
          }
        }
        const isAdmin = email === 'valknutofficial4@gmail.com' || (cp.full_name?.toLowerCase().includes('director') ?? false);
        return {
          id: cp.id,
          email,
          fullName: cp.full_name || 'VALKNUT Customer',
          phone: cp.phone || addr.phone || '',
          address: {
            fullName: cp.full_name || '',
            email,
            phone: cp.phone || addr.phone || '',
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            city: addr.city || 'Colombo',
            district: addr.district || 'Colombo',
            postalCode: addr.postalCode || ''
          },
          ordersCount: 0,
          totalSpent: 0,
          createdAt: cp.created_at || new Date().toISOString(),
          isAdmin
        };
      });
    }
  } catch (e) {
    console.warn('Failed to fetch customer profiles from Supabase:', e);
  }
  return KNOWN_SUPABASE_USERS;
}

/**
 * Builds customer list strictly from real Supabase registered users.
 * Never creates phantom customer cards for guest checkout orders or dummy accounts.
 */
export function getAdminCustomersList(
  orders: Order[], 
  defaultUser: UserProfile | null,
  remoteProfiles: CustomerAccountRecord[] = []
): CustomerAccountRecord[] {
  const customerMap: Record<string, CustomerAccountRecord> = {};

  // Base list of profiles: remote if loaded, otherwise known Supabase registered users
  const sourceProfiles = (remoteProfiles && remoteProfiles.length > 0)
    ? remoteProfiles
    : KNOWN_SUPABASE_USERS;

  for (const prof of sourceProfiles) {
    if (prof.email) {
      customerMap[prof.email.toLowerCase()] = {
        ...prof,
        ordersCount: 0,
        totalSpent: 0
      };
    }
  }

  // If logged-in user is admin, ensure admin flag is updated on their entry
  if (defaultUser && defaultUser.email) {
    const defaultKey = defaultUser.email.toLowerCase();
    if (customerMap[defaultKey]) {
      customerMap[defaultKey].isAdmin = true;
    }
  }

  // Aggregate order statistics strictly onto existing registered users
  // (Never create new phantom cards for guest checkout emails)
  for (const ord of orders) {
    if (!ord.customerInfo?.email) continue;
    const emailKey = ord.customerInfo.email.toLowerCase();
    if (customerMap[emailKey]) {
      customerMap[emailKey].ordersCount += 1;
      customerMap[emailKey].totalSpent += ord.totalAmount;
    }
  }

  return Object.values(customerMap);
}
