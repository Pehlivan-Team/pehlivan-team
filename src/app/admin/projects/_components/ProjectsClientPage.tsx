 'use client'

import React from 'react'
import { Trash2, Edit, PlusCircle, Loader2, ArrowRight, User, Calendar, Trophy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

import ImageWrapper from '@/components/admin/ImageWrapper'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MultiImageUploader } from '@/components/admin/MultiImageUploader'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import NoPermError from '../../_components/NoPermError'
import { Project } from '@/types/projects'
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'

type ProjectFormState = Omit<Project, 'id' | 'images' | 'specifications' | 'awards'> & {
  images?: string[]
  specifications?: string | { label: string; value: string }[]
  awards?: string | string[]
}

export function ProjectsClientPage({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormState>({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: 0,
    category: '',
    year: '',
    leader: '',
    images: [],
    specifications: '',
    awards: [],
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()

  const canManage = !!session?.user?.permissions?.canManageProjects

  const handleOpenDialog = (project: Project | null) => {
    setEditingProject(project)
    if (project) {
      setFormData({
        ...project,
        images: project.images || [],
        awards: project.awards || [],
        specifications: Array.isArray(project.specifications) ? project.specifications : project.specifications || '',
      } as any)
    } else {
      const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order)) + 1 : 1
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        order: nextOrder,
        category: '',
        year: '',
        leader: '',
        images: [],
        specifications: '',
        awards: [],
      })
    }
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }))
  }

  const handleImageUpload = (url: string) => setFormData((prev) => ({ ...prev, image: url }))
  const handleMultiImageUpload = (urls: string[]) => setFormData((prev) => ({ ...prev, images: urls }))

  React.useEffect(() => {
    // When the dialog opens or images change, ensure Embla recalculates sizes so slides render correctly.
    if (!isDialogOpen) return
    if (!carouselApi) return
    // call reInit multiple times (short delays) to handle animation timing, and add a resize fallback
    const timers: ReturnType<typeof setTimeout>[] = []
    const tryReInit = () => {
      try {
        carouselApi.reInit()
      } catch (e) {
        // ignore
      }
    }

    timers.push(setTimeout(tryReInit, 50))
    timers.push(setTimeout(tryReInit, 200))
    timers.push(setTimeout(tryReInit, 500))

    const onResize = () => tryReInit()
    window.addEventListener('resize', onResize)

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', onResize)
    }
  }, [isDialogOpen, carouselApi, formData.image, formData.images])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name || formData.name.trim().length === 0) errors.name = 'Proje adı gerekli.'
    if (!formData.slug || formData.slug.trim().length === 0) errors.slug = 'Slug gerekli.'
    if (!formData.description || formData.description.trim().length === 0) errors.description = 'Açıklama gerekli.'
    if (!formData.order || Number.isNaN(Number(formData.order))) errors.order = 'Sıra geçerli bir sayı olmalı.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setSubmitting(true)

    const payload: any = {
      ...formData,
      specifications: typeof formData.specifications === 'string'
        ? (formData.specifications as string).split(',').map((s) => {
            const parts = s.split(':')
            return { label: parts[0]?.trim() || '', value: parts[1]?.trim() || '' }
          }).filter((s) => s.label && s.value)
        : formData.specifications,
      awards: typeof formData.awards === 'string' ? (formData.awards as string).split(',').map((s) => s.trim()).filter(Boolean) : formData.awards,
      images: formData.images || [],
    }

    const isEditing = !!editingProject
    const url = isEditing ? `/api/admin/projects/${editingProject?.id}` : '/api/admin/projects'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      if (isEditing && editingProject) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? ({ ...payload, id: editingProject.id } as Project) : p)))
        toast.success('Proje başarıyla güncellendi!')
      } else {
        setProjects([...projects, { ...payload, id: result.id } as Project])
        toast.success('Yeni proje başarıyla eklendi!')
      }
      setIsDialogOpen(false)
      setIsSheetOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'İşlem başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, { method: 'DELETE' })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setProjects(projects.filter((p) => p.id !== projectId))
      toast.success('Proje başarıyla silindi!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Silme işlemi başarısız oldu.')
    }
  }

  if (!canManage) return <NoPermError />

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Proje Ekle
        </Button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Proje Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Yıl</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
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
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(project)}>
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
                          <AlertDialogDescription>Bu projeyi silmek istediğinizden emin misiniz?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-red-600 hover:bg-red-700">
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
        <DialogContent className="max-w-7xl w-full">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: project detail-like preview */}
            <div className="space-y-6">
              <p className="font-semibold text-red-400">{formData.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">{formData.name || 'Yeni Proje'}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg border-y border-gray-700 py-4 text-white">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                  <span>{formData.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-gray-400" />
                  <span>
                    Kaptan: <b>{formData.leader}</b>
                  </span>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">{formData.description}</p>

              {formData.awards && (Array.isArray(formData.awards) ? formData.awards.length > 0 : (formData.awards as string).length > 0) && (
                <div className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <Trophy className="h-7 w-7 text-yellow-400" /> Kazanılan Ödüller
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-300">
                    {(Array.isArray(formData.awards) ? formData.awards : (formData.awards as string).split(',')).map((award, idx) => (
                      <li key={idx}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: sticky carousel (pure preview) */}
            <div className="sticky top-8 space-y-6">
        <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                <CarouselContent>
                  {(formData.images && formData.images.length > 0 ? formData.images : [formData.image]).map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-slate-700 bg-slate-900">
                        {/* Use a native <img> in admin preview to avoid next/image measurement/loader issues inside hidden dialogs */}
                        {photo ? (
                          // `photo` may already be a proxied url; using plain img ensures it renders inside the dialog
                          <img src={photo} alt={`${formData.name} - Resim ${index + 1}`} className="object-cover w-full h-full" loading={index === 0 ? 'eager' : 'lazy'} />
                        ) : (
                          <div className="flex items-center justify-center text-sm text-slate-400 h-full">No image</div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80 border-slate-600" />
                <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80 border-slate-600" />
              </Carousel>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Düzenle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Slide-over sheet for editing (form moved here) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</SheetTitle>
            <SheetDescription>Buradan proje bilgilerini güncelleyebilirsiniz.</SheetDescription>
          </SheetHeader>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Proje Adı</Label>
                <Input name="name" value={formData.name || ''} onChange={handleFormChange} className="mt-1 w-full" aria-invalid={!!formErrors.name} />
                {formErrors.name && <p className="text-sm text-red-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <Label className="text-sm">Slug</Label>
                <Input name="slug" value={formData.slug || ''} onChange={handleFormChange} className="mt-1 w-full" aria-invalid={!!formErrors.slug} />
                {formErrors.slug && <p className="text-sm text-red-400 mt-1">{formErrors.slug}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Kategori</Label>
                  <Input name="category" value={formData.category || ''} onChange={handleFormChange} className="mt-1 w-full" />
                </div>
                <div>
                  <Label className="text-sm">Yıl</Label>
                  <Input name="year" value={formData.year || ''} onChange={handleFormChange} className="mt-1 w-full" />
                </div>
              </div>

              <div>
                <Label className="text-sm">Sıra</Label>
                <Input name="order" type="number" value={formData.order as any || ''} onChange={handleFormChange} className="mt-1 w-full" aria-invalid={!!formErrors.order} />
                {formErrors.order && <p className="text-sm text-red-400 mt-1">{formErrors.order}</p>}
              </div>

              <div>
                <Label className="text-sm">Lider</Label>
                <Input name="leader" value={formData.leader || ''} onChange={handleFormChange} className="mt-1 w-full" />
              </div>

              <div>
                <Label className="text-sm">Açıklama</Label>
                <Textarea name="description" value={formData.description || ''} onChange={handleFormChange} className="mt-1 w-full" aria-invalid={!!formErrors.description} />
                {formErrors.description && <p className="text-sm text-red-400 mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <Label className="text-sm">Ana Resim</Label>
                <div className="mt-1">
                  <ImageUploader initialImageUrl={formData.image} onUploadComplete={handleImageUpload} />
                </div>
              </div>

              <div>
                <Label className="text-sm">Ek Resimler</Label>
                <div className="mt-1">
                  <MultiImageUploader initialImageUrls={formData.images} onUploadComplete={handleMultiImageUpload} />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <div className="w-full flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsSheetOpen(false)} disabled={submitting}>İptal</Button>
              <Button onClick={handleSubmit} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Kaydet</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
