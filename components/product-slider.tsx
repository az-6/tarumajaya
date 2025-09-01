"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import UmkmCard from "@/components/umkm-card";
import { UmkmData } from "@/lib/umkm-service";

interface ProductSliderProps {
  items: UmkmData[];
  title: string;
  viewAllLink?: string;
}

export default function ProductSlider({
  items,
  title,
  viewAllLink,
}: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-sm text-muted-foreground hover:underline"
            >
              Lihat semua
            </a>
          )}
          {items.length > 3 && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="h-8 w-8 p-0"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="h-8 w-8 p-0"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-[280px] flex-none sm:w-[300px]">
              <UmkmCard item={item} />
            </div>
          ))}
        </div>

        {/* Gradient shadows for scroll indication */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        )}
      </div>
    </section>
  );
}
