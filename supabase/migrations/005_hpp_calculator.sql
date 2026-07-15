-- Kalkulator HPP & Profit (alat internal PT Henima Collection)
-- TABEL TERPISAH — tidak menyentuh `products` maupun `hpp_products` (Buku Kas).
-- Akses dijaga di Next.js admin layout (role = admin).
-- Jalankan manual di Supabase SQL Editor setelah review.

CREATE TABLE IF NOT EXISTS hpp_calculator_products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  inputs      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hpp_calculator_products_sort_idx
  ON hpp_calculator_products (sort_order ASC, created_at ASC);

-- Pola yang sama dengan tabel keuangan / users di project ini:
-- auth custom (public.users + session cookie), bukan Supabase Auth,
-- jadi RLS dimatikan; gate akses lewat /admin + API admin.
ALTER TABLE hpp_calculator_products DISABLE ROW LEVEL SECURITY;

-- Seed 3 produk default (hanya jika tabel masih kosong)
INSERT INTO hpp_calculator_products (slug, name, inputs, sort_order)
SELECT * FROM (VALUES
  (
    'afternoon',
    'Afternoon',
    '{
      "totalStok": 2000,
      "batch1Qty": 540,
      "cBotol": 7500,
      "cBox": 9000,
      "cSablonTotal": 1400000,
      "cBpomTotal": 6500000,
      "cPpn": 7777,
      "bibitHarga": 19540000,
      "bibitGram": 14000,
      "bibitPerBotol": 25,
      "hargaB1": 150000,
      "hargaB2": 140000,
      "komisiPct": 25
    }'::jsonb,
    0
  ),
  (
    'brave-man-intense',
    'Brave Man Intense',
    '{
      "totalStok": 2000,
      "batch1Qty": 540,
      "cBotol": 7500,
      "cBox": 9000,
      "cSablonTotal": 1400000,
      "cBpomTotal": 6500000,
      "cPpn": 7777,
      "bibitHarga": 19540000,
      "bibitGram": 14000,
      "bibitPerBotol": 25,
      "hargaB1": 150000,
      "hargaB2": 140000,
      "komisiPct": 25
    }'::jsonb,
    1
  ),
  (
    'the-distance',
    'The Distance',
    '{
      "totalStok": 2000,
      "batch1Qty": 540,
      "cBotol": 7500,
      "cBox": 9000,
      "cSablonTotal": 1400000,
      "cBpomTotal": 6500000,
      "cPpn": 7777,
      "bibitHarga": 19540000,
      "bibitGram": 14000,
      "bibitPerBotol": 25,
      "hargaB1": 150000,
      "hargaB2": 140000,
      "komisiPct": 25
    }'::jsonb,
    2
  )
) AS v(slug, name, inputs, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM hpp_calculator_products LIMIT 1);
