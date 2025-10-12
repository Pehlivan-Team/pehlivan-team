"use client";

import React, { useState } from "react";
import { Project } from "@/types/projects";
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
import { useSession } from "next-auth/react";
import slugify from "slugify";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";

type ProjectFormState = Omit<
  Project,
  "id" | "specifications" | "awards" | "images"
> & {
  specifications: string;
  awards: string;
  images: string[];
};

export function ProjectsClientPage({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectFormState>>({});

  const canManage = session?.user?.permissions?.canManageProjects;

  const handleOpenDialog = (project: Project | null) => {
    setEditingProject(project);
    if (project) {
      // Düzenleme için form verilerini string'e çevir
      setFormData({
        ...project,
        specifications:
          project.specifications
            ?.map((s) => `${s.label}:${s.value}`)
            .join(", ") || "",
        awards: project.awards?.join(", ") || "",
        images: project.images || [],
      });
    } else {
      // Ekleme için formu sıfırla
      const nextOrder =
        projects.length > 0 ? Math.max(...projects.map((p) => p.order)) + 1 : 1;
      setFormData({
        order: nextOrder,
        name: "",
        slug: "",
        category: "",
        year: "",
        leader: "",
        description: "",
        image: "",
        images: [""],
        awards: "",
        specifications: "",
      });
    }
    setIsDialogOpen(true);
  };
  const handleMultiImageUpload = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newFormData = {
      ...formData,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    };
    if (name === "name") {
      newFormData.slug = slugify(value, { lower: true, strict: true });
    }
    setFormData(newFormData);
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async () => {
    // String'leri tekrar diziye çevir
    const payload = {
      ...formData,
      specifications:
        formData.specifications
          ?.split(",")
          .map((s) => {
            const parts = s.split(":");
            return {
              label: parts[0]?.trim() || "",
              value: parts[1]?.trim() || "",
            };
          })
          .filter((s) => s.label && s.value) || [],
      awards:
        formData.awards
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
      images: formData.images || [],
    };

    const isEditing = !!editingProject;
    const url = isEditing
      ? `/api/admin/projects/${editingProject.id}`
      : "/api/admin/projects";
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
        setProjects(
          projects.map((p) =>
            p.id === editingProject.id
              ? ({ ...payload, id: editingProject.id } as Project)
              : p
          )
        );
        toast.success("Proje başarıyla güncellendi!");
      } else {
        setProjects([...projects, { ...payload, id: result.id } as Project]);
        toast.success("Yeni proje başarıyla eklendi!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "İşlem başarısız oldu."
      );
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      setProjects(projects.filter((p) => p.id !== projectId));
      toast.success("Proje başarıyla silindi!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Silme işlemi başarısız oldu."
      );
    }
  };
  if (!canManage) {
    return (
      <div className="text-red-500">Bu sayfayı görüntüleme izniniz yok.</div>
    );
  }

  return (
    <>
      {canManage && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => handleOpenDialog(null)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Yeni Proje Ekle
          </Button>
        </div>
      )}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Proje Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Yıl</TableHead>
              {canManage && (
                <TableHead className="text-right">İşlemler</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects
              .sort((a, b) => a.order - b.order)
              .map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.order}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(project)}
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
                              "{project.name}" adlı projeyi kalıcı olarak silmek
                              istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Evet, Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Sıra</Label>
              <Input
                name="order"
                type="number"
                value={formData.order || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Proje Adı</Label>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Slug</Label>
              <Input
                name="slug"
                value={formData.slug || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Kategori</Label>
              <Input
                name="category"
                value={formData.category || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Yıl</Label>
              <Input
                name="year"
                value={formData.year || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Lider</Label>
              <Input
                name="leader"
                value={formData.leader || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Açıklama</Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Ana Resim</Label>
              <ImageUploader
                initialImageUrl={formData.image}
                onUploadComplete={handleImageUpload}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Ek Resimler</Label>
                <MultiImageUploader
                  initialImageUrls={formData.images}
                  onUploadComplete={handleMultiImageUpload}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Ödüller</Label>
              <Textarea
                name="awards"
                value={formData.awards || ""}
                onChange={handleFormChange}
                placeholder="Virgülle ayırarak ödülleri girin..."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Özellikler</Label>
              <Textarea
                name="specifications"
                value={formData.specifications || ""}
                onChange={handleFormChange}
                placeholder="format: 'Label:Value, Label2:Value2'"
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
