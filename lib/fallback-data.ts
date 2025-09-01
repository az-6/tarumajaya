// Fallback data untuk development/production tanpa Supabase
import { UmkmData } from "./umkm-service";

export const fallbackUmkmData: UmkmData[] = [
  {
    id: "1",
    slug: "warung-nasi-pak-budi",
    name: "Warung Nasi Pak Budi",
    category_id: "1",
    category: {
      id: "1",
      name: "Kuliner",
    },
    description:
      "Warung nasi tradisional dengan berbagai lauk pauk pilihan yang lezat dan harga terjangkau.",
    address: "Jl. Raya Tarumajaya No. 123, Tarumajaya",
    logo: "/placeholder-logo.png",
    images: ["/1.jpg", "/2.jpg"],
    whatsapp: "628123456789",
    social: {
      instagram: "@warungnasipakbudi",
      facebook: "Warung Nasi Pak Budi",
    },
    marketplace: {
      tokopedia: "warung-nasi-pak-budi",
    },
    owner_story:
      "Pak Budi telah menjalankan warung ini selama 15 tahun dengan resep turun temurun.",
    featured: true,
    location: {
      lat: -6.2088,
      lng: 106.8456,
    },
    products: [
      {
        name: "Nasi Gudeg",
        price: 15000,
        description: "Nasi dengan gudeg khas Yogya",
      },
      {
        name: "Nasi Rawon",
        price: 18000,
        description: "Nasi dengan rawon daging sapi",
      },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    slug: "kerajinan-bambu-sari",
    name: "Kerajinan Bambu Sari",
    category_id: "2",
    category: {
      id: "2",
      name: "Kerajinan",
    },
    description:
      "Produsen kerajinan bambu berkualitas tinggi dengan desain modern dan tradisional.",
    address: "Jl. Bambu Raya No. 45, Tarumajaya",
    logo: "/placeholder-logo.png",
    images: ["/3.jpg"],
    whatsapp: "628987654321",
    social: {
      instagram: "@kerajinanbambusari",
      website: "https://kerajinanbambu.com",
    },
    marketplace: {
      shopee: "kerajinan-bambu-sari",
      tokopedia: "bambu-sari-craft",
    },
    owner_story:
      "Sari memulai usaha kerajinan bambu dari hobi yang kemudian berkembang menjadi bisnis.",
    featured: true,
    products: [
      {
        name: "Keranjang Bambu",
        price: 50000,
        description: "Keranjang anyaman bambu ukuran sedang",
      },
      {
        name: "Lampu Hias Bambu",
        price: 75000,
        description: "Lampu hias dengan desain unik dari bambu",
      },
    ],
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    slug: "toko-kain-indah",
    name: "Toko Kain Indah",
    category_id: "3",
    category: {
      id: "3",
      name: "Fashion",
    },
    description:
      "Menyediakan berbagai jenis kain berkualitas untuk kebutuhan fashion dan dekorasi.",
    address: "Jl. Tekstil No. 67, Tarumajaya",
    logo: "/placeholder-logo.png",
    images: ["/1.jpg", "/2.jpg", "/3.jpg"],
    whatsapp: "628111222333",
    social: {
      instagram: "@kainindah",
      facebook: "Toko Kain Indah",
    },
    owner_story:
      "Usaha keluarga yang telah berjalan 3 generasi dalam bidang tekstil.",
    featured: false,
    products: [
      {
        name: "Kain Batik",
        price: 120000,
        description: "Kain batik motif tradisional",
      },
      {
        name: "Kain Polos",
        price: 45000,
        description: "Kain polos berbagai warna",
      },
    ],
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
];

export const fallbackCategories = [
  {
    id: "1",
    name: "Kuliner",
    description: "Makanan dan minuman",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Kerajinan",
    description: "Produk kerajinan tangan",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Fashion",
    description: "Pakaian dan aksesoris",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Jasa",
    description: "Layanan jasa",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
