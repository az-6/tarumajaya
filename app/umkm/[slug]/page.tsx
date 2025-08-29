"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import ImageGallery from "@/components/image-gallery";
import MapEmbed from "@/components/map-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUmkmBySlug, UmkmData } from "@/lib/umkm-service";
import {
  MapPin,
  MessageCircle,
  Globe,
  Store,
  ExternalLink,
  Loader2,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

function toIDRCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function UmkmDetailPage({ params }: Props) {
  const unwrappedParams = use(params);
  const [data, setData] = useState<UmkmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUmkmData();
  }, [unwrappedParams.slug]);

  const loadUmkmData = async () => {
    try {
      setLoading(true);
      setError("");
      const umkm = await getUmkmBySlug(unwrappedParams.slug);
      if (!umkm) {
        notFound();
        return;
      }
      setData(umkm);
    } catch (err) {
      console.error("Error loading UMKM data:", err);
      setError("Gagal memuat data UMKM");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8 mx-auto" />
              <span className="ml-0 mt-2 block text-sm sm:text-base">
                Memuat data UMKM...
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
            <p className="text-red-600 mb-4 text-sm sm:text-base">
              {error || "UMKM tidak ditemukan"}
            </p>
            <button
              onClick={loadUmkmData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  const waLink = data.whatsapp ? `https://wa.me/${data.whatsapp}` : undefined;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={
                data.logo ||
                "/placeholder.svg?height=72&width=72&query=logo%20umkm"
              }
              alt={`Logo ${data.name}`}
              width={72}
              height={72}
              className="mx-auto rounded sm:mx-0 sm:flex-shrink-0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
                {data.name}
              </h1>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{data.category?.name}</Badge>
                {data.featured === true ? <Badge>Unggulan</Badge> : null}
              </div>
            </div>
          </div>

          <ImageGallery images={data.images} alt={`Galeri ${data.name}`} />

          <div className="prose max-w-none dark:prose-invert">
            <h2 className="text-lg font-semibold sm:text-xl">Deskripsi</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {data.description}
            </p>
          </div>

          {data.owner_story ? (
            <div className="prose max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold sm:text-xl">
                Kisah Pemilik
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                {data.owner_story}
              </p>
            </div>
          ) : null}

          {data.products?.length ? (
            <div>
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">
                Produk/Jasa Unggulan
              </h2>
              <div className="grid gap-3">
                {data.products.map((p, idx) => (
                  <Card key={p.name + idx}>
                    <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                      <div className="text-sm font-medium sm:text-base">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground sm:text-sm">
                        {p.price !== undefined
                          ? toIDRCurrency(p.price)
                          : "Hubungi untuk harga"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Contact Information - Moved to bottom */}
        <section className="mt-8 space-y-6 sm:mt-12">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium">Alamat</div>
                    <div className="break-words text-muted-foreground">
                      {data.address}
                    </div>
                  </div>
                </div>
                {waLink ? (
                  <Link
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full text-xs sm:text-sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat via WhatsApp
                    </Button>
                  </Link>
                ) : null}
                <Separator />
                <div className="grid gap-2 text-xs sm:text-sm">
                  <div className="font-medium">Tautan</div>
                  <div className="grid gap-1">
                    {data.social?.website ? (
                      <Link
                        href={data.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                    {data.social?.instagram ? (
                      <Link
                        href={data.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Instagram
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                    {data.social?.facebook ? (
                      <Link
                        href={data.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Facebook
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                    {data.social?.tiktok ? (
                      <Link
                        href={data.social.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        TikTok
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                    {data.marketplace?.tokopedia ? (
                      <Link
                        href={data.marketplace.tokopedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <Store className="h-4 w-4" />
                        Tokopedia
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                    {data.marketplace?.shopee ? (
                      <Link
                        href={data.marketplace.shopee}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:underline"
                      >
                        <Store className="h-4 w-4" />
                        Shopee
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-start-2">
              <MapEmbed
                address={data.address}
                lat={data.location?.lat}
                lng={data.location?.lng}
                height={300}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
