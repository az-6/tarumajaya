import { supabase } from "./supabase";

export type Category = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

// Safe wrapper for supabase operations
function withSupabase<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!supabase) {
    console.warn("Supabase client not available, using fallback");
    return Promise.resolve(fallback);
  }
  return operation();
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
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
  }, []);
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
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
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
  }, null);
}

// Get category by name
export async function getCategoryByName(
  name: string
): Promise<Category | null> {
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
        .from("categories")
        .select("*")
        .eq("name", name)
        .single();

      if (error) {
        console.error("Error fetching category by name:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getCategoryByName:", error);
      return null;
    }
  }, null);
}

// Create new category
export async function createCategory(
  name: string,
  description?: string
): Promise<Category | null> {
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
        .from("categories")
        .insert({
          name,
          description,
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
      return null;
    }
  }, null);
}

// Update category
export async function updateCategory(
  id: string,
  updates: Partial<Pick<Category, "name" | "description">>
): Promise<Category | null> {
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
        .from("categories")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
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
      return null;
    }
  }, null);
}

// Delete category (with safety check)
export async function deleteCategory(id: string): Promise<boolean> {
  return withSupabase(async () => {
    try {
      // Check if category is used by any UMKM
      const { data: umkmCount, error: countError } = await supabase!
        .from("umkm")
        .select("id", { count: "exact" })
        .eq("category_id", id);

      if (countError) {
        console.error("Error checking category usage:", countError);
        return false;
      }

      if (umkmCount && umkmCount.length > 0) {
        throw new Error(
          "Category is being used by UMKM entries and cannot be deleted"
        );
      }

      const { error } = await supabase!
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting category:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteCategory:", error);
      return false;
    }
  }, false);
}

// Check if category is used
export async function isCategoryUsed(id: string): Promise<boolean> {
  return withSupabase(async () => {
    try {
      const { data, error } = await supabase!
        .from("umkm")
        .select("category_id");

      if (error) {
        console.error("Error checking category usage:", error);
        return false;
      }

      return data.some((umkm) => umkm.category_id === id);
    } catch (error) {
      console.error("Error in isCategoryUsed:", error);
      return false;
    }
  }, false);
}
