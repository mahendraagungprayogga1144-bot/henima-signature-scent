-- Stok bahan baku (jalankan di Supabase SQL Editor)
-- Aman dijalankan ulang.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS material_stocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  unit        TEXT NOT NULL DEFAULT 'pcs',
  qty         NUMERIC NOT NULL DEFAULT 0,
  unit_cost   BIGINT NOT NULL DEFAULT 0,
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_movements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id  UUID NOT NULL REFERENCES material_stocks(id) ON DELETE CASCADE,
  jenis        TEXT NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  qty          NUMERIC NOT NULL,
  catatan      TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS material_movements_material_idx
  ON material_movements (material_id);

ALTER TABLE material_stocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_movements DISABLE ROW LEVEL SECURITY;

-- Seed awal (hanya jika tabel masih kosong)
INSERT INTO material_stocks (name, unit, qty, unit_cost, notes)
SELECT 'Bibit parfum (ml)', 'ml', 0, 0, 'Stok bibit siap pakai'
WHERE NOT EXISTS (SELECT 1 FROM material_stocks LIMIT 1);

INSERT INTO material_stocks (name, unit, qty, unit_cost, notes)
SELECT 'Botol 50ml', 'pcs', 0, 7500, ''
WHERE (SELECT COUNT(*) FROM material_stocks) < 4
  AND NOT EXISTS (SELECT 1 FROM material_stocks WHERE name = 'Botol 50ml');

INSERT INTO material_stocks (name, unit, qty, unit_cost, notes)
SELECT 'Box kemasan', 'pcs', 0, 9000, ''
WHERE (SELECT COUNT(*) FROM material_stocks) < 4
  AND NOT EXISTS (SELECT 1 FROM material_stocks WHERE name = 'Box kemasan');

INSERT INTO material_stocks (name, unit, qty, unit_cost, notes)
SELECT 'Alkohol / pelarut (ml)', 'ml', 0, 0, ''
WHERE (SELECT COUNT(*) FROM material_stocks) < 4
  AND NOT EXISTS (SELECT 1 FROM material_stocks WHERE name = 'Alkohol / pelarut (ml)');
