-- The Intimate points system
-- Run in Supabase SQL Editor if not applied via CLI

-- Allow member role on users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'reseller', 'member'));

-- Member profiles (FK to public.users — not auth.users)
CREATE TABLE IF NOT EXISTS member_profiles (
  user_id      TEXT        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tier         TEXT        NOT NULL DEFAULT 'signature'
                           CHECK (tier IN ('signature', 'intimate', 'soulscent', 'beloved')),
  total_points INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE member_profiles DISABLE ROW LEVEL SECURITY;

-- retail_orders: additive columns only
ALTER TABLE retail_orders ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id);
ALTER TABLE retail_orders ADD COLUMN IF NOT EXISTS points_earned INTEGER;
ALTER TABLE retail_orders ADD COLUMN IF NOT EXISTS member_discount INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS retail_orders_user_id_idx ON retail_orders (user_id);
