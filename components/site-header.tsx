import Image from "next/image";
import Link from "next/link";
import { Menu, Home, ListChecks, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/white.png"
            alt="Rumah UMKM Desa Tarumajaya Logo"
            width={100}
            height={80}
            className="h-17 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-white hover:text-white/90">
            Beranda
          </Link>
          <Link href="/umkm" className="text-sm text-white hover:text-white/90">
            Direktori
          </Link>
        </nav>

        <div className="hidden gap-2 md:flex">
          <Link href="/admin/login">
            <Button variant="secondary" size="sm">
              <UserCheck className="mr-2 h-4 w-4" />
              Login Admin
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Buka menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-6 px-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  Beranda
                </Link>
                <Link
                  href="/umkm"
                  className="flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                >
                  <ListChecks className="h-4 w-4" />
                  Direktori
                </Link>
                <Link href="/admin/login" className="mt-4">
                  <Button className="w-full" size="sm">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Login Admin
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
