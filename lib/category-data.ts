// Category management functions
// In a real app, these would be API calls to your backend

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Kuliner",
    description: "Makanan dan minuman",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Fashion",
    description: "Pakaian dan aksesoris",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Kerajinan",
    description: "Produk kerajinan tangan",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Jasa",
    description: "Layanan jasa",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Teknologi",
    description: "Produk dan jasa teknologi",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Kesehatan",
    description: "Produk dan jasa kesehatan",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Pendidikan",
    description: "Layanan pendidikan dan kursus",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "8",
    name: "Lainnya",
    description: "Kategori lainnya",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

// Simulate localStorage data
let categories: Category[] = [...DEFAULT_CATEGORIES];

export function getAllCategories(): Category[] {
  return [...categories];
}

export function getCategoryById(id: string): Category | null {
  return categories.find((cat) => cat.id === id) || null;
}

export function getCategoryByName(name: string): Category | null {
  return categories.find((cat) => cat.name === name) || null;
}

export function addCategory(
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Category {
  const newCategory: Category = {
    ...categoryData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  return newCategory;
}

export function updateCategory(
  id: string,
  categoryData: Partial<Omit<Category, "id" | "createdAt">>
): Category | null {
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...categoryData,
    updatedAt: new Date().toISOString(),
  };

  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) return false;

  categories.splice(index, 1);
  return true;
}

export function getCategoryNames(): string[] {
  return categories.map((cat) => cat.name);
}
