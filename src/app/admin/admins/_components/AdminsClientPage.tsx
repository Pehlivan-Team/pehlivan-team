'use client'

import { Trash2, PlusCircle, Loader2, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { Fragment, useState } from 'react'
import { toast } from 'sonner'

// Alert component not used in this file
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import NoPermError from '../../_components/NoPermError'
import { AdminUser } from '../page'

const allPermissions = [
  { id: 'canManageAdmins', label: 'Admin Yönetimi' },
  { id: 'canManageBlog', label: 'Blog Yönetimi' },
  { id: 'canManageLinks', label: 'Link Yönetimi' },
  { id: 'canManageNeeds', label: 'İhtiyaç Listesi' },
  { id: 'canManageTimeline', label: 'Tarihçe Yönetimi' },
]

export function AdminsClientPage({ initialAdmins }: { initialAdmins: AdminUser[] }) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const { data: session } = useSession()

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setAdmins((prev) => [...prev, { email: newAdminEmail, permissions: {} }])
      setNewAdminEmail('')
      toast.success(`'${newAdminEmail}' başarıyla admin olarak eklendi!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Admin eklenemedi.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteAdmin = async (emailToDelete: string) => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToDelete }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setAdmins((prev) => prev.filter((admin) => admin.email !== emailToDelete))
      toast.success(`'${emailToDelete}' admin listesinden kaldırıldı.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Admin silinemedi.')
    }
  }

  const handlePermissionChange = async (
    email: string,
    permissionId: string,
    isChecked: boolean
  ) => {
    try {
      const currentAdmin = admins.find((a) => a.email === email)
      if (!currentAdmin) throw new Error('Kullanıcı bulunamadı.')

      const updatedPermissions = {
        ...currentAdmin.permissions,
        [permissionId]: isChecked,
      }

      const response = await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, permissions: updatedPermissions }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      setAdmins(
        admins.map((admin) =>
          admin.email === email ? { ...admin, permissions: updatedPermissions } : admin
        )
      )
      toast.success(`'${email}' için yetkiler güncellendi.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Yetki güncellenemedi.')
      // Hata durumunda UI'ı eski haline döndürmek için state'i tekrar set edebiliriz.
      setAdmins([...admins])
    }
  }
  if (!session?.user?.permissions?.canManageAdmins) {
    return <NoPermError />
  }
  return (
    <div className="space-y-8">
      {session?.user?.permissions?.canManageAdmins && (
        <Card>
          <CardHeader>
            <CardTitle>Yeni Admin Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <Input
                type="email"
                placeholder="yeni.admin@gmail.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Ekle</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Yetki Yönetimi</CardTitle>
          <CardDescription>Mevcut adminlerin yetkilerini düzenleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            {admins.map((admin) => (
              <div
                key={admin.email}
                className="flex items-center justify-between p-4 border-b last:border-b-0"
              >
                <span className="font-medium">{admin.email}</span>
                <div className="flex items-center gap-2">
                  {session?.user?.permissions?.canManageAdmins &&
                    session?.user?.email !== admin.email && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Yetkileri Düzenle
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black">
                          <DropdownMenuLabel>İzinler</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-800" />
                          {allPermissions.map((permission) => (
                            <Fragment key={permission.id}>
                              <DropdownMenuCheckboxItem
                                key={permission.id}
                                checked={
                                  !!admin.permissions[
                                    permission.id as keyof typeof admin.permissions
                                  ]
                                }
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(admin.email, permission.id, !!checked)
                                }
                              >
                                {permission.label}
                              </DropdownMenuCheckboxItem>
                              <DropdownMenuSeparator className="bg-gray-800" />
                            </Fragment>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  {session?.user?.permissions?.canManageAdmins &&
                    session?.user?.email !== admin.email && (
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
                              "{admin.email}" adlı kullanıcıyı admin listesinden kalıcı olarak
                              kaldırmak istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAdmin(admin.email)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Evet, Kaldır
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
