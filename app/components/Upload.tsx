"use client";
import { useState } from "react";
import FileUpload from "./FileUpload";

export default function VideoUploadForm() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quality, setQuality] = useState(100);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl || !thumbnailUrl || !title || !description) {
      alert("Please fill all fields and upload files");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
          transformation: {
            quality,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Video uploaded successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setThumbnailUrl("");
        setQuality(100);
      } else {
        alert(data.error || "Failed to create video");
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      alert("Failed to submit video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6">
      <div>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Quality (1-100)</label>
        <input
          type="number"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          min={1}
          max={100}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Upload Video</label>
        <FileUpload
          fileType="Video"
          onProgress={setUploadProgress}
          onUploadComplete={(url, thumb) => {
            setVideoUrl(url);
            setThumbnailUrl(thumb);
          }}
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <progress value={uploadProgress} max={100} className="w-full" />
            <p>{uploadProgress}%</p>
          </div>
        )}
        {videoUrl && <p className="text-green-600 mt-2">✓ Video uploaded</p>}
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Upload Thumbnail (Optional)
        </label>
        <FileUpload
          fileType="Image"
          onUploadComplete={(url) => setThumbnailUrl(url)}
        />
        {thumbnailUrl && <p className="text-green-600 mt-2">✓ Thumbnail set</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !videoUrl || !thumbnailUrl}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Create Video"}
      </button>
    </form>
  );
}
