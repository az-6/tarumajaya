"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({
  label,
  value = [],
  onChange,
  maxImages = 10,
  className = "",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding new files exceeds max limit
    if (value.length + files.length > maxImages) {
      alert(`Maksimal ${maxImages} gambar`);
      return;
    }

    setUploading(true);

    try {
      const newImages: string[] = [];

      // Process each file
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} bukan gambar yang valid`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar (maksimal 5MB)`);
          continue;
        }

        // Convert to base64 for preview (in real implementation, upload to server)
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }

      // Update images
      onChange([...value, ...newImages]);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Gagal memproses gambar");
    }

    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>

      <div className="mt-2 space-y-4">
        {/* Upload Button */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || value.length >= maxImages}
                  className="mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Mengupload..." : "Pilih Gambar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, JPEG hingga 5MB. Maksimal {maxImages} gambar.
                {value.length > 0 && ` (${value.length}/${maxImages})`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Images */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
