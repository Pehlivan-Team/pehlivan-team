"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

export function BlogClientPage({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      toast.success("Yazı başarıyla silindi!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Silme işlemi başarısız oldu.");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link href="/admin/blog/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Yazı Ekle
          </Button>
        </Link>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Oluşturulma Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Yayınlandı" : "Taslak"}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(post.createdAt), "dd MMMM yyyy", { locale: tr })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/blog/edit/${post.id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>"{post.title}" başlıklı yazıyı kalıcı olarak silmek istediğinizden emin misiniz?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-red-600 hover:bg-red-700">Evet, Sil</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {posts.length === 0 && <p className="text-center text-gray-400 p-8">Henüz hiç blog yazısı oluşturulmamış.</p>}
      </div>
    </>
  );
}