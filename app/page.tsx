"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import SiteHeader from "@/components/site-header";
import CategoryCards from "@/components/category-cards";
import UmkmCard from "@/components/umkm-card";
import HeroSlider from "@/components/hero-slider";
import ProductSlider from "@/components/product-slider";
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
        {/* Hero Slider */}
        <section className="mb-8 md:mb-12">
          <HeroSlider />
        </section>

        {/* Welcome Section */}
        <section className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl mb-4">
            Direktori UMKM Tarumajaya
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Temukan, dukung, dan promosikan UMKM Desa Tarumajaya. Platform
            direktori terlengkap untuk mendukung ekonomi kreatif lokal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/umkm">
              <Button size="lg" className="w-full sm:w-auto">
                Jelajahi Direktori
              </Button>
            </Link>
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
            <ProductSlider
              items={featured}
              title="UMKM Unggulan"
              viewAllLink="/umkm"
            />
          ) : (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold sm:text-xl md:text-2xl mb-4">
                UMKM Unggulan
              </h2>
              <p className="text-muted-foreground">Belum ada UMKM unggulan</p>
            </div>
          )}
        </section>

        <Separator className="my-8 md:my-10" />

        {/* Latest */}
        <section className="space-y-4">
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
            <>
              <ProductSlider
                items={latest.slice(0, 6)}
                title="UMKM Terbaru"
                viewAllLink="/umkm?urut=terbaru"
              />
              {latest.length > 6 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Lainnya</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {latest.slice(6).map((u) => (
                      <UmkmCard key={u.id} item={u} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-lg font-semibold sm:text-xl md:text-2xl mb-4">
                UMKM Terbaru
              </h2>
              <p className="text-muted-foreground">Belum ada UMKM terdaftar</p>
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
