"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import AdminGuard from "@/components/admin-guard";
import AdminHeader from "@/components/admin-header";
import ImageUpload from "@/components/image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { getUmkmBySlug, updateUmkm } from "@/lib/umkm-service";
import { getAllCategories, type Category } from "@/lib/category-service";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function EditUmkmPage({ params }: Props) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    address: "",
    whatsapp: "",
    featured: false,
    ownerStory: "",
    website: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    tokopedia: "",
    shopee: "",
    logo: "",
    images: [] as string[],
    latitude: "",
    longitude: "",
    products: [] as Array<{
      name: string;
      price: string;
      description: string;
    }>,
  });

  // Load existing data and categories
  useEffect(() => {
    loadData();
  }, [unwrappedParams.slug]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [umkmData, categoriesData] = await Promise.all([
        getUmkmBySlug(unwrappedParams.slug),
        getAllCategories(),
      ]);

      if (!umkmData) {
        notFound();
        return;
      }

      setCategories(categoriesData);
      setFormData({
        name: umkmData.name,
        category_id: umkmData.category_id,
        description: umkmData.description,
        address: umkmData.address,
        whatsapp: umkmData.whatsapp || "",
        featured: umkmData.featured || false,
        ownerStory: umkmData.owner_story || "",
        website: umkmData.social?.website || "",
        instagram: umkmData.social?.instagram || "",
        facebook: umkmData.social?.facebook || "",
        tiktok: umkmData.social?.tiktok || "",
        tokopedia: umkmData.marketplace?.tokopedia || "",
        shopee: umkmData.marketplace?.shopee || "",
        logo: umkmData.logo || "",
        images: umkmData.images || [],
        latitude: umkmData.location?.lat?.toString() || "",
        longitude: umkmData.location?.lng?.toString() || "",
        products:
          umkmData.products?.map((p) => ({
            name: p.name,
            price: p.price?.toString() || "",
            description: p.description || "",
          })) || [],
      });
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data UMKM");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi basic
    if (
      !formData.name ||
      !formData.category_id ||
      !formData.description ||
      !formData.address
    ) {
      setError("Mohon isi semua field yang wajib");
      setLoading(false);
      return;
    }

    try {
      const umkmData = await getUmkmBySlug(unwrappedParams.slug);
      if (!umkmData) {
        setError("UMKM tidak ditemukan");
        setLoading(false);
        return;
      }

      const location =
        formData.latitude && formData.longitude
          ? {
              lat: parseFloat(formData.latitude),
              lng: parseFloat(formData.longitude),
            }
          : undefined;

      const products =
        formData.products.length > 0
          ? formData.products
              .map((p) => ({
                name: p.name,
                price: p.price ? parseFloat(p.price) : undefined,
                description: p.description || undefined,
              }))
              .filter((p) => p.name.trim() !== "")
          : undefined;

      const updateData = {
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description,
        address: formData.address,
        logo: formData.logo || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        whatsapp: formData.whatsapp || undefined,
        location: location,
        products: products,
        social: {
          website: formData.website || undefined,
          instagram: formData.instagram || undefined,
          facebook: formData.facebook || undefined,
          tiktok: formData.tiktok || undefined,
        },
        marketplace: {
          tokopedia: formData.tokopedia || undefined,
          shopee: formData.shopee || undefined,
        },
        owner_story: formData.ownerStory || undefined,
        featured: formData.featured,
      };

      console.log("=== DEBUG FORM EDIT ===");
      console.log("Form Data:", formData);
      console.log("Location parsed:", location);
      console.log("Products parsed:", products);
      console.log("Update data to send:", updateData);
      console.log("Update data keys:", Object.keys(updateData));
      console.log("UMKM ID:", umkmData.id);

      await updateUmkm(umkmData.id, updateData);
      router.push("/admin/umkm");
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui UMKM");
    }

    setLoading(false);
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", price: "", description: "" }],
    }));
  };

  const updateProduct = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  if (loadingData) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AdminHeader />
          <main className="mx-auto max-w-4xl px-4 py-8">
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
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadData}
                  className="mt-2"
                >
                  Coba Lagi
                </Button>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/umkm">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Edit UMKM</h1>
                <p className="text-muted-foreground">
                  Perbarui data UMKM yang sudah ada
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>Data dasar tentang UMKM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama UMKM *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Nama lengkap UMKM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        handleInputChange("category_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Deskripsi singkat tentang UMKM"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Alamat lengkap UMKM"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerStory">Kisah Pemilik</Label>
                  <Textarea
                    id="ownerStory"
                    value={formData.ownerStory}
                    onChange={(e) =>
                      handleInputChange("ownerStory", e.target.value)
                    }
                    placeholder="Ceritakan tentang perjalanan pemilik UMKM"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked === true)
                    }
                  />
                  <Label htmlFor="featured">Jadikan UMKM unggulan</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foto & Logo</CardTitle>
                <CardDescription>
                  Upload logo dan foto-foto UMKM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUpload
                  label="Logo UMKM"
                  value={formData.logo ? [formData.logo] : []}
                  onChange={(images) =>
                    handleInputChange("logo", images[0] || "")
                  }
                  maxImages={1}
                />

                <ImageUpload
                  label="Galeri Foto UMKM"
                  value={formData.images}
                  onChange={(images) => handleInputChange("images", images)}
                  maxImages={10}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
                <CardDescription>Informasi kontak UMKM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      handleInputChange("whatsapp", e.target.value)
                    }
                    placeholder="628123456789"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lokasi</CardTitle>
                <CardDescription>
                  Koordinat lokasi UMKM (opsional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      placeholder="-6.914744"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      placeholder="107.609810"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gunakan Google Maps untuk mendapatkan koordinat yang akurat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produk/Jasa</CardTitle>
                <CardDescription>
                  Daftar produk atau jasa yang ditawarkan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.products.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Produk/Jasa #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProduct(index)}
                      >
                        Hapus
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`product-name-${index}`}>Nama *</Label>
                        <Input
                          id={`product-name-${index}`}
                          value={product.name}
                          onChange={(e) =>
                            updateProduct(index, "name", e.target.value)
                          }
                          placeholder="Nama produk/jasa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`product-price-${index}`}>
                          Harga (Rp)
                        </Label>
                        <Input
                          id={`product-price-${index}`}
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            updateProduct(index, "price", e.target.value)
                          }
                          placeholder="25000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`product-description-${index}`}>
                        Deskripsi
                      </Label>
                      <Textarea
                        id={`product-description-${index}`}
                        value={product.description}
                        onChange={(e) =>
                          updateProduct(index, "description", e.target.value)
                        }
                        placeholder="Deskripsi produk/jasa"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProduct}
                  className="w-full"
                >
                  + Tambah Produk/Jasa
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Sosial & Marketplace</CardTitle>
                <CardDescription>
                  Link ke media sosial dan marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) =>
                        handleInputChange("tiktok", e.target.value)
                      }
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokopedia">Tokopedia</Label>
                    <Input
                      id="tokopedia"
                      value={formData.tokopedia}
                      onChange={(e) =>
                        handleInputChange("tokopedia", e.target.value)
                      }
                      placeholder="https://tokopedia.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopee">Shopee</Label>
                    <Input
                      id="shopee"
                      value={formData.shopee}
                      onChange={(e) =>
                        handleInputChange("shopee", e.target.value)
                      }
                      placeholder="https://shopee.co.id/username"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/umkm">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Menyimpan..." : "Perbarui UMKM"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  );
}
