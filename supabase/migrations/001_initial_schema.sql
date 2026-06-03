-- Toko Reseller – initial Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  photo         TEXT        NOT NULL DEFAULT '/products/placeholder.svg',
  original_price BIGINT     NOT NULL DEFAULT 0,
  discount_price BIGINT     NOT NULL DEFAULT 0,
  active        BOOLEAN     NOT NULL DEFAULT true,
  variants      JSONB       NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS users (
  id            TEXT        PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  phone         TEXT        NOT NULL DEFAULT '',
  role          TEXT        NOT NULL DEFAULT 'reseller'
                            CHECK (role IN ('admin', 'reseller')),
  store_name    TEXT        NOT NULL DEFAULT '',
  address       TEXT,
  reseller      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                   TEXT        PRIMARY KEY,
  reseller_id          TEXT        NOT NULL,
  reseller_name        TEXT        NOT NULL DEFAULT '',
  reseller_phone       TEXT        NOT NULL DEFAULT '',
  store_name           TEXT        NOT NULL DEFAULT '',
  order_type           TEXT        NOT NULL DEFAULT 'reseller'
                                   CHECK (order_type IN ('reseller', 'satuan')),
  shipping             JSONB       NOT NULL DEFAULT '{}',
  courier              TEXT        NOT NULL DEFAULT 'jne',
  items                JSONB       NOT NULL DEFAULT '[]',
  total                BIGINT      NOT NULL DEFAULT 0,
  status               TEXT        NOT NULL DEFAULT 'pending_payment',
  status_history       JSONB       NOT NULL DEFAULT '[]',
  payment_method       TEXT,
  payment_proof        TEXT,
  payment_bank         TEXT,
  payment_confirmed_at TIMESTAMPTZ,
  invoice_pdf          TEXT,
  resi                 TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id      INTEGER PRIMARY KEY DEFAULT 1,
  company JSONB   NOT NULL DEFAULT '{}',
  payment JSONB   NOT NULL DEFAULT '{}'
);

-- ============================================================
-- Disable RLS (all ops happen server-side via Next.js API routes)
-- For production, consider switching to the service_role key and
-- enabling RLS with appropriate policies.
-- ============================================================

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users    DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders   DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Seed data (migrated from data/db.json)
-- ============================================================

INSERT INTO settings (id, company, payment) VALUES (
  1,
  '{
    "name": "Henima Signature Scent",
    "whatsappNumber": "085190311230",
    "address": "Sidoarjo Jawa timur",
    "tagline": "Luxury scent, crafted for your signature.",
    "vision": "menjadikan bra",
    "mission": "",
    "brandStory": ""
  }',
  '{
    "qrisImage": "/uploads/qris/qris-1780405586617.png",
    "bankAccounts": [
      {"code": "bca",     "bankName": "BCA",     "accountNumber": "2712008173", "accountName": "PT Henima Collection Indo",  "active": true},
      {"code": "mandiri", "bankName": "Mandiri", "accountNumber": "0000000000", "accountName": "Henima Signature Scent", "active": false},
      {"code": "bri",     "bankName": "BRI",     "accountNumber": "0000000000", "accountName": "Henima Signature Scent", "active": false}
    ]
  }'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, photo, original_price, discount_price, active, variants) VALUES
(
  'prod-afternoon',
  'Afternoon',
  'Blend kopi dengan rasa lembut dan aroma floral, cocok untuk sore hari.',
  '/products/afternoon.svg',
  185000, 185000, true,
  '[
    {"id":"prod-afternoon-30",  "sizeMl":30,  "stock":0, "originalPrice":185000, "discountPrice":185000, "active":true},
    {"id":"prod-afternoon-50",  "sizeMl":50,  "stock":0, "originalPrice":185000, "discountPrice":185000, "active":true},
    {"id":"prod-afternoon-100", "sizeMl":100, "stock":0, "originalPrice":185000, "discountPrice":185000, "active":true}
  ]'
),
(
  'prod-distance',
  'Distance',
  'Blend bold dengan notes cokelat dan karamel, untuk penikmat kopi kuat.',
  '/products/distance.svg',
  195000, 195000, true,
  '[
    {"id":"prod-distance-30",  "sizeMl":30,  "stock":0, "originalPrice":195000, "discountPrice":195000, "active":true},
    {"id":"prod-distance-50",  "sizeMl":50,  "stock":0, "originalPrice":195000, "discountPrice":195000, "active":true},
    {"id":"prod-distance-100", "sizeMl":100, "stock":0, "originalPrice":195000, "discountPrice":195000, "active":true}
  ]'
)
ON CONFLICT (id) DO NOTHING;

-- Admin user  (password: admin123)
-- Reseller demo (password: reseller123)
INSERT INTO users (id, email, password_hash, name, phone, role, store_name, address, reseller, created_at) VALUES
(
  'user-admin',
  'admin@toko.local',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Administrator',
  '6281234567890',
  'admin',
  'Toko Pusat',
  NULL,
  NULL,
  '2025-01-01T00:00:00.000Z'
),
(
  'user-reseller-1',
  'reseller@demo.local',
  '69ff63ab831a811281d43c71c31fee45924edcb73993179c5c6ca0ece3e62fd2',
  'Budi Santoso',
  '6289876543210',
  'reseller',
  'Kopi Nusantara',
  'Jl. Melati No. 12, Bandung',
  '{"approved":true,"tier":"Bronze","commissionPct":0,"commissionEarned":0}',
  '2025-02-01T00:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;
