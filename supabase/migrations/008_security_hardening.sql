-- ============================================================
-- Security hardening: RLS on sensitive tables + retail voucher cols
-- Server uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Anon key cannot read users / orders / retail_orders / settings.
-- Public reads remain for catalog-facing tables used by the storefront.
-- ============================================================

-- Additive columns for retail checkout
ALTER TABLE retail_orders ADD COLUMN IF NOT EXISTS voucher_code TEXT;
ALTER TABLE retail_orders ADD COLUMN IF NOT EXISTS voucher_discount INTEGER DEFAULT 0;

-- ---------- Sensitive: lock down ----------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE retail_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated → deny by default (service_role bypasses)

-- ---------- Public catalog (read-only for anon) ----------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active products" ON products;
CREATE POLICY "public read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Love stories: public can read approved; anyone can insert pending
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'love_stories') THEN
    ALTER TABLE love_stories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public read approved love stories" ON love_stories;
    CREATE POLICY "public read approved love stories"
      ON love_stories FOR SELECT TO anon, authenticated
      USING (status = 'approved');
    DROP POLICY IF EXISTS "public insert love stories" ON love_stories;
    CREATE POLICY "public insert love stories"
      ON love_stories FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stock_notifications') THEN
    ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public insert stock notify" ON stock_notifications;
    CREATE POLICY "public insert stock notify"
      ON stock_notifications FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers') THEN
    ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public upsert subscribers" ON subscribers;
    CREATE POLICY "public upsert subscribers"
      ON subscribers FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') THEN
    ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
    -- Wishlist relies on Supabase Auth user ids; keep localStorage fallback for guests.
    DROP POLICY IF EXISTS "public read own wishlist" ON wishlists;
  END IF;
END $$;
