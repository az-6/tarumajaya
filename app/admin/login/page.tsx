"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Store, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password === "Rumkm_2025") {
      // Simpan status login ke localStorage
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Password salah!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-center mb-4">
            <Store className="h-6 w-6 mr-2 sm:h-8 sm:w-8" />
            <span className="text-xl font-bold sm:text-2xl">
              Rumah UMKM Desa Tarumajaya
            </span>
          </div>
          <CardTitle className="text-xl text-center sm:text-2xl">
            Login Admin
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Masukkan password untuk mengakses dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-xs text-center text-muted-foreground sm:text-sm">
            Butuh bantuan? Hubungi Tech Support:{" "}
            <a
              href="tel:08121450806"
              className="text-primary hover:underline font-medium"
            >
              08121450806
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
