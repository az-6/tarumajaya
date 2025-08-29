export type Umkm = {
  id: string
  slug: string
  name: string
  category: "Kuliner" | "Kerajinan" | "Fashion" | "Jasa"
  logo: string
  images: string[]
  description: string
  products: { name: string; price?: number }[]
  address: string
  location?: { lat: number; lng: number }
  whatsapp?: string
  social?: { instagram?: string; facebook?: string; tiktok?: string; website?: string }
  marketplace?: { tokopedia?: string; shopee?: string }
  ownerStory?: string
  featured?: boolean
  createdAt: string
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")

export const toIDRCurrency = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v)

const now = Date.now()

const DATA: Umkm[] = [
  {
    id: "1",
    slug: slugify("Sedap Rasa Bakery"),
    name: "Sedap Rasa Bakery",
    category: "Kuliner",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Toko roti rumahan dengan bahan berkualitas dan tanpa pengawet. Menyediakan roti manis, roti tawar, dan pastry segar setiap hari.",
    products: [
      { name: "Roti Tawar Premium", price: 22000 },
      { name: "Croissant Mentega", price: 15000 },
      { name: "Choco Bun", price: 12000 },
    ],
    address: "Jl. Melati No. 12, Bandung",
    location: { lat: -6.914744, lng: 107.60981 },
    whatsapp: "6281230001111",
    social: { instagram: "https://instagram.com/sedaprasabakery" },
    marketplace: { tokopedia: "https://tokopedia.com/sedaprasabakery" },
    ownerStory:
      "Dimulai dari dapur kecil pada 2018, Sedap Rasa Bakery tumbuh berkat dukungan pelanggan setia yang menyukai rasa otentik.",
    featured: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "2",
    slug: slugify("Kriya Nusantara"),
    name: "Kriya Nusantara",
    category: "Kerajinan",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Produk kerajinan kayu dan anyaman dengan sentuhan modern. Mengutamakan material lokal dan teknik tradisional.",
    products: [
      { name: "Vas Anyaman Rotan", price: 180000 },
      { name: "Mini Pajangan Kayu", price: 95000 },
    ],
    address: "Jl. Kenanga No. 5, Yogyakarta",
    location: { lat: -7.797068, lng: 110.370529 },
    whatsapp: "6281299992222",
    social: { instagram: "https://instagram.com/kriyanusantara", website: "https://kriyanusantara.id" },
    marketplace: { shopee: "https://shopee.co.id/kriyanusantara" },
    featured: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "3",
    slug: slugify("Gaya Kita Boutique"),
    name: "Gaya Kita Boutique",
    category: "Fashion",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Butik pakaian kasual dan semi-formal dengan desain simple dan elegan. Cocok untuk keseharian dan acara spesial.",
    products: [
      { name: "Kemeja Linen", price: 185000 },
      { name: "Dress Midi Polos", price: 225000 },
    ],
    address: "Jl. Mawar No. 8, Jakarta",
    whatsapp: "6281333334444",
    social: { instagram: "https://instagram.com/gayakitaboutique" },
    featured: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "4",
    slug: slugify("FixIt Service"),
    name: "FixIt Service",
    category: "Jasa",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Layanan perbaikan elektronik rumahan cepat dan bergaransi. Teknisi berpengalaman, harga transparan.",
    products: [
      { name: "Servis AC Ringan", price: 150000 },
      { name: "Cek Kerusakan Mesin Cuci", price: 80000 },
    ],
    address: "Jl. Anggrek No. 20, Surabaya",
    whatsapp: "6281555556666",
    social: { facebook: "https://facebook.com/fixitservice" },
    featured: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "5",
    slug: slugify("Kopi Sudut"),
    name: "Kopi Sudut",
    category: "Kuliner",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Kedai kopi lokal dengan biji pilihan petani Nusantara. Menyediakan manual brew dan signature drink.",
    products: [
      { name: "Latte", price: 28000 },
      { name: "Manual Brew V60", price: 32000 },
    ],
    address: "Jl. Cemara No. 2, Malang",
    location: { lat: -7.978469, lng: 112.561741 },
    whatsapp: "6281777778888",
    social: { instagram: "https://instagram.com/kopisudut" },
    featured: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 0.5).toISOString(),
  },
  {
    id: "6",
    slug: slugify("Jahit Cepat"),
    name: "Jahit Cepat",
    category: "Jasa",
    logo: "/placeholder.svg?height=64&width=64",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Jasa permak dan jahit baju profesional. Selesai cepat, rapi, dan harga bersahabat.",
    products: [
      { name: "Permak Celana", price: 30000 },
      { name: "Jahit Kemeja Custom", price: 175000 },
    ],
    address: "Jl. Flamboyan No. 9, Semarang",
    whatsapp: "6281999990000",
    marketplace: { shopee: "https://shopee.co.id/jahitcepat" },
    featured: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
]

export const getAllUmkm = () => DATA
export const getFeaturedUmkm = (limit = 8) => DATA.filter((d) => d.featured).slice(0, limit)
export const getLatestUmkm = (limit = 8) =>
  [...DATA].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
export const getUmkmBySlug = (slug: string) => DATA.find((d) => d.slug === slug)
