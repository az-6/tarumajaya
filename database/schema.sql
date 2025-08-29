-- SQL Script untuk membuat tabel-tabel UMKM CMS
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tabel Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel UMKM
CREATE TABLE IF NOT EXISTS public.umkm (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    logo TEXT,
    images TEXT[] DEFAULT '{}',
    whatsapp VARCHAR(50),
    social JSONB DEFAULT '{}',
    marketplace JSONB DEFAULT '{}',
    owner_story TEXT,
    featured BOOLEAN DEFAULT false,
    location JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(12,2),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_umkm_category ON public.umkm(category_id);
CREATE INDEX IF NOT EXISTS idx_umkm_featured ON public.umkm(featured);
CREATE INDEX IF NOT EXISTS idx_umkm_slug ON public.umkm(slug);
CREATE INDEX IF NOT EXISTS idx_products_umkm ON public.products(umkm_id);

-- 5. Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umkm_updated_at 
    BEFORE UPDATE ON public.umkm 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert default categories
INSERT INTO public.categories (name, description) VALUES 
('Kuliner', 'Usaha makanan dan minuman'),
('Kerajinan', 'Produk kerajinan tangan dan seni'),
('Fashion', 'Pakaian, aksesoris, dan produk fashion'),
('Jasa', 'Layanan jasa dan konsultasi')
ON CONFLICT (name) DO NOTHING;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 9. Create policies for public read access
CREATE POLICY "Public categories read access" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Public UMKM read access" 
ON public.umkm FOR SELECT 
USING (true);

CREATE POLICY "Public products read access" 
ON public.products FOR SELECT 
USING (true);

-- 10. Create policies for admin access (you'll need to implement proper auth later)
-- For now, allow all operations (you should restrict this in production)
CREATE POLICY "Admin categories full access" 
ON public.categories FOR ALL 
USING (true);

CREATE POLICY "Admin UMKM full access" 
ON public.umkm FOR ALL 
USING (true);

CREATE POLICY "Admin products full access" 
ON public.products FOR ALL 
USING (true);
