-- Product gallery: multiple photos + optional video

ALTER TABLE products ADD COLUMN IF NOT EXISTS photos JSONB NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS video TEXT;

UPDATE products
SET photos = jsonb_build_array(photo)
WHERE photo IS NOT NULL
  AND photo != ''
  AND photo != '/products/placeholder.svg'
  AND (photos IS NULL OR photos = '[]'::jsonb);
