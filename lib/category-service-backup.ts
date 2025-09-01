import { supabase } from "./supabase";

export type Category = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    if (!supabase) {
      console.warn("Supabase client not available");
      return [];
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}

// Get category names only (for compatibility with existing code)
export async function getCategoryNames(): Promise<string[]> {
  try {
    const categories = await getAllCategories();
    return categories.map((cat) => cat.name);
  } catch (error) {
    console.error("Error in getCategoryNames:", error);
    return ["Kuliner", "Kerajinan", "Fashion", "Jasa"]; // fallback
  }
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    if (!supabase) {
      console.warn("Supabase client not available");
      return null;
    }

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return null;
  }
}

// Get category by name
export async function getCategoryByName(
  name: string
): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching category by name:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCategoryByName:", error);
    return null;
  }
}

// Create new category
export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at">
): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: category.name,
        description: category.description || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createCategory:", error);
    throw error;
  }
}

// Update category
export async function updateCategory(
  id: string,
  updates: Partial<Pick<Category, "name" | "description">>
): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: updates.name,
        description: updates.description || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
}

// Delete category
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    // First check if category is being used by any UMKM
    const { data: umkmCount, error: countError } = await supabase
      .from("umkm")
      .select("id", { count: "exact" })
      .eq("category_id", id);

    if (countError) {
      console.error("Error checking category usage:", countError);
      throw countError;
    }

    if (umkmCount && umkmCount.length > 0) {
      throw new Error("Cannot delete category that is being used by UMKM");
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
}

// Get category usage statistics
export async function getCategoryStats(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase.from("umkm").select("category_id");

    if (error) {
      console.error("Error fetching category stats:", error);
      return {};
    }

    const stats: Record<string, number> = {};
    data.forEach((umkm) => {
      stats[umkm.category_id] = (stats[umkm.category_id] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error in getCategoryStats:", error);
    return {};
  }
}
