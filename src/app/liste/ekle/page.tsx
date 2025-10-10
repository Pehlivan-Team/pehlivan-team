"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Form verilerinin yapısını ve doğrulama kurallarını tanımlıyoruz
/*
 * 5 parametremiz var: part_name, quantity, price, link, team
 * part_name: Parça adı, en az 3 karakter olmalı
 * quantity: Miktar, en az 1 olmalı
 * price: Fiyat, 0 veya daha büyük olmalı
 * link: Geçerli bir URL olmalı
 * team: Departman, boş bırakılamaz
 */
const itemSchema = z.object({
  part_name: z
    .string()
    .min(3, { message: "Parça adı en az 3 karakter olmalı." }),
  quantity: z.coerce.number().min(1, { message: "Miktar en az 1 olmalı." }),
  price: z.coerce
    .number()
    .min(0, { message: "Fiyat 0 veya daha büyük olmalı." }),
  link: z.string().url({ message: "Lütfen geçerli bir URL girin." }),
  team: z.string().min(1, { message: "Lütfen bir departman seçin." }),
});

type FormState = z.infer<typeof itemSchema>;

export default function AddItemPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<Partial<FormState>>({});
  const [departments, setDepartments] = useState<string[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch("/api/liste/categories"); // Bu API'yi birazdan oluşturacağız
        const data = await response.json();
        if (data.success) {
          setDepartments(data.departments);
        }
      } catch (error) {
        console.error("Departmanlar alınamadı:", error);
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setApiError("");

    const result = itemSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Partial<Record<keyof FormState, string>> = {};
      for (const key in fieldErrors) {
        if (fieldErrors[key as keyof FormState]) {
          newErrors[key as keyof FormState] =
            fieldErrors[key as keyof FormState]![0];
        }
      }
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    /* API isteği gönderiyoruz
     * Başarılı olursa kullanıcıyı liste sayfasına yönlendiriyoruz
     * Hata olursa hata mesajını gösteriyoruz
     * İstek süresince butonu devre dışı bırakıyoruz
     */
    try {
      const response = await fetch("/api/add_needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Bir hata oluştu.");
      }
      /* Başarılı ise */
      alert("Ürün başarıyla eklendi!");
      router.push("/liste"); // Kullanıcıyı liste sayfasına yönlendir
    } catch (err) {
      /* Hata durumunda :
       * API'den gelen hata mesajını veya genel bir hata mesajını gösteriyoruz
       * İstek süresince butonu devre dışı bırakıyoruz
       */
      setApiError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu."
      );
    } finally {
      /* İstek tamamlandığında yükleme durumunu kapatıyoruz. Butonun yeniden aktif! */
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg bg-slate-800 border-slate-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            İhtiyaç Listesine Ürün Ekle
          </CardTitle>
          <CardDescription className="text-gray-400">
            Yeni bir parça veya malzemeyi ilgili departmanın listesine ekleyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="part_name">Parça Adı*</FieldLabel>
                <Input
                  id="part_name"
                  name="part_name"
                  onChange={handleChange}
                />
                {errors.part_name && (
                  <FieldError>{errors.part_name}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="quantity">Adet*</FieldLabel>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  onChange={handleChange}
                />
                {errors.quantity && <FieldError>{errors.quantity}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="price">Birim Fiyat (₺)*</FieldLabel>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  onChange={handleChange}
                />
                {errors.price && <FieldError>{errors.price}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="link">Ürün Linki*</FieldLabel>
                <Input
                  id="link"
                  name="link"
                  type="url"
                  onChange={handleChange}
                />
                {errors.link && <FieldError>{errors.link}</FieldError>}
              </Field>
             <Field>
                <FieldLabel htmlFor="team">Departman*</FieldLabel>
                <Select name="team" required onValueChange={(value) => handleSelectChange("team", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Departman seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    {/* Departmanları dinamik olarak listele */}
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.team && <FieldError>{errors.team}</FieldError>}
              </Field>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Ekleniyor...
                  </>
                ) : (
                  "Listeye Ekle"
                )}
              </Button>
              {apiError && (
                <p className="text-sm text-red-500 text-center">{apiError}</p>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
