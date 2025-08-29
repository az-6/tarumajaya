"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin-guard";
import AdminHeader from "@/components/admin-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUmkmStats } from "@/lib/umkm-service";
import {
  Store,
  Users,
  TrendingUp,
  Plus,
  Edit,
  BarChart3,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const statsData = await getUmkmStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading stats:", err);
      setError("Gagal memuat statistik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <main className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2 text-muted-foreground">
                  Memuat dashboard...
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
            <h1 className="text-2xl font-bold sm:text-3xl">Dashboard Admin</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 sm:text-base">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                className="mt-2 text-xs sm:text-sm"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Total UMKM
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">UMKM terdaftar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  UMKM Unggulan
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {stats.featured}
                </div>
                <p className="text-xs text-muted-foreground">
                  dari {stats.total} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  Kategori
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {stats.categories}
                </div>
                <p className="text-xs text-muted-foreground">kategori aktif</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                  Kelola UMKM
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Tambah, edit, atau hapus data UMKM yang terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Link href="/admin/umkm/add">
                  <Button className="w-full text-xs sm:text-sm">
                    <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Tambah UMKM Baru
                  </Button>
                </Link>
                <Link href="/admin/umkm">
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                  >
                    <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Kelola UMKM
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                  Kelola Kategori
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Tambah, edit, atau hapus kategori UMKM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Link href="/admin/categories">
                  <Button className="w-full text-xs sm:text-sm">
                    <BarChart3 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Kelola Kategori
                  </Button>
                </Link>
                <div className="text-center text-xs text-muted-foreground sm:text-sm">
                  {stats.categories} kategori aktif
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 xl:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                  UMKM Terbaru
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  UMKM yang baru saja ditambahkan ke sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-xs text-muted-foreground sm:text-sm">
                    Belum ada UMKM terbaru
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
