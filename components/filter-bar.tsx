"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAllCategories } from "@/lib/category-service";

export type CategoryFilter = string;
export type SortOption = "terbaru" | "az";

type Props = {
  total?: number;
};

export default function FilterBar({ total = 0 }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategory = searchParams.get("kategori") || "Semua";
  const initialSort = (searchParams.get("urut") as SortOption) || "terbaru";

  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    setCategory(initialCategory);
    setSort(initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, initialSort]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      const categoryNames = ["Semua", ...data.map((cat) => cat.name)];
      setCategories(categoryNames);
    } catch (err) {
      console.error("Error loading categories:", err);
      // Keep default categories
    }
  };

  const onChangeUrl = (cat: CategoryFilter, s: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "Semua") params.set("kategori", cat);
    else params.delete("kategori");
    if (s) params.set("urut", s);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    onChangeUrl(category, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  const items = useMemo(() => categories, [categories]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {items.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            className={cn("rounded-full text-xs sm:text-sm")}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            aria-label={`Filter kategori ${c}`}
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div className="text-xs text-muted-foreground sm:text-sm">
          <Badge variant="secondary" className="mr-2 text-xs">
            {total}
          </Badge>
          UMKM
        </div>
        <Select value={sort} onValueChange={(v: SortOption) => setSort(v)}>
          <SelectTrigger className="w-[140px] text-xs sm:w-[160px] sm:text-sm">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="az">A - Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
