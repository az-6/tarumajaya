import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type UmkmData } from "@/lib/umkm-service";

type Props = {
  item?: UmkmData;
};

export default function UmkmCard({ item }: Props) {
  const umkm: UmkmData =
    item ??
    ({
      id: "default",
      slug: "contoh-umkm",
      name: "Contoh UMKM",
      category: { id: "1", name: "Kuliner", description: "" },
      logo: "/placeholder.svg?height=64&width=64",
      images: ["/placeholder.svg?height=240&width=400"],
      description: "Deskripsi singkat UMKM.",
      products: [{ name: "Produk A", price: 25000 }],
      address: "Jl. Contoh No. 123, Bandung",
      whatsapp: "628123456789",
      social: {},
      marketplace: {},
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: "1",
      owner_story: undefined,
      location: undefined,
      website: null,
    } as UmkmData);

  const cover = umkm.images?.[0] || "/placeholder.svg?height=240&width=400";

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={cover || "/placeholder.svg"}
            alt={`Foto ${umkm.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <Image
            src={umkm.logo || "/placeholder.svg?height=40&width=40&query=logo"}
            alt={`Logo ${umkm.name}`}
            width={32}
            height={32}
            className="rounded sm:h-10 sm:w-10"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold sm:text-base">
              {umkm.name}
            </h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {umkm.category?.name}
            </Badge>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {umkm.description}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
        <Link href={`/umkm/${umkm.slug}`} className="w-full">
          <Button
            className="w-full text-xs sm:text-sm"
            variant="outline"
            size="sm"
            aria-label={`Lihat profil ${umkm.name}`}
          >
            Lihat Profil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
