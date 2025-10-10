"use client";

import React, { useState } from "react";
import { TimelineEvent } from "../page";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/ImageUploader";

// Form için tip tanımı
type EventFormState = Omit<TimelineEvent, "id" | "awards"> & {
  awards: string | string[];
};

export function TimelineClientPage({
  initialEvents,
}: {
  initialEvents: TimelineEvent[];
}) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [formData, setFormData] = useState<EventFormState>({
    order: 0,
    year: "",
    title: "",
    description: "",
    image: "",
    awards: [],
  });

  const handleOpenDialog = (event: TimelineEvent | null) => {
    setEditingEvent(event);
    if (event) {
      // Düzenleme: Formu mevcut verilerle doldur
      setFormData({ ...event, awards: event.awards.join(", ") } as any);
    } else {
      // Ekleme: Formu sıfırla ve yeni sıra numarasını hesapla
      const nextOrder =
        events.length > 0 ? Math.max(...events.map((e) => e.order)) + 1 : 1;
      setFormData({
        order: nextOrder,
        year: "",
        title: "",
        description: "",
        image: "",
        awards: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async () => {
    const awardsArray =
      typeof formData.awards === "string"
        ? formData.awards
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const payload = { ...formData, awards: awardsArray };

    const isEditing = !!editingEvent;
    const url = isEditing
      ? `/api/admin/timeline/${editingEvent.id}`
      : "/api/admin/timeline";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      if (isEditing) {
        setEvents(
          events.map((e) =>
            e.id === editingEvent.id ? { ...payload, id: editingEvent.id } : e
          )
        );
        toast.success("Tarihçe olayı başarıyla güncellendi!");
      } else {
        setEvents([...events, { ...payload, id: result.id }]);
        toast.success("Yeni tarihçe olayı başarıyla eklendi!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "İşlem başarısız oldu."
      );
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/timeline/${eventId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setEvents(events.filter((e) => e.id !== eventId));
      toast.success("Olay başarıyla silindi!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Silme işlemi başarısız oldu."
      );
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Olay Ekle
        </Button>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Yıl</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events
              .sort((a, b) => a.order - b.order)
              .map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.order}</TableCell>
                  <TableCell>{event.year}</TableCell>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{event.title}" adlı olayı kalıcı olarak silmek
                            istediğinizden emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Olayı Düzenle" : "Yeni Olay Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">
                Sıra
              </Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Yıl
              </Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Başlık
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Açıklama
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Resim</Label>
              <ImageUploader
                initialImageUrl={formData.image}
                onUploadComplete={handleImageUpload}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awards" className="text-right">
                Ödüller
              </Label>
              <Textarea
                id="awards"
                name="awards"
                value={formData.awards as any}
                onChange={handleFormChange}
                placeholder="Virgülle ayırarak yazın..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
