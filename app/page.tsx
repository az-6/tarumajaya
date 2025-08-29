"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import SiteHeader from "@/components/site-header";
import CategoryCards from "@/components/category-cards";
import UmkmCard from "@/components/umkm-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getFeaturedUmkm, getLatestUmkm, UmkmData } from "@/lib/umkm-service";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [featured, setFeatured] = useState<UmkmData[]>([]);
  const [latest, setLatest] = useState<UmkmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [featuredData, latestData] = await Promise.all([
        getFeaturedUmkm(),
        getLatestUmkm(8),
      ]);

      setFeatured(featuredData);
      setLatest(latestData);
    } catch (err) {
      console.error("Error loading homepage data:", err);
      setError("Gagal memuat data UMKM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 md:py-12">
        {/* Hero */}
        <section className="grid items-center gap-4 overflow-hidden rounded-2xl border bg-muted/30 p-4 sm:p-6 md:grid-cols-2 md:gap-6 md:p-8 lg:p-10">
          <div className="order-2 space-y-4 md:order-1">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
              Direktori UMKM Tarumajaya
              <span className="block text-base text-muted-foreground sm:text-lg md:text-xl">
                Temukan, dukung, dan promosikan UMKM Desa Tarumajaya.
              </span>
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 md:mt-6">
              <Link href="/umkm">
                <Button size="lg" className="w-full sm:w-auto">
                  Jelajahi Direktori
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[16/10] w-full md:order-2">
            <Image
              src="/placeholder.svg?height=420&width=720"
              alt="Kolase produk UMKM"
              fill
              className="rounded-xl object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-8 space-y-4 md:mt-10">
          <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
            Kategori Utama
          </h2>
          <CategoryCards />
        </section>

        {/* Featured */}
        <section className="mt-8 space-y-4 md:mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
              UMKM Unggulan
            </h2>
            <Link
              href="/umkm"
              className="text-sm text-muted-foreground hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat UMKM unggulan...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : featured.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4">
              {featured.map((u) => (
                <div key={u.id} className="w-[280px] flex-none sm:w-[300px]">
                  <UmkmCard item={u} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada UMKM unggulan
            </div>
          )}
        </section>

        <Separator className="my-8 md:my-10" />

        {/* Latest */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
              UMKM Terbaru
            </h2>
            <Link
              href="/umkm?urut=terbaru"
              className="text-sm text-muted-foreground hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat UMKM terbaru...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : latest.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latest.map((u) => (
                <UmkmCard key={u.id} item={u} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada UMKM terdaftar
            </div>
          )}
        </section>
      </main>
      <footer className="mt-12 border-t md:mt-16">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground md:py-8">
          © {new Date().getFullYear()} Rumah UMKM Desa Tarumajaya · Dibangun
          untuk memajukan UMKM Indonesia
        </div>
      </footer>
    </div>
  );
}
