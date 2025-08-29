import { supabase } from "./supabase";

export type UmkmData = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
  };
  description: string;
  address: string;
  logo?: string;
  images?: string[];
  whatsapp?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  marketplace?: {
    tokopedia?: string;
    shopee?: string;
  };
  owner_story?: string;
  featured: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  products?: Array<{
    name: string;
    price?: number;
    description?: string;
  }>;
  created_at: string;
  updated_at: string;
};

// Utility function to generate slug
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Currency formatter
export const toIDRCurrency = (v: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

// Get all UMKM
export async function getAllUmkm(): Promise<UmkmData[]> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories!inner(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching UMKM:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllUmkm:", error);
    return [];
  }
}

// Get UMKM by slug
export async function getUmkmBySlug(slug: string): Promise<UmkmData | null> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories!inner(id, name)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching UMKM by slug:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUmkmBySlug:", error);
    return null;
  }
}

// Get UMKM by ID
export async function getUmkmById(id: string): Promise<UmkmData | null> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories!inner(id, name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching UMKM by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUmkmById:", error);
    return null;
  }
}

// Create new UMKM
export async function createUmkm(umkmData: {
  name: string;
  category_id: string;
  description: string;
  address: string;
  logo?: string;
  images?: string[];
  whatsapp?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  marketplace?: {
    tokopedia?: string;
    shopee?: string;
  };
  owner_story?: string;
  featured?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  products?: Array<{
    name: string;
    price?: number;
    description?: string;
  }>;
}): Promise<UmkmData | null> {
  try {
    const slug = slugify(umkmData.name);

    // Check if slug already exists
    const { data: existingUmkm } = await supabase
      .from("umkm")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingUmkm) {
      throw new Error("UMKM dengan nama tersebut sudah ada");
    }

    const { data, error } = await supabase
      .from("umkm")
      .insert({
        slug,
        name: umkmData.name,
        category_id: umkmData.category_id,
        description: umkmData.description,
        address: umkmData.address,
        logo: umkmData.logo || null,
        images: umkmData.images || [],
        whatsapp: umkmData.whatsapp || null,
        social: umkmData.social || {},
        marketplace: umkmData.marketplace || {},
        owner_story: umkmData.owner_story || null,
        featured: umkmData.featured || false,
        location: umkmData.location || null,
        products: umkmData.products || [],
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating UMKM:", error);
      throw error;
    }

    // Fetch complete data with category
    const { data: completeData } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories!inner(id, name)
      `
      )
      .eq("id", data.id)
      .single();

    return completeData;
  } catch (error) {
    console.error("Error in createUmkm:", error);
    throw error;
  }
}

// Update UMKM
export async function updateUmkm(
  id: string,
  updates: Partial<{
    name: string;
    category_id: string;
    description: string;
    address: string;
    logo?: string;
    images?: string[];
    whatsapp?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      tiktok?: string;
      website?: string;
    };
    marketplace?: {
      tokopedia?: string;
      shopee?: string;
    };
    owner_story?: string;
    featured?: boolean;
    location?: {
      lat: number;
      lng: number;
    };
    products?: Array<{
      name: string;
      price?: number;
      description?: string;
    }>;
  }>
): Promise<UmkmData | null> {
  try {
    console.log("updateUmkm called with:", { id, updates });

    // Remove undefined values to avoid issues
    const updateData: any = {};
    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    console.log("updateData after cleaning:", updateData);

    // Update slug if name changed
    if (updates.name) {
      updateData.slug = slugify(updates.name);

      // Check if new slug conflicts with existing UMKM
      const { data: existingUmkm } = await supabase
        .from("umkm")
        .select("id")
        .eq("slug", updateData.slug)
        .neq("id", id)
        .single();

      if (existingUmkm) {
        throw new Error("UMKM dengan nama tersebut sudah ada");
      }
    }

    const { data, error } = await supabase
      .from("umkm")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        category:categories!inner(id, name)
      `
      )
      .single();

    if (error) {
      console.error("Error updating UMKM:", error);
      console.error("Update data being sent:", updateData);
      console.error("UMKM ID:", id);
      throw new Error(`Database error: ${error.message || "Unknown error"}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateUmkm:", error);
    throw error;
  }
}

// Delete UMKM
export async function deleteUmkm(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("umkm").delete().eq("id", id);

    if (error) {
      console.error("Error deleting UMKM:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteUmkm:", error);
    throw error;
  }
}

// Get UMKM statistics
export async function getUmkmStats() {
  try {
    const { data: allUmkm, error: umkmError } = await supabase
      .from("umkm")
      .select("featured, category_id");

    if (umkmError) {
      console.error("Error fetching UMKM stats:", umkmError);
      throw umkmError;
    }

    const { data: categoriesCount, error: categoriesError } = await supabase
      .from("categories")
      .select("id", { count: "exact" });

    if (categoriesError) {
      console.error("Error fetching categories count:", categoriesError);
      throw categoriesError;
    }

    return {
      total: allUmkm?.length || 0,
      featured: allUmkm?.filter((u) => u.featured).length || 0,
      categories: categoriesCount?.length || 0,
    };
  } catch (error) {
    console.error("Error in getUmkmStats:", error);
    return {
      total: 0,
      featured: 0,
      categories: 0,
    };
  }
}

// Get featured UMKM for homepage
export async function getFeaturedUmkm(): Promise<UmkmData[]> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories(id, name)
      `
      )
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching featured UMKM:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedUmkm:", error);
    throw error;
  }
}

// Get latest UMKM for homepage
export async function getLatestUmkm(limit: number = 8): Promise<UmkmData[]> {
  try {
    const { data, error } = await supabase
      .from("umkm")
      .select(
        `
        *,
        category:categories(id, name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching latest UMKM:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getLatestUmkm:", error);
    throw error;
  }
}
