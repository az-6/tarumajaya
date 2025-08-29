"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
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
import { ArrowLeft, Save, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getCategoryById,
  updateCategory,
  getCategoryByName,
} from "@/lib/category-service";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditCategoryPage({ params }: Props) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Load existing category data
  useEffect(() => {
    loadCategory();
  }, [unwrappedParams.id]);

  const loadCategory = async () => {
    try {
      setLoadingData(true);
      setError("");
      const category = await getCategoryById(unwrappedParams.id);
      if (!category) {
        notFound();
        return;
      }

      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } catch (err) {
      console.error("Error loading category:", err);
      setError("Gagal memuat data kategori");
    } finally {
      setLoadingData(false);
    }
  };

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

    // Check if category name already exists (excluding current category)
    const existingCategory = await getCategoryByName(formData.name.trim());
    if (existingCategory && existingCategory.id !== unwrappedParams.id) {
      setError("Kategori dengan nama tersebut sudah ada");
      setLoading(false);
      return;
    }

    try {
      // Update category
      const updated = await updateCategory(unwrappedParams.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      if (!updated) {
        setError("Kategori tidak ditemukan");
        setLoading(false);
        return;
      }

      alert("Kategori berhasil diperbarui!");
      router.push("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Gagal memperbarui kategori");
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show loading state
  if (loadingData) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <main className="mx-auto max-w-2xl px-4 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat data kategori...</span>
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
                <h1 className="text-3xl font-bold">Edit Kategori</h1>
                <p className="text-muted-foreground">
                  Perbarui informasi kategori
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
                  Perbarui informasi kategori yang diperlukan
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
                {loading ? "Menyimpan..." : "Perbarui Kategori"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  );
}
