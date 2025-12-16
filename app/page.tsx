"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Upload from "./components/Upload";
import { Video } from "@imagekit/next";

// Define the interface matching your MongoDB Video model
interface IVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const router = useRouter();
  // Type the state as an array of IVideo objects
  const [data, setData] = useState<IVideo[]>([]);
  const [showUpload, setUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/video", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data: IVideo[] = await res.json();
      setData(data);
      return data;
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-auto">
      <header className="flex justify-between items-center bg-neutral-900 h-16 px-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold text-white">Video Uploader</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-green-500 px-4 py-2 rounded-md text-white"
          >
            Login
          </button>
          <button className="bg-blue-500 px-4 py-2 rounded-md text-white">
            Register
          </button>
          <button
            onClick={() => setUpload((prev) => !prev)}
            className="bg-cyan-500 px-4 py-2 rounded-md text-white"
          >
            Upload
          </button>
        </div>
      </header>

      {/* Body */}
      {isLoading && (
        <div className="text-center p-8">
          <p className="text-gray-600">Loading videos...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {data.map((item) => (
            <div key={item._id} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-black">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Video
                urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
                src={item.videoUrl}
                controls={item.controls ?? true}
                width={1080}
                height={1920}
                className="w-full rounded"
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && data.length === 0 && !error && (
        <div className="text-center p-8">
          <p className="text-gray-600">No videos uploaded yet</p>
        </div>
      )}

      {showUpload && <Upload />}
    </div>
  );
}
