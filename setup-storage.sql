-- Setup Supabase Storage untuk UMKM Images
-- Jalankan di Supabase SQL Editor

-- 1. Buat bucket untuk UMKM images jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'umkm-images', 
  'umkm-images',
  true,  -- Public access
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Buat policy untuk public read access
CREATE POLICY "Public read access for UMKM images" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'umkm-images');

-- 3. Buat policy untuk public upload (untuk development - nanti bisa dibatasi)
CREATE POLICY "Public upload for UMKM images" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'umkm-images');

-- 4. Buat policy untuk update/delete (untuk development - nanti bisa dibatasi)
CREATE POLICY "Public update for UMKM images" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'umkm-images');

CREATE POLICY "Public delete for UMKM images" ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'umkm-images');

-- Cek apakah bucket sudah ada
SELECT * FROM storage.buckets WHERE id = 'umkm-images';
