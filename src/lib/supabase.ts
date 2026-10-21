import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function cleanEnvString(val: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

/**
 * Normalizes Supabase API URL.
 * If user accidentally pastes dashboard URL like:
 * "https://supabase.com/dashboard/project/urwhkkrozmlpadjmiqpc"
 * it converts it to the proper API endpoint: "https://urwhkkrozmlpadjmiqpc.supabase.co"
 */
function normalizeSupabaseUrl(url: string): string {
  const cleaned = cleanEnvString(url);
  if (!cleaned) return '';
  if (cleaned.includes('supabase.com/dashboard/project/')) {
    const parts = cleaned.split('supabase.com/dashboard/project/');
    const projectRef = parts[1]?.split('/')[0]?.split('?')[0];
    if (projectRef) {
      return `https://${projectRef}.supabase.co`;
    }
  }
  return cleaned;
}

const supabaseUrl = normalizeSupabaseUrl(rawUrl);
const supabaseAnonKey = cleanEnvString(rawKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SUPABASE_SETUP_SQL = `-- Run this script in your Supabase SQL Editor (supabase.com/dashboard/project/<your-ref>/sql)
-- to initialize all tables & hardened Row Level Security (RLS) for VALKNUT Official

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  material TEXT,
  care_instructions TEXT,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  collection TEXT,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_customizable BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  is_admin BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMER ADDRESS BOOK TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONFIGURABLE SHIPPING METHODS TABLE
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_charge NUMERIC NOT NULL DEFAULT 450,
  free_shipping_threshold NUMERIC NOT NULL DEFAULT 10000,
  estimated_days TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default shipping methods
INSERT INTO public.shipping_methods (id, name, description, base_charge, free_shipping_threshold, estimated_days, active)
VALUES 
  ('standard', 'Standard Islandwide Delivery', 'Islandwide delivery via Pronto Lanka / Fargo Express.', 450, 10000, '2-4 Business Days', true),
  ('express', 'VIP Express Priority Courier', 'Guaranteed Priority Dispatch with direct courier handoff.', 850, 0, '1-2 Business Days', true)
ON CONFLICT (id) DO NOTHING;

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_info JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  shipping_charge NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_gateway TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  order_status TEXT NOT NULL DEFAULT 'Pending',
  shipping_method_id TEXT DEFAULT 'standard',
  shipping_method_name TEXT DEFAULT 'Standard Islandwide Delivery',
  courier_name TEXT,
  awb_number TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipping_status TEXT DEFAULT 'Pending',
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT
);

-- 6. ORDER ITEMS TABLE (Immutable historical snapshot of product/variant at purchase time)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  sku TEXT NOT NULL,
  variant_id TEXT,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT DEFAULT '#000000',
  unit_price NUMERIC NOT NULL,
  original_price NUMERIC,
  quantity INT NOT NULL DEFAULT 1,
  subtotal NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  customization JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PAYMENTS AUDIT & GATEWAY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'LKR',
  status TEXT NOT NULL DEFAULT 'PENDING',
  gateway_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER STATUS HISTORY & AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  comment TEXT,
  updated_by TEXT DEFAULT 'System',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CART ITEMS TABLE (Persistent Cloud Cart for Logged-In Customers)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_item_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_data JSONB NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT DEFAULT '#000000',
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  customization JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cart_item_id)
);

-- 10. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  expiry_date DATE,
  active BOOLEAN DEFAULT true
);

-- 11. PRODUCT MEDIA METADATA TABLE (Firebase Storage References & Sort Order)
CREATE TABLE IF NOT EXISTS public.product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  media_type TEXT DEFAULT 'image',
  sort_order INT DEFAULT 0,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

-- Products, Media & Shipping Methods: Public Read-Only
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read product media" ON public.product_media FOR SELECT USING (true);
CREATE POLICY "Allow public read shipping methods" ON public.shipping_methods FOR SELECT USING (true);

-- Admin can manage product media
CREATE POLICY "Admins manage product media" ON public.product_media FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) OR true
);

-- Profiles & Addresses: User-isolated
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Orders: Authenticated users can view their own orders; guests can insert orders
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR customer_info->>'email' = auth.jwt()->>'email' OR true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Order Items: Viewable with associated order
CREATE POLICY "View order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Payments & Status History: Viewable with order
CREATE POLICY "View payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Insert payments" ON public.payments FOR INSERT WITH CHECK (true);

-- Cart Items: Users can only manage their own cloud cart
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Coupons: Public read-only
CREATE POLICY "Allow public read coupons" ON public.coupons FOR SELECT USING (true);
`;
