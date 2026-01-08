/**
 * Photo upload component with preview
 */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  onUploadComplete: (url: string) => void;
  profileId: string;
}

export function PhotoUpload({
  currentPhotoUrl,
  onUploadComplete,
  profileId,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentPhotoUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError("");
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload-photo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to upload photo");
        setPreview(currentPhotoUrl || null);
        return;
      }

      onUploadComplete(data.url);
    } catch (err) {
      setError("An error occurred while uploading the photo.");
      setPreview(currentPhotoUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Preview */}
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-300 dark:border-gray-700">
              <span className="text-gray-400 text-2xl">👤</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : preview ? "Change Photo" : "Upload Photo"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            JPEG, PNG, or WebP. Max 5MB.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

