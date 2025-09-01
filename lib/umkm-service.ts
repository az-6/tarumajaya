import { supabase, isSupabaseAvailable } from "./supabase";
import { fallbackUmkmData } from "./fallback-data";
import {
  uploadImage,
  uploadImages,
  isBase64Image,
  generateUmkmImagePath,
  cleanupOrphanedImages,
  deleteAllUmkmImages,
} from "./image-upload";

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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, using fallback data");
      return fallbackUmkmData;
    }

    const { data, error } = await supabase!
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
      return fallbackUmkmData;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllUmkm:", error);
    return fallbackUmkmData;
  }
}

// Get UMKM by slug
export async function getUmkmBySlug(slug: string): Promise<UmkmData | null> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, using fallback data");
      return fallbackUmkmData.find((umkm) => umkm.slug === slug) || null;
    }

    const { data, error } = await supabase!
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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, returning null");
      return null;
    }

    const { data, error } = await supabase!
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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, cannot create UMKM");
      throw new Error("Database tidak tersedia");
    }

    const slug = slugify(umkmData.name);

    // Check if slug already exists
    const { data: existingUmkm } = await supabase!
      .from("umkm")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingUmkm) {
      throw new Error("UMKM dengan nama tersebut sudah ada");
    }

    // Separate images from other data for initial insert
    const insertData = {
      slug,
      name: umkmData.name,
      category_id: umkmData.category_id,
      description: umkmData.description,
      address: umkmData.address,
      logo:
        !umkmData.logo || isBase64Image(umkmData.logo) ? null : umkmData.logo,
      images: umkmData.images?.filter((img) => !isBase64Image(img)) || [],
      whatsapp: umkmData.whatsapp || null,
      social: umkmData.social || {},
      marketplace: umkmData.marketplace || {},
      owner_story: umkmData.owner_story || null,
      featured: umkmData.featured || false,
      location: umkmData.location || null,
      products: umkmData.products || [],
    };

    const { data, error } = await supabase!
      .from("umkm")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating UMKM:", error);
      throw error;
    }

    // Now upload images if any base64 data exists
    const umkmId = data.id;
    const imagePath = generateUmkmImagePath(umkmId);
    let needsUpdate = false;
    let finalLogoUrl = insertData.logo;
    let finalImagesUrls = [...(insertData.images || [])];

    // Upload logo if base64
    if (umkmData.logo && isBase64Image(umkmData.logo)) {
      console.log("Uploading logo for new UMKM...");
      const logoUrl = await uploadImage(umkmData.logo, imagePath, `logo.jpg`);
      if (logoUrl) {
        finalLogoUrl = logoUrl;
        needsUpdate = true;
        console.log("Logo uploaded successfully:", logoUrl);
      }
    }

    // Upload images if base64
    if (umkmData.images) {
      const base64Images = umkmData.images.filter(isBase64Image);
      if (base64Images.length > 0) {
        console.log(`Uploading ${base64Images.length} images for new UMKM...`);
        const uploadedUrls = await uploadImages(base64Images, imagePath);
        if (uploadedUrls.length > 0) {
          finalImagesUrls = [...finalImagesUrls, ...uploadedUrls];
          needsUpdate = true;
          console.log(`${uploadedUrls.length} images uploaded successfully`);
        }
      }
    }

    // Update UMKM with uploaded image URLs if any
    if (needsUpdate) {
      const { error: updateError } = await supabase!
        .from("umkm")
        .update({
          logo: finalLogoUrl,
          images: finalImagesUrls,
        })
        .eq("id", umkmId);

      if (updateError) {
        console.error("Error updating UMKM with image URLs:", updateError);
      }
    }

    // Fetch complete data with category
    const { data: completeData } = await supabase!
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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, cannot update UMKM");
      throw new Error("Database tidak tersedia");
    }

    console.log("updateUmkm called with:", { id, updates });

    // Get existing UMKM data for cleanup comparison
    const { data: existingData } = await supabase!
      .from("umkm")
      .select("images")
      .eq("id", id)
      .single();

    const oldImages: string[] = existingData?.images || [];

    // Separate image uploads from text data updates
    const textData: any = {};
    let logoToUpload: string | null = null;
    let imagesToUpload: string[] = [];

    // Process updates and separate images from text data
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        if (key === "logo" && typeof value === "string") {
          if (isBase64Image(value)) {
            logoToUpload = value;
            console.log("Logo will be uploaded to storage");
            // Don't add to textData yet, will be added after upload
          } else {
            textData[key] = value; // Already a URL
          }
        } else if (key === "images" && Array.isArray(value)) {
          const imageStrings = value.filter(
            (item): item is string => typeof item === "string"
          );
          const base64Images = imageStrings.filter(isBase64Image);
          const urlImages = imageStrings.filter((img) => !isBase64Image(img));

          if (base64Images.length > 0) {
            imagesToUpload = base64Images;
            console.log(
              `${base64Images.length} images will be uploaded to storage`
            );
          }

          // Always set images, will be updated after upload if needed
          textData[key] = urlImages;
        } else {
          textData[key] = value; // Regular text data
        }
      }
    }

    console.log("Text data to update:", Object.keys(textData));
    console.log("Images to upload:", {
      logo: logoToUpload ? "yes" : "no",
      images: imagesToUpload.length,
    });

    // Upload images first if needed
    const imagePath = generateUmkmImagePath(id);

    // Upload logo if needed
    if (logoToUpload) {
      console.log("Uploading logo...");
      const logoUrl = await uploadImage(
        logoToUpload,
        imagePath,
        `logo-${Date.now()}.jpg`
      );
      if (logoUrl) {
        textData.logo = logoUrl;
        console.log("Logo uploaded successfully:", logoUrl);
      } else {
        console.error("Failed to upload logo");
      }
    }

    // Upload images if needed
    if (imagesToUpload.length > 0) {
      console.log("Uploading images...");
      const uploadedImageUrls = await uploadImages(imagesToUpload, imagePath);
      if (uploadedImageUrls.length > 0) {
        // Combine with existing URLs
        const existingUrls = textData.images || [];
        textData.images = [...existingUrls, ...uploadedImageUrls];
        console.log(`${uploadedImageUrls.length} images uploaded successfully`);
      } else {
        console.error("Failed to upload images");
      }
    }

    // Update slug if name changed
    if (updates.name) {
      textData.slug = slugify(updates.name);

      // Check if new slug conflicts with existing UMKM
      const { data: existingUmkm } = await supabase!
        .from("umkm")
        .select("id")
        .eq("slug", textData.slug)
        .neq("id", id)
        .single();

      if (existingUmkm) {
        throw new Error("UMKM dengan nama tersebut sudah ada");
      }
    }

    console.log("Final data to update:", Object.keys(textData));

    const { data, error } = await supabase!
      .from("umkm")
      .update(textData)
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
      console.error("Update data being sent:", textData);
      console.error("UMKM ID:", id);
      throw new Error(`Database error: ${error.message || "Unknown error"}`);
    }

    // Cleanup orphaned images if images were updated
    if (textData.images) {
      const newImages: string[] = textData.images || [];
      await cleanupOrphanedImages(id, newImages, oldImages);
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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, cannot delete UMKM");
      return false;
    }

    // Delete all images from storage first
    await deleteAllUmkmImages(id);

    const { error } = await supabase!.from("umkm").delete().eq("id", id);

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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, returning default stats");
      return {
        total: 0,
        featured: 0,
        categories: 0,
      };
    }

    const { data: allUmkm, error: umkmError } = await supabase!
      .from("umkm")
      .select("featured, category_id");

    if (umkmError) {
      console.error("Error fetching UMKM stats:", umkmError);
      throw umkmError;
    }

    const { data: categoriesCount, error: categoriesError } = await supabase!
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
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, using fallback data");
      return fallbackUmkmData.filter((umkm) => umkm.featured).slice(0, 6);
    }

    const { data, error } = await supabase!
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
      return fallbackUmkmData.filter((umkm) => umkm.featured).slice(0, 6);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedUmkm:", error);
    return fallbackUmkmData.filter((umkm) => umkm.featured).slice(0, 6);
  }
}

// Get latest UMKM for homepage
export async function getLatestUmkm(limit: number = 8): Promise<UmkmData[]> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase not available, using fallback data");
      return fallbackUmkmData.slice(0, limit);
    }

    const { data, error } = await supabase!
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
      return fallbackUmkmData.slice(0, limit);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getLatestUmkm:", error);
    return fallbackUmkmData.slice(0, limit);
  }
}
