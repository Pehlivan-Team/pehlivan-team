"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPostSchema } from "@/lib/validation/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Post } from "@/types/posts";
import { useEdgeStore } from "@/lib/edgestore";
import { Image as ImageIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

type PostFormValues = z.infer<typeof createPostSchema>;

interface EditPostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPostModal({
  post,
  open,
  onOpenChange,
}: EditPostModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Resim yükleme state'leri (PostComposer'dan benzer)
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  // Mevcut veya yeni seçilen resim URL'i
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    post.imageUrl || null
  );

  const form = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: post.content,
      imageUrl: post.imageUrl || undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: PostFormValues) => {
    try {
      let finalImageUrl: string | null = post.imageUrl || null;

      // 1. Yeni bir resim seçildiyse YÜKLE
      if (file) {
        // TODO: Eski resmi EdgeStore'dan silmek (post.imageUrl varsa)

        const res = await edgestore.postImages.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress);
          },
        });
        finalImageUrl = res.url; // Yüklenen URL'i al
      }
      // 2. Resim kaldırıldıysa (previewUrl null ama file yok)
      else if (!previewUrl) {
        // TODO: Eski resmi EdgeStore'dan silmek (post.imageUrl varsa)
        finalImageUrl = null;
      }

      // 3. API'ye PUT isteği gönder
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: values.content,
          imageUrl: finalImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Post güncellenemedi.");
      }

      toast({ title: "Başarılı!", description: "Post güncellendi." });
      onOpenChange(false); // Modalı kapat
      form.reset();
      setFile(null);
      setProgress(0);
      router.refresh(); // Sayfayı yenile
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    form.setValue("imageUrl", undefined); // Form değerini de undefined yap
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Postu Düzenle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Neler oluyor?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resim Önizleme */}
            {previewUrl && (
              <div className="relative w-full h-64">
                <Image
                  src={previewUrl}
                  alt="Önizleme"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Yükleme İlerlemesi */}
            {progress > 0 && progress < 100 && (
              <Progress value={progress} className="w-full" />
            )}

            <div className="flex justify-between items-center">
              <label
                htmlFor="file-upload-edit"
                className="cursor-pointer text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-slate-800"
              >
                <ImageIcon className="h-5 w-5" />
                <input
                  id="file-upload-edit"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    İptal
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
