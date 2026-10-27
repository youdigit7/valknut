-- ==============================================================================
-- VALKNUT OFFICIAL - PRODUCTION SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Dark Luxury Streetwear E-Commerce Platform
-- ==============================================================================

-- 1. Enable Required UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Role & Permission Verification Helper Function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'email') = 'valknutofficial4@gmail.com' OR
    (auth.jwt() ->> 'email') LIKE '%@valknutofficial.com' OR
    (auth.jwt() ->> 'email') = 'admin@valknut.lk'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update categories" 
ON public.categories FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete categories" 
ON public.categories FOR DELETE 
USING (is_admin());

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS & VARIANTS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    material TEXT,
    care_instructions TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(10,2) CHECK (sale_price >= 0),
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    collection TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_customizable BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (is_archived = false OR is_admin());

CREATE POLICY "Admins have full access to products" 
ON public.products FOR ALL 
USING (is_admin());

CREATE POLICY "Public product variants are viewable by everyone" 
ON public.product_variants FOR SELECT 
USING (true);

-- Allow stock decrement on checkout (both authenticated customers and guests)
CREATE POLICY "Permit stock updates on checkout" 
ON public.product_variants FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins have full access to product variants" 
ON public.product_variants FOR ALL 
USING (is_admin());

-- RPC Functions to safely deduct stock without concurrency race conditions
CREATE OR REPLACE FUNCTION deduct_variant_stock(p_variant_id UUID, p_quantity INT)
RETURNS INT AS $$
DECLARE
  v_new_stock INT;
BEGIN
  UPDATE public.product_variants
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_variant_id
  RETURNING stock INTO v_new_stock;
  
  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION deduct_variant_stock_by_sku(p_sku TEXT, p_quantity INT)
RETURNS INT AS $$
DECLARE
  v_new_stock INT;
BEGIN
  UPDATE public.product_variants
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE sku = p_sku
  RETURNING stock INTO v_new_stock;
  
  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 5. COUPONS & DISCOUNTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    expiry_date TIMESTAMPTZ NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons are viewable by everyone for validation" 
ON public.coupons FOR SELECT 
USING (active = true AND expiry_date >= NOW());

CREATE POLICY "Admins have full access to coupons" 
ON public.coupons FOR ALL 
USING (is_admin());

-- ------------------------------------------------------------------------------
-- 6. CUSTOMER PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    delivery_address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own profile" 
ON public.customer_profiles FOR SELECT 
USING (auth.uid() = id OR is_admin());

CREATE POLICY "Customers can insert their own profile" 
ON public.customer_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Customers can update their own profile" 
ON public.customer_profiles FOR UPDATE 
USING (auth.uid() = id OR is_admin());

-- ------------------------------------------------------------------------------
-- 7. ORDERS & ORDER ITEMS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_info JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    shipping_charge NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    coupon_code TEXT,
    payment_gateway TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (order_status IN ('Order Placed', 'Confirmed', 'In Production', 'Customizing Artwork', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')),
    shipping_info JSONB DEFAULT '{}'::jsonb,
    payment_record JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_slug TEXT NOT NULL,
    sku TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    subtotal NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    customization_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders; guests can query by exact order_number + customer email
CREATE POLICY "Customers can view own orders" 
ON public.orders FOR SELECT 
USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
    is_admin()
);

-- Anyone can place an order (Guest & Authenticated checkout)
CREATE POLICY "Public order creation permitted" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Only admins can update orders (e.g. status changes, tracking updates)
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete orders" 
ON public.orders FOR DELETE 
USING (is_admin());

CREATE POLICY "Customers can view items of their own orders" 
ON public.order_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR is_admin())
    )
);

CREATE POLICY "Public order items creation permitted on checkout" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can delete order items" 
ON public.order_items FOR DELETE 
USING (is_admin());

-- ------------------------------------------------------------------------------
-- 8. PERFORMANCE INDEXES FOR FAST ORGANIC QUERIES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection);
CREATE INDEX IF NOT EXISTS idx_products_is_archived ON public.products(is_archived);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- 9. NEWSLETTER & VIP CLUB SUBSCRIBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT 'footer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe to the early access / VIP club drop list
CREATE POLICY "Public newsletter subscription permitted" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Only admins can view subscriber emails
CREATE POLICY "Admins can view newsletter subscribers" 
ON public.newsletter_subscribers FOR SELECT 
USING (is_admin());

-- Only admins can delete newsletter subscribers
CREATE POLICY "Admins can delete newsletter subscribers" 
ON public.newsletter_subscribers FOR DELETE 
USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON public.newsletter_subscribers(created_at DESC);
