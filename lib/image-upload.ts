import { supabase } from "./supabase";

// Utility function untuk convert base64 ke File object
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Upload single image ke Supabase Storage
export async function uploadImage(
  base64Data: string,
  path: string,
  filename?: string
): Promise<string | null> {
  try {
    // Generate filename jika tidak ada
    const finalFilename =
      filename ||
      `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const fullPath = `${path}/${finalFilename}`;

    // Convert base64 to file
    const file = base64ToFile(base64Data, finalFilename);

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from("umkm-images")
      .upload(fullPath, file, {
        cacheControl: "3600",
        upsert: true, // Replace jika file sudah ada
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("umkm-images").getPublicUrl(fullPath);

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
}

// Upload multiple images
export async function uploadImages(
  base64Images: string[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = base64Images.map((base64, index) => {
    // Skip jika bukan base64 (mungkin sudah URL)
    if (!base64.startsWith("data:image/")) {
      return Promise.resolve(base64);
    }

    return uploadImage(
      base64,
      basePath,
      `image-${index + 1}-${Date.now()}.jpg`
    );
  });

  const results = await Promise.all(uploadPromises);

  // Filter out null results
  return results.filter((url): url is string => url !== null);
}

// Delete image dari storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Skip jika bukan URL storage Supabase
    if (!imageUrl.includes("supabase") || isBase64Image(imageUrl)) {
      return true; // Nothing to delete
    }

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    // Format: /storage/v1/object/public/umkm-images/umkm/id/filename.jpg
    const bucketIndex = pathParts.findIndex((part) => part === "umkm-images");

    if (bucketIndex === -1) {
      console.error("Could not find bucket in URL:", imageUrl);
      return false;
    }

    const bucket = pathParts[bucketIndex]; // umkm-images
    const filePath = pathParts.slice(bucketIndex + 1).join("/"); // umkm/id/filename.jpg

    console.log(`Deleting image: ${bucket}/${filePath}`);

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    console.log("Image deleted successfully:", filePath);
    return true;
  } catch (error) {
    console.error("Error in deleteImage:", error);
    return false;
  }
}

// Delete multiple images
export async function deleteImages(imageUrls: string[]): Promise<void> {
  const deletePromises = imageUrls
    .filter((url) => url && !isBase64Image(url))
    .map((url) => deleteImage(url));

  await Promise.all(deletePromises);
}

// Cleanup orphaned images - hapus gambar yang tidak lagi digunakan
export async function cleanupOrphanedImages(
  umkmId: string,
  newImages: string[],
  oldImages: string[] = []
): Promise<void> {
  try {
    // Find images that were removed (in old but not in new)
    const imagesToDelete = oldImages.filter(
      (oldUrl) => !newImages.includes(oldUrl) && !isBase64Image(oldUrl)
    );

    if (imagesToDelete.length > 0) {
      console.log(
        `Cleaning up ${imagesToDelete.length} orphaned images for UMKM ${umkmId}`
      );
      await deleteImages(imagesToDelete);
    }
  } catch (error) {
    console.error("Error in cleanupOrphanedImages:", error);
  }
}

// Delete all images for a UMKM (when UMKM is deleted)
export async function deleteAllUmkmImages(umkmId: string): Promise<void> {
  try {
    const folderPath = `umkm/${umkmId}`;
    console.log(`Deleting all images for UMKM: ${umkmId}`);

    // List all files in the UMKM folder
    const { data: files, error: listError } = await supabase.storage
      .from("umkm-images")
      .list(folderPath);

    if (listError) {
      console.error("Error listing files:", listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log("No images found to delete");
      return;
    }

    // Delete all files
    const filePaths = files.map((file) => `${folderPath}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from("umkm-images")
      .remove(filePaths);

    if (deleteError) {
      console.error("Error deleting files:", deleteError);
    } else {
      console.log(`Deleted ${filePaths.length} images for UMKM ${umkmId}`);
    }
  } catch (error) {
    console.error("Error in deleteAllUmkmImages:", error);
  }
}

// Helper: Check apakah string adalah base64 image
export function isBase64Image(str: string): boolean {
  return typeof str === "string" && str.startsWith("data:image/");
}

// Helper: Generate unique path untuk UMKM
export function generateUmkmImagePath(umkmId: string): string {
  return `umkm/${umkmId}`;
}
