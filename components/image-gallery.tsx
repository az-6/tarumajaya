"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
  images?: string[]
  alt?: string
}

export default function ImageGallery({ images = [], alt = "Galeri UMKM" }: Props) {
  const list = images.length ? images : ["/placeholder.svg?height=400&width=600"]
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
        <Image
          src={list[active] || "/placeholder.svg"}
          alt={`${alt} - gambar ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {list.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded border",
              i === active ? "ring-2 ring-primary" : "opacity-80"
            )}
            aria-label={`Pilih gambar ${i + 1}`}
          >
            <Image src={src || "/placeholder.svg"} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  )
}
