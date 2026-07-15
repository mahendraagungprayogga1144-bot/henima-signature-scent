-- Stok bahan baku / BOM sederhana (terpisah dari products toko)
-- Jalankan manual di Supabase SQL Editor setelah review.

CREATE TABLE IF NOT EXISTS material_stocks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  unit        TEXT        NOT NULL DEFAULT 'pcs',
  qty         DOUBLE PRECISION NOT NULL DEFAULT 0,
  unit_cost   BIGINT      NOT NULL DEFAULT 0,
  notes       TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_movements (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id  UUID        NOT NULL REFERENCES material_stocks(id) ON DELETE CASCADE,
  jenis        TEXT        NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  qty          DOUBLE PRECISION NOT NULL,
  catatan      TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS material_movements_material_idx ON material_movements (material_id);

ALTER TABLE material_stocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_movements DISABLE ROW LEVEL SECURITY;

INSERT INTO material_stocks (name, unit, qty, unit_cost, notes)
SELECT * FROM (VALUES
  ('Bibit parfum (ml)', 'ml', 0::float8, 0::bigint, 'Stok bibit siap pakai'),
  ('Botol 50ml', 'pcs', 0::float8, 7500::bigint, ''),
  ('Box kemasan', 'pcs', 0::float8, 9000::bigint, ''),
  ('Alkohol / pelarut (ml)', 'ml', 0::float8, 0::bigint, '')
) AS v(name, unit, qty, unit_cost, notes)
WHERE NOT EXISTS (SELECT 1 FROM material_stocks LIMIT 1);
