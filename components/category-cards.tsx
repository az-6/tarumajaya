"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Hammer, Shirt, Wrench, Store, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllCategories, Category } from "@/lib/category-service";

const getIconForCategory = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (
    name.includes("kuliner") ||
    name.includes("makanan") ||
    name.includes("minuman")
  )
    return Utensils;
  if (
    name.includes("kerajinan") ||
    name.includes("handmade") ||
    name.includes("kriya")
  )
    return Hammer;
  if (
    name.includes("fashion") ||
    name.includes("pakaian") ||
    name.includes("aksesoris")
  )
    return Shirt;
  if (
    name.includes("jasa") ||
    name.includes("layanan") ||
    name.includes("service")
  )
    return Wrench;
  return Store; // default icon
};

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllCategories();
      setCategories(data.slice(0, 4)); // Limit to 4 for homepage
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Memuat kategori...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadCategories}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada kategori tersedia
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = getIconForCategory(category.name);
        return (
          <Link
            key={category.id}
            href={`/umkm?kategori=${category.name}`}
            className="block focus:outline-none"
          >
            <Card className="transition-colors hover:bg-muted">
              <CardContent className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="rounded-lg border p-2 flex-shrink-0">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium sm:text-base">
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.description || "Kategori UMKM"}
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Telusuri
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
