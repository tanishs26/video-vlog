"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onProgress?: (progress: number) => void;
  fileType?: "Image" | "Video";
  onUploadComplete?: (videoUrl: string, thumbnailUrl: string) => void;
}
const FileUpload = ({
  onProgress,
  fileType,
  onUploadComplete,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const validateFile = (file: File) => {
    if (fileType === "Video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid file type.");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("Please upload a file less than 100MB");
      return false;
    }
    return true;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;
    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/imagekit-auth");
      const auth = await response.json();
      console.log("Auth:", auth);
      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        expire: auth.expire,
        token: auth.token,
        signature: auth.signature,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      if (res && onUploadComplete) {
        const videoUrl = res.url!;
        const thumbnailUrl = res.thumbnailUrl!;
        onUploadComplete(videoUrl, thumbnailUrl);
      }
      return res;
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <input
        type="file"
        onChange={handleFileUpload}
        accept={fileType === "Video" ? "video/*" : "image/*"}
      />
      {uploading && <span className="animate-ping">Uploading...</span>}
      {error && <span className="text-red-500 text-2xl">{error}</span>}
    </>
  );
};

export default FileUpload;
