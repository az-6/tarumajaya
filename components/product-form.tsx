"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "./image-upload";
import { Plus, Trash2 } from "lucide-react";

export interface Product {
  name: string;
  description: string;
  price: number | undefined;
  images: string[];
}

interface ProductFormProps {
  products: Product[];
  onChange: (products: Product[]) => void;
}

export default function ProductForm({ products, onChange }: ProductFormProps) {
  const addProduct = () => {
    const newProduct: Product = {
      name: "",
      description: "",
      price: undefined,
      images: [],
    };
    onChange([...products, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    onChange(newProducts);
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    };
    onChange(newProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Produk/Jasa</h3>
          <p className="text-sm text-muted-foreground">
            Tambahkan produk atau jasa yang ditawarkan UMKM
          </p>
        </div>
        <Button type="button" onClick={addProduct} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Belum ada produk yang ditambahkan
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {products.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Produk #{index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Produk *</Label>
                    <Input
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(index, "name", e.target.value)
                      }
                      placeholder="Nama produk/jasa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga (Rp)</Label>
                    <Input
                      type="number"
                      value={product.price || ""}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "price",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={product.description}
                    onChange={(e) =>
                      updateProduct(index, "description", e.target.value)
                    }
                    placeholder="Deskripsi produk/jasa"
                    rows={3}
                  />
                </div>

                <ImageUpload
                  label="Foto Produk"
                  value={product.images}
                  onChange={(images) => updateProduct(index, "images", images)}
                  maxImages={5}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
