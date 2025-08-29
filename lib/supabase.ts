import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side admin operations only (API routes, server components)
export const createAdminClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("Admin client cannot be used on client-side");
  }

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Database types
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      umkm: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category_id: string;
          description: string;
          address: string;
          logo: string | null;
          images: string[] | null;
          whatsapp: string | null;
          social: {
            instagram?: string;
            facebook?: string;
            tiktok?: string;
            website?: string;
          } | null;
          marketplace: {
            tokopedia?: string;
            shopee?: string;
          } | null;
          owner_story: string | null;
          featured: boolean;
          location: {
            lat: number;
            lng: number;
          } | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category_id: string;
          description: string;
          address: string;
          logo?: string | null;
          images?: string[] | null;
          whatsapp?: string | null;
          social?: {
            instagram?: string;
            facebook?: string;
            tiktok?: string;
            website?: string;
          } | null;
          marketplace?: {
            tokopedia?: string;
            shopee?: string;
          } | null;
          owner_story?: string | null;
          featured?: boolean;
          location?: {
            lat: number;
            lng: number;
          } | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category_id?: string;
          description?: string;
          address?: string;
          logo?: string | null;
          images?: string[] | null;
          whatsapp?: string | null;
          social?: {
            instagram?: string;
            facebook?: string;
            tiktok?: string;
            website?: string;
          } | null;
          marketplace?: {
            tokopedia?: string;
            shopee?: string;
          } | null;
          owner_story?: string | null;
          featured?: boolean;
          location?: {
            lat: number;
            lng: number;
          } | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          umkm_id: string;
          name: string;
          price: number | null;
          description: string | null;
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          name: string;
          price?: number | null;
          description?: string | null;
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          name?: string;
          price?: number | null;
          description?: string | null;
          images?: string[] | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
