"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Store, LogOut, Home, Menu, BarChart3, Users } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Store className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm font-semibold sm:text-base">
            <span className="hidden sm:inline">
              Rumah UMKM Desa Tarumajaya - Admin
            </span>
            <span className="sm:hidden">Admin</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          <Link
            href="/admin/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/umkm"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Kelola UMKM
          </Link>
          <Link
            href="/admin/categories"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Kelola Kategori
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Home className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Ke Website</span>
              <span className="sm:hidden">Website</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs sm:text-sm"
          >
            <LogOut className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Keluar</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Buka menu admin"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-6 px-2">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/umkm"
                  className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Kelola UMKM
                </Link>
                <Link
                  href="/admin/categories"
                  className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Kelola Kategori
                </Link>
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Link href="/" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Ke Website
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
