-- ====================================================================
-- KING CROCKERY STORE — COMPLETE PRODUCTION RELATIONAL DATABASE SCHEMA
-- Target: PostgreSQL / Supabase
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Store Settings
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name VARCHAR(150) NOT NULL DEFAULT 'King Crockery Store',
  tagline TEXT DEFAULT 'Make Every Meal a Beautiful Experience',
  announcement_bar_enabled BOOLEAN DEFAULT true,
  announcement_bar_text TEXT DEFAULT 'Pay in advance via Bank Transfer & receive an instant 4% discount! Cash on Delivery available across Pakistan.',
  hero_headline TEXT DEFAULT 'Make Every Meal a Beautiful Experience',
  hero_supporting_text TEXT DEFAULT 'Discover elegant dinnerware, premium serving essentials and thoughtfully selected crockery for every occasion.',
  hero_image_url TEXT,
  advance_payment_discount_pct NUMERIC(4,2) DEFAULT 4.00,
  shipping_charges NUMERIC(10,2) DEFAULT 250.00,
  free_shipping_threshold NUMERIC(10,2) DEFAULT 5000.00,
  phone1 VARCHAR(50) DEFAULT '+92-21-32710174',
  phone2 VARCHAR(50) DEFAULT '+92-21-32710492',
  email VARCHAR(150) DEFAULT 'kingcrockery@hotmail.com',
  whatsapp_number VARCHAR(50) DEFAULT '923002710174',
  address TEXT DEFAULT 'Shop No B27 & B28, Basement Floor, City Shopping Center, Marston Road, Behind Gul Plaza, Karachi, Pakistan',
  bank_name VARCHAR(150) DEFAULT 'Meezan Bank Limited',
  bank_account_title VARCHAR(150) DEFAULT 'KING CROCKERY STORE',
  bank_account_number VARCHAR(100) DEFAULT '01010102948291',
  bank_iban VARCHAR(100) DEFAULT 'PK45MEZN0001010102948291',
  bank_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- 6. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  sku VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true
);

-- 7. Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Customer Addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  recipient_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL,
  postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT false
);

-- 9. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  delivery_address TEXT NOT NULL,
  postal_code VARCHAR(20),
  order_notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL,
  shipping_fee NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  final_total NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer', 'online')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'proof_submitted', 'verified', 'paid', 'failed')),
  payment_proof_url TEXT,
  order_status VARCHAR(50) DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  tracking_number VARCHAR(100),
  courier_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title VARCHAR(255) NOT NULL,
  variant_id UUID,
  variant_name VARCHAR(150),
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  image_url TEXT
);

-- 11. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(150) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(150) UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read products, categories, reviews, and store settings
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON store_settings FOR SELECT USING (true);

-- Customers can view their own orders
CREATE POLICY "Customers view own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
