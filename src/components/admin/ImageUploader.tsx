"use client";

import { useState } from "react";
import { useEdgeStore } from '@/lib/edgestore'; // <-- CHANGE THIS IMPORT
import { toast } from "sonner";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string;
}

export function ImageUploader({ onUploadComplete, initialImageUrl }: ImageUploaderProps) {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const { edgestore } = useEdgeStore(); // This hook will now work correctly

  const handleUpload = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      setImageUrl(res.url);
      onUploadComplete(res.url);
      toast.success("Resim başarıyla yüklendi!");
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl("");
    onUploadComplete("");
  };

  return (
    <div className="col-span-3">
      {imageUrl ? (
        <div className="relative w-full h-48 border-2 border-dashed rounded-lg p-2">
            <Image src={imageUrl} alt="Yüklenen resim" layout="fill" objectFit="contain" />
            <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
                <X size={16} />
            </button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center">
            <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
            <input
                type="file"
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-red-700 hover:file:bg-violet-100"
                onChange={(e) => {
                    setFile(e.target.files?.[0]);
                }}
                accept="image/*"
            />
            {progress > 0 && <Progress value={progress} className="w-full mt-2" />}
            <button
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                onClick={handleUpload}
                disabled={!file || progress > 0}
            >
                {progress > 0 ? <Loader2 className="animate-spin" /> : "Yükle"}
            </button>
        </div>
      )}
    </div>
  );
}