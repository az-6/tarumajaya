"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { toIDRCurrency } from "@/lib/umkm-service";
import { type UmkmData } from "@/lib/umkm-service";

interface UmkmPreviewProps {
  umkm: UmkmData;
  onDelete: (id: string, name: string) => void;
}

export default function UmkmPreview({ umkm, onDelete }: UmkmPreviewProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const shortDescription = umkm.description.slice(0, 150);
  const hasMoreText = umkm.description.length > 150;

  const totalImages = umkm.images?.length || 0;

  return (
    <Card>
      <CardContent className="p-4 sm:pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
          {/* Logo/Image Preview */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
              <Image
                src={umkm.logo || umkm.images?.[0] || "/placeholder.svg"}
                alt={`Logo ${umkm.name}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:gap-3 sm:mb-2">
              <h3 className="text-base font-semibold sm:text-lg sm:truncate">
                {umkm.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {umkm.featured === true && (
                  <Badge className="bg-yellow-100 text-yellow-800 flex-shrink-0 text-xs">
                    <Star className="mr-1 h-3 w-3" />
                    Unggulan
                  </Badge>
                )}
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  {umkm.category?.name || "Tidak ada kategori"}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground text-xs mb-2 leading-relaxed sm:text-sm">
              {showFullDescription ? umkm.description : shortDescription}
              {hasMoreText && !showFullDescription && "..."}
              {hasMoreText && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary hover:underline ml-1 text-xs"
                >
                  {showFullDescription ? "Lebih sedikit" : "Selengkapnya"}
                </button>
              )}
            </p>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="break-words">📍 {umkm.address.slice(0, 60)}...</p>
                <p>
                  📅 Ditambahkan:{" "}
                  {new Date(umkm.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>

              {totalImages > 0 && (
                <Badge variant="outline" className="text-xs w-fit">
                  📷 {totalImages} foto
                </Badge>
              )}
            </div>

            {/* Products Preview */}
            {umkm.products && umkm.products.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Produk ({umkm.products.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {umkm.products.slice(0, 3).map((product, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {product.name}
                      {product.price && ` - ${toIDRCurrency(product.price)}`}
                    </Badge>
                  ))}
                  {umkm.products.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{umkm.products.length - 3} lainnya
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-2 sm:flex-col sm:flex-shrink-0">
            <Link
              href={`/umkm/${umkm.slug}`}
              target="_blank"
              className="flex-1 sm:flex-initial"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs sm:text-sm"
              >
                <Eye className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Lihat</span>
                <span className="sm:hidden">Lihat</span>
              </Button>
            </Link>
            <Link
              href={`/admin/umkm/edit/${umkm.slug}`}
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
              onClick={() => onDelete(umkm.id, umkm.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-initial text-xs sm:text-sm"
            >
              <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Hapus</span>
              <span className="sm:hidden">Hapus</span>
            </Button>
          </div>
        </div>

        {/* Image Gallery Preview */}
        {umkm.images && umkm.images.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Galeri UMKM:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {umkm.images.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border"
                >
                  <Image
                    src={image}
                    alt={`Galeri ${umkm.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ))}
              {umkm.images.length > 6 && (
                <div className="flex items-center justify-center h-12 w-12 flex-shrink-0 rounded border bg-muted text-xs">
                  +{umkm.images.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
