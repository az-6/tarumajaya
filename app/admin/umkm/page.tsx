"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin-guard";
import AdminHeader from "@/components/admin-header";
import UmkmPreview from "@/components/umkm-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllUmkm, deleteUmkm, type UmkmData } from "@/lib/umkm-service";
import { Edit, Trash2, Plus, Search, Star, Loader2 } from "lucide-react";

export default function AdminUmkmPage() {
  const [allUmkm, setAllUmkm] = useState<UmkmData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUmkm();
  }, []);

  const loadUmkm = async () => {
    try {
      setLoading(true);
      setError("");
      const umkmData = await getAllUmkm();
      setAllUmkm(umkmData);
    } catch (err) {
      console.error("Error loading UMKM:", err);
      setError("Gagal memuat data UMKM");
    } finally {
      setLoading(false);
    }
  };

  const filteredUmkm = allUmkm.filter(
    (umkm) =>
      umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus UMKM "${name}"?`)) {
      try {
        await deleteUmkm(id);
        await loadUmkm(); // Refresh data
      } catch (error) {
        console.error("Error deleting UMKM:", error);
        alert("Gagal menghapus UMKM");
      }
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
                  Memuat data UMKM...
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
                <h1 className="text-2xl font-bold sm:text-3xl">Kelola UMKM</h1>
              </div>
              <Link href="/admin/umkm/add">
                <Button className="w-full sm:w-auto text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah UMKM
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 sm:text-base">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadUmkm}
                className="mt-2 text-xs sm:text-sm"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Search */}
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-4 sm:pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari UMKM berdasarkan nama atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* UMKM List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredUmkm.map((umkm) => (
              <UmkmPreview key={umkm.id} umkm={umkm} onDelete={handleDelete} />
            ))}

            {filteredUmkm.length === 0 && (
              <Card>
                <CardContent className="p-6 sm:pt-6 text-center">
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {searchTerm
                      ? "Tidak ada UMKM yang sesuai dengan pencarian"
                      : "Belum ada UMKM yang terdaftar"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
