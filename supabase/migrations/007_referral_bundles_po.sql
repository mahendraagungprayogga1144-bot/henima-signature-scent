-- Referral Intimate + Gift Set + PO Belanja
-- Jalankan di Supabase SQL Editor setelah 006.

-- 1) Referral: siapa yang mengajak member
ALTER TABLE member_profiles
  ADD COLUMN IF NOT EXISTS referred_by TEXT REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS member_profiles_referred_by_idx
  ON member_profiles (referred_by);

-- 2) Gift set / bundling pada products (shop)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_gift_set BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bundle_items JSONB NOT NULL DEFAULT '[]';

COMMENT ON COLUMN products.bundle_items IS
  'Array of { productId: string, label?: string } — isi gift set';

-- 3) PO supplier pada Belanja (purchases)
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS po_status TEXT NOT NULL DEFAULT 'received';

ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_po_status_check;
ALTER TABLE purchases
  ADD CONSTRAINT purchases_po_status_check
  CHECK (po_status IN ('draft', 'ordered', 'received', 'cancelled'));

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS expected_date DATE;

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS po_notes TEXT NOT NULL DEFAULT '';
