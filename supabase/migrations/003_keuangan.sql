-- Buku Kas / Keuangan — kas_transactions, purchases, hpp_products

CREATE TABLE IF NOT EXISTS kas_transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  jenis        TEXT        NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  tanggal      DATE        NOT NULL,
  kategori     TEXT        NOT NULL,
  catatan      TEXT        NOT NULL DEFAULT '',
  nominal      BIGINT      NOT NULL DEFAULT 0,
  purchase_id  UUID,
  order_id     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal            DATE        NOT NULL,
  nama               TEXT        NOT NULL,
  qty                BIGINT      NOT NULL,
  satuan             TEXT        NOT NULL DEFAULT 'pcs',
  harga_satuan       BIGINT      NOT NULL,
  total              BIGINT      NOT NULL,
  supplier           TEXT        NOT NULL DEFAULT '',
  kas_transaction_id UUID,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hpp_products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  bottles     INTEGER     NOT NULL DEFAULT 50,
  components  JSONB       NOT NULL DEFAULT '[]',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kas_transactions
  ADD CONSTRAINT fk_kas_purchase
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE SET NULL;

ALTER TABLE purchases
  ADD CONSTRAINT fk_purchase_kas
  FOREIGN KEY (kas_transaction_id) REFERENCES kas_transactions(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS kas_transactions_order_id_unique
  ON kas_transactions (order_id) WHERE order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS kas_transactions_tanggal_idx ON kas_transactions (tanggal);
CREATE INDEX IF NOT EXISTS purchases_tanggal_idx ON purchases (tanggal);

ALTER TABLE kas_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE hpp_products DISABLE ROW LEVEL SECURITY;

-- Kategori disimpan di settings (bukan tabel ke-4)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS finance_categories JSONB DEFAULT '{
  "masuk": ["Penjualan Web","Penjualan Offline","Reseller","Pesanan B2B/Grosir","Modal Masuk","Investor","Lainnya"],
  "keluar": ["Pembelian Pabrik","Belanja Bahan","Kemasan","Legalitas & Perizinan","Biaya Persyuratan","Ongkir","Iklan/Marketing","Operasional","Sewa/Utilitas","Gaji/Komisi","Pajak","Lainnya"]
}'::jsonb;

UPDATE settings SET finance_categories = COALESCE(finance_categories, '{
  "masuk": ["Penjualan Web","Penjualan Offline","Reseller","Pesanan B2B/Grosir","Modal Masuk","Investor","Lainnya"],
  "keluar": ["Pembelian Pabrik","Belanja Bahan","Kemasan","Legalitas & Perizinan","Biaya Persyuratan","Ongkir","Iklan/Marketing","Operasional","Sewa/Utilitas","Gaji/Komisi","Pajak","Lainnya"]
}'::jsonb) WHERE id = 1;

INSERT INTO hpp_products (name, bottles, components, sort_order)
SELECT 'Afternoon', 50,
  '[
    {"name":"Bibit parfum","cost":500000},
    {"name":"Alkohol/pelarut","cost":100000},
    {"name":"Botol 50ml","cost":350000},
    {"name":"Box kemasan","cost":150000},
    {"name":"Label/stiker","cost":50000}
  ]'::jsonb,
  0
WHERE NOT EXISTS (SELECT 1 FROM hpp_products LIMIT 1);
