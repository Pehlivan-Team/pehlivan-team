"use client";

import React, { useState } from "react";
import { DepartmentNeeds } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, ExternalLink, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export function NeedsClientPage({ initialData }: { initialData: DepartmentNeeds[] }) {
  const [data, setData] = useState(initialData);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (itemId: string, departmentName: string) => {
    try {
      const response = await fetch(`/api/admin/needs/${departmentName}/${itemId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setData(currentData =>
        currentData.map(dept => 
          dept.departmentName === departmentName
            ? { ...dept, items: dept.items.filter(item => item.id !== itemId) }
            : dept
        )
      );
      toast.success("Ürün başarıyla silindi!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Silme işlemi başarısız oldu.");
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.length < 2) {
      toast.error("Kategori adı en az 2 karakter olmalıdır.");
      return;
    }
    try {
      const response = await fetch('/api/admin/needs/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setData(currentData => [...currentData, { departmentName: newCategoryName, items: [] }]);
      setNewCategoryName("");
      toast.success(`'${newCategoryName}' kategorisi başarıyla eklendi!`);
      setIsDialogOpen(false);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Kategori eklenemedi.");
    }
  };

  return (
    <Tabs defaultValue={data[0]?.departmentName || ''}>
      <div className="flex items-center gap-4">
        <TabsList>
          {data.map(dept => (
            <TabsTrigger key={dept.departmentName} value={dept.departmentName}>
              {dept.departmentName}
            </TabsTrigger>
          ))}
        </TabsList>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                </DialogHeader>
                <Input 
                    placeholder="Yeni kategori adı (örn: Yazılım)" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                    <Button onClick={handleAddCategory}>Ekle</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      {data.map(dept => (
        <TabsContent key={dept.departmentName} value={dept.departmentName}>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parça Adı</TableHead>
                  <TableHead>Adet</TableHead>
                  <TableHead>Birim Fiyat</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.part_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toFixed(2)} ₺</TableCell>
                    <TableCell className="text-right">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
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
                              "{item.part_name}" adlı ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id, dept.departmentName)} className="bg-red-600 hover:bg-red-700">
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
            {dept.items.length === 0 && <p className="text-center text-gray-400 p-8">Bu departman için henüz bir ihtiyaç eklenmemiş.</p>}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}