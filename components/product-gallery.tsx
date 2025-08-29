"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { toIDRCurrency } from "@/lib/umkm-data";

interface Product {
  name: string;
  description?: string;
  price?: number;
  images: string[];
}

interface ProductGalleryProps {
  products: Product[];
}

export default function ProductGallery({ products }: ProductGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!products || products.length === 0) {
    return null;
  }

  const currentProduct = products[selectedProduct];
  const productImages =
    currentProduct.images.length > 0
      ? currentProduct.images
      : ["/placeholder.svg?height=300&width=300&text=No+Image"];

  const nextProduct = () => {
    setSelectedProduct((prev) => (prev + 1) % products.length);
    setSelectedImage(0);
  };

  const prevProduct = () => {
    setSelectedProduct(
      (prev) => (prev - 1 + products.length) % products.length
    );
    setSelectedImage(0);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Produk & Jasa ({products.length})
        </h3>
        {products.length > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevProduct}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedProduct + 1} / {products.length}
            </span>
            <Button variant="outline" size="sm" onClick={nextProduct}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={productImages[selectedImage]}
                  alt={`${currentProduct.name} - gambar ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {productImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((src, i) => (
                    <button
                      key={i}
                      className={`relative h-16 w-16 flex-none overflow-hidden rounded-md border-2 ${
                        i === selectedImage
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <Image
                        src={src}
                        alt={`${currentProduct.name} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold">{currentProduct.name}</h4>
                {currentProduct.price !== undefined && (
                  <div className="mt-2">
                    <Badge
                      variant="secondary"
                      className="text-lg font-semibold"
                    >
                      {toIDRCurrency(currentProduct.price)}
                    </Badge>
                  </div>
                )}
              </div>

              {currentProduct.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    {currentProduct.description}
                  </p>
                </div>
              )}

              {currentProduct.price === undefined && (
                <Badge variant="outline">Hubungi untuk harga</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {products.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {products.map((product, index) => (
            <Button
              key={index}
              variant={index === selectedProduct ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedProduct(index);
                setSelectedImage(0);
              }}
              className="text-xs"
            >
              {product.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
