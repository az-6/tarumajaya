# UMKM CMS - Deployment Guide

## Environment Variables Required for Production

Untuk deploy ke Vercel atau platform lain, pastikan environment variables berikut sudah dikonfigurasi:

### Required Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_password
```

### Langkah Deployment ke Vercel:

1. **Setup Database:**

   - Buat project Supabase baru
   - Jalankan SQL script dari `database/schema.sql`
   - Jalankan SQL script dari `setup-storage.sql`

2. **Configure Environment Variables di Vercel:**

   - Masuk ke Vercel Dashboard
   - Pilih project Anda
   - Go to Settings > Environment Variables
   - Tambahkan semua variables di atas

3. **Deploy:**
   ```bash
   git push origin main
   ```

### Troubleshooting:

**Error: "supabaseUrl is required"**

- Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah diset di Vercel
- Variable harus dimulai dengan `NEXT_PUBLIC_` untuk accessible di client-side

**Build Error pada prerendering:**

- App ini menggunakan static generation yang aman
- Database calls akan fallback jika environment variables tidak tersedia

**Metadata Viewport Warning:**

- Sudah diperbaiki dengan menggunakan `viewport` export terpisah

### Local Development:

1. Copy `.env.local.example` ke `.env.local`
2. Isi dengan credentials Supabase Anda
3. Run `npm run dev`

### Production Checklist:

- [ ] Database schema deployed
- [ ] Storage bucket configured
- [ ] Environment variables set
- [ ] Build passes locally
- [ ] Admin login works
- [ ] Image upload works
- [ ] All pages render correctly
