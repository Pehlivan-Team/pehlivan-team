"use client";

import React, { useState } from "react";
import { AdminUser } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
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
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function AdminsClientPage({ initialAdmins }: { initialAdmins: AdminUser[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); // Mevcut kullanıcıyı kontrol etmek için

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setAdmins(prev => [...prev, { email: newAdminEmail }]);
      setNewAdminEmail("");
      toast.success(`'${newAdminEmail}' başarıyla admin olarak eklendi!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin eklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (emailToDelete: string) => {
    try {
        const response = await fetch('/api/admin/admins', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailToDelete }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        setAdmins(prev => prev.filter(admin => admin.email !== emailToDelete));
        toast.success(`'${emailToDelete}' admin listesinden kaldırıldı.`);
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Admin silinemedi.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Admin Ekle</CardTitle>
        <CardDescription>
          Admin paneline erişim izni vermek için kullanıcının Google e-posta adresini ekleyin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddAdmin} className="flex gap-2 mb-8">
          <Input
            type="email"
            placeholder="yeni.admin@gmail.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Ekle</span>
          </Button>
        </form>

        <h3 className="text-lg font-semibold mb-4">Mevcut Adminler</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>E-posta Adresi</TableCell>
                <TableCell className="text-right">İşlemler</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map(admin => (
                <TableRow key={admin.email}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell className="text-right">
                    {session?.user?.email !== admin.email && ( // Kullanıcının kendini silmesini engelle
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
                              "{admin.email}" adlı kullanıcıyı admin listesinden kalıcı olarak kaldırmak istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAdmin(admin.email)} className="bg-red-600 hover:bg-red-700">Evet, Kaldır</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}