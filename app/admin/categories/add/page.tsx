"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Tag } from "lucide-react";
import Link from "next/link";
import { createCategory, getCategoryByName } from "@/lib/category-service";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi
    if (!formData.name.trim()) {
      setError("Nama kategori wajib diisi");
      setLoading(false);
      return;
    }

    // Check if category already exists
    const existingCategory = await getCategoryByName(formData.name.trim());
    if (existingCategory) {
      setError("Kategori dengan nama tersebut sudah ada");
      setLoading(false);
      return;
    }

    try {
      // Add category
      await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      router.push("/admin/categories");
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan kategori");
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminHeader />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/categories">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Tambah Kategori Baru</h1>
                <p className="text-muted-foreground">
                  Buat kategori baru untuk klasifikasi UMKM
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Informasi Kategori
                </CardTitle>
                <CardDescription>
                  Masukkan informasi kategori yang akan ditambahkan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Contoh: Kuliner, Fashion, Teknologi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Deskripsi singkat tentang kategori ini..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/categories">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  );
}
