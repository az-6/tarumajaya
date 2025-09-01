# Panduan Mengatasi Error Vercel Deployment

## Error yang Terjadi

```
Error in getFeaturedUmkm: TypeError: can't access property "from", o.N is null
Error in getLatestUmkm: TypeError: can't access property "from", o.N is null
Error loading homepage data: TypeError: can't access property "from", o.N is null
```

## Penyebab

Error ini terjadi karena Supabase client menjadi `null` di production. Hal ini disebabkan oleh:

1. Environment variables Supabase tidak dikonfigurasi dengan benar di Vercel
2. Environment variables kosong atau tidak valid

## Solusi

### 1. Konfigurasi Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project UMKM CMS Anda
3. Masuk ke **Settings** > **Environment Variables**
4. Tambahkan environment variables berikut:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSWORD=Rumkm_2025
```

### 2. Mendapatkan Supabase Keys

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Masuk ke **Settings** > **API**
4. Salin:
   - **Project URL** untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key untuk `SUPABASE_SERVICE_ROLE_KEY`

### 3. Deploy Ulang

Setelah menambahkan environment variables:

1. Kembali ke **Deployments** tab di Vercel
2. Klik **Redeploy** pada deployment terakhir
3. Atau push commit baru ke repository

### 4. Verifikasi

Setelah deployment selesai:

1. Buka website Anda
2. Periksa browser console untuk memastikan tidak ada error
3. Data UMKM harus muncul dengan benar

## Fitur Fallback

Aplikasi ini telah dilengkapi dengan sistem fallback yang akan:

- Menampilkan data sample ketika Supabase tidak tersedia
- Mencegah crash aplikasi
- Memberikan pengalaman user yang tetap baik

Jika environment variables tidak dikonfigurasi, aplikasi akan:

- Menampilkan warning di console
- Menggunakan data fallback untuk demo
- Tetap dapat diakses tanpa error

## Troubleshooting

### Jika masih ada error setelah konfigurasi:

1. **Periksa Supabase Connection**:

   - Pastikan project Supabase masih aktif
   - Periksa quotas dan billing

2. **Periksa Environment Variables**:

   - Pastikan tidak ada typo
   - Pastikan tidak ada spasi di awal/akhir
   - Pastikan format URL benar

3. **Periksa Network**:

   - Vercel harus bisa mengakses Supabase
   - Periksa firewall settings di Supabase

4. **Clear Cache**:
   - Clear cache di Vercel
   - Force refresh browser

### Environment Variables Checklist:

- ✅ `NEXT_PUBLIC_SUPABASE_URL` diisi dan dimulai dengan `https://`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` diisi dengan anon key yang benar
- ✅ `SUPABASE_SERVICE_ROLE_KEY` diisi dengan service role key yang benar
- ✅ Semua keys valid dan dari project yang sama

## Kontak Support

Jika masih mengalami masalah, silakan:

1. Periksa logs di Vercel Dashboard > Functions tab
2. Periksa browser console untuk error details
3. Screenshot error dan environment variables configuration
