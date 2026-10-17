import type { Product, Coupon, Order } from '../types/ecommerce';

// Authoritative Catalog: Live products are retrieved directly from Supabase Database and Cloudinary CDN
export const INITIAL_PRODUCTS: Product[] = [];

export const DEMO_CUSTOMER_EMAILS = [
  'kasun.perera@example.lk',
  'dilini.s@example.com'
];

export const DEMO_ORDER_IDS = ['ord-1001', 'ord-1002'];

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
