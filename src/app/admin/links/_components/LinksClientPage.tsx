"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShortLink } from "../page";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Copy, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

export function LinksClientPage({ 
  initialLinks,
  totalPages,
  currentPage
}: { 
  initialLinks: ShortLink[];
  totalPages: number;
  currentPage: number;
}) {
  const [links, setLinks] = useState<ShortLink[]>(initialLinks);
  const router = useRouter();

  const handleDelete = async (idToDelete: string) => {
    try {
      const response = await fetch(`/api/admin/links/${idToDelete}`, { method: 'DELETE' });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      
      setLinks(currentLinks => currentLinks.filter(link => link.id !== idToDelete));
      toast.success("Link başarıyla silindi!");
      // Eğer sayfadaki son link silindiyse ve bu ilk sayfa değilse, bir önceki sayfaya yönlendir.
      if (links.length === 1 && currentPage > 1) {
        router.push(`/admin/links?page=${currentPage - 1}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    toast.info("Kısa link panoya kopyalandı!");
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/links?page=${page}`);
  };

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kısa Link</TableHead>
              <TableHead>Orijinal Link</TableHead>
              <TableHead>Oluşturulma Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono text-red-400">/s/{link.slug}</TableCell>
                <TableCell className="max-w-xs truncate text-gray-400">{link.longUrl}</TableCell>
                <TableCell>{format(new Date(link.createdAt), "dd MMMM yyyy, HH:mm", { locale: tr })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.slug)}>
                    <Copy className="h-4 w-4" />
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
                        <AlertDialogDescription>
                          Bu işlem geri alınamaz. Bu kısa link kalıcı olarak silinecektir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(link.id)} className="bg-red-600 hover:bg-red-700">
                          Evet, Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {links.length === 0 && <p className="text-center text-gray-400 p-8">Bu sayfada gösterilecek link bulunmuyor.</p>}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `/admin/links?page=${currentPage - 1}` : '#'}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/admin/links?page=${page}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `/admin/links?page=${currentPage + 1}` : '#'}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}