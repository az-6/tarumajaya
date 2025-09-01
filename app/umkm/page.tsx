"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "@/components/site-header";
import FilterBar, {
  type CategoryFilter,
  type SortOption,
} from "@/components/filter-bar";
import UmkmCard from "@/components/umkm-card";
import { getAllUmkm } from "@/lib/umkm-service";
import { UmkmData } from "@/lib/umkm-service";
import { Loader2 } from "lucide-react";

function DirectoryContent() {
  const searchParams = useSearchParams();
  const kategori = (searchParams.get("kategori") as CategoryFilter) || "Semua";
  const urut = (searchParams.get("urut") as SortOption) || "terbaru";

  const [umkmData, setUmkmData] = useState<UmkmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUmkmData();
  }, []);

  const loadUmkmData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUmkm();
      setUmkmData(data);
    } catch (err) {
      console.error("Error loading UMKM data:", err);
      setError("Gagal memuat data UMKM");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...umkmData];
    if (kategori && kategori !== "Semua") {
      list = list.filter((i) => i.category?.name === kategori);
    }
    if (urut === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name, "id"));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [umkmData, kategori, urut]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8 mx-auto" />
              <span className="ml-0 mt-2 block text-sm sm:text-base">
                Memuat data UMKM...
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={loadUmkmData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
            Direktori UMKM
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Jelajahi UMKM berdasarkan kategori dan urutan.
          </p>
        </div>

        <FilterBar total={filtered.length} />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((u) => (
            <UmkmCard key={u.id} item={u} />
          ))}
        </div>
      </main>
    </div>
  );
}

function DirectoryLoadingFallback() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 md:py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat halaman...</span>
        </div>
      </main>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<DirectoryLoadingFallback />}>
      <DirectoryContent />
    </Suspense>
  );
}
