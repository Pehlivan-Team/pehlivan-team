"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Post } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import slugify from "slugify";

// ReactQuill kütüphanesini sadece istemci tarafında yüklüyoruz
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Editörün stil dosyası

type PostFormProps = {
  initialData?: Post; // Düzenleme modu için mevcut yazı verisi
};

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Başlık değiştikçe, URL'e uygun slug'ı otomatik oluştur
    setSlug(slugify(newTitle, { lower: true, strict: true }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const postData = { title, slug, content, imageUrl, isPublished };

    const isEditing = !!initialData;
    const url = isEditing
      ? `/api/admin/posts/${initialData.id}`
      : "/api/admin/posts";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      toast.success(
        isEditing
          ? "Yazı başarıyla güncellendi!"
          : "Yazı başarıyla oluşturuldu!"
      );
      router.push("/admin/blog"); // İşlem sonrası ana blog yönetimi sayfasına yönlendir
      router.refresh(); // Sunucu tarafındaki verilerin yenilenmesini sağla
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sol Taraf: Ana Form Alanları */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <Label htmlFor="title">Yazı Başlığı</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Blog yazınızın başlığı..."
          />
        </div>
        <div>
          <Label htmlFor="slug">URL (Slug)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="yazi-basligi-icin-url"
          />
        </div>
        <div>
          <Label>Yazı İçeriği</Label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white text-black rounded-md"
          />
        </div>
      </div>

      {/* Sağ Taraf: Ayarlar ve Kaydet Butonu */}
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-slate-900/50 border-slate-800">
          <h3 className="font-semibold mb-4">Ayarlar</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublished">Yayında</Label>
            <Switch
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>
        </div>
        <div className="p-4 border rounded-lg bg-slate-900/50 border-slate-800">
          <h3 className="font-semibold mb-4">Kapak Resmi</h3>
          <ImageUploader
            initialImageUrl={imageUrl}
            onUploadComplete={setImageUrl}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading
            ? "Kaydediliyor..."
            : initialData
            ? "Değişiklikleri Kaydet"
            : "Yazıyı Oluştur"}
        </Button>
      </div>
    </div>
  );
}
