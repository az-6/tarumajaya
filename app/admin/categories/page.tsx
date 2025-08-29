"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin-guard";
import AdminHeader from "@/components/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getAllCategories,
  deleteCategory,
  getCategoryStats,
  type Category,
} from "@/lib/category-service";
import { Edit, Trash2, Plus, Search, Tag, Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories and stats on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoriesData, statsData] = await Promise.all([
        getAllCategories(),
        getCategoryStats(),
      ]);

      setCategories(categoriesData);
      setCategoryStats(statsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = async (category: Category) => {
    const umkmCount = categoryStats[category.id] || 0;

    if (umkmCount > 0) {
      alert(
        `Tidak dapat menghapus kategori "${category.name}" karena masih ada ${umkmCount} UMKM yang menggunakan kategori ini.`
      );
      return;
    }

    if (
      confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"?`)
    ) {
      try {
        await deleteCategory(category.id);
        await loadData(); // Refresh data
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Gagal menghapus kategori");
      }
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin sm:h-8 sm:w-8" />
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Memuat data kategori...
                </p>
              </div>
            </div>
          </main>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Kelola Kategori
                </h1>
              </div>
              <Link href="/admin/categories/add">
                <Button className="w-full sm:w-auto text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kategori
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 text-red-900">
              <AlertDescription className="text-sm sm:text-base">
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadData}
                  className="mt-2 ml-2 text-xs sm:text-sm"
                >
                  Coba Lagi
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-4 sm:pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => {
              const umkmCount = categoryStats[category.id] || 0;

              return (
                <Card key={category.id}>
                  <CardContent className="p-4 sm:pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold sm:text-base">
                            {category.name}
                          </h3>
                        </div>
                        {category.description && (
                          <p className="text-xs text-muted-foreground mb-2 sm:text-sm">
                            {category.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {umkmCount} UMKM
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="flex-1 sm:flex-initial"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs sm:text-sm"
                            >
                              <Edit className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Edit</span>
                              <span className="sm:hidden">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            className={`flex-1 sm:flex-initial text-xs sm:text-sm ${
                              umkmCount > 0
                                ? "text-gray-400"
                                : "text-red-600 hover:text-red-700"
                            }`}
                            disabled={umkmCount > 0}
                          >
                            <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Hapus</span>
                            <span className="sm:hidden">Hapus</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground sm:text-base">
                      {searchTerm
                        ? "Tidak ada kategori yang sesuai dengan pencarian"
                        : "Belum ada kategori"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Usage Warning */}
          <Alert className="mt-6">
            <Tag className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Catatan:</strong> Kategori yang sudah digunakan oleh UMKM
              tidak dapat dihapus. Edit nama kategori akan memperbarui semua
              UMKM yang menggunakan kategori tersebut.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    </AdminGuard>
  );
}
