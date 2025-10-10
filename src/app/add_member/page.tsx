"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { departmentlist } from "./departments";
import bg from "@/public/bg.jpg";

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalı." }),
  email: z
    .string()
    .email({ message: "Geçerli bir email girin." })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, { message: "Telefon numarası en az 10 karakter olmalı." })
    .optional()
    .or(z.literal("")),
  student_number: z
    .string()
    .min(5, { message: "Öğrenci numarası en az 5 karakter olmalı." }),
  department: z.string().min(2, { message: "Bölüm seçmek zorunludur." }),
  team: z.string().min(2, { message: "Lütfen bir takım seçin." }),
});

type FormState = z.infer<typeof formSchema>;

function AddMemberPage() {
  // State variables and hooks
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    student_number: "",
    department: "",
    team: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // Event handlers for form inputs and submission
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  /*
   * BUTONA BASILDIĞINDA ÇALIŞAN FONKSİYON
   * Butonu birden fazla kez tıklanmasını engellemek için isLoading kontrolü yapar.
   * Form verilerini doğrular ve hataları state'e kaydeder.
   * Doğrulama başarılıysa, verileri API'ye gönderir.
   * Başarılı yanıt alındığında kullanıcıyı ana sayfaya yönlendirir.
   * Hata durumunda kullanıcıya bir uyarı gösterir. 
   TODO: Hata yönetimini iyileştir
   TODO: ALERT'i daha kullanıcı dostu bir modal ile değiştir
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrors({});

    const parsedData = formSchema.safeParse(formState);

    if (!parsedData.success) {
      const fieldErrors = parsedData.error.flatten().fieldErrors;
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

    try {
      const response = await fetch("/api/add_member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData.data),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      router.push("/?welcome=true");
    } catch (error) {
      console.error("Error:", error);
      toast.custom(
        (t: any) => (
          <div
            className={cn(
              "bg-red-600 text-white px-4 py-3  shadow-md flex items-center, rounded-md",
              t.visible ? "animate-enter" : "animate-leave"
            )}
          >
            Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar
            deneyin.
          </div>
        ),
        { duration: 5000, id: "error-toast", position: "top-center" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-24 px-4">
      {/* Background Image with Overlay */}
      <Image
        src={bg}
        alt="Pehlivan Team Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
        priority
      />
      <div className="absolute inset-0 z-5 bg-black/60" />

      {/* Form Card */}
      <Card className="relative z-6 w-full max-w-2xl bg-slate-900/80 backdrop-blur-sm border-slate-700 text-white shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Topluluğumuza Katılın
          </CardTitle>
          <CardDescription className="text-gray-300 pt-2">
            Aşağıdaki formu doldurarak Pehlivan Team ailesinin bir parçası olmak
            için ilk adımı atın. Başvurunuzu heyecanla bekliyoruz!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">İsim Soyisim*</FieldLabel>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <FieldError className="text-red-500">
                    {errors.name}
                  </FieldError>
                )}
              </Field>
              {/* ... Other fields remain the same */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <FieldError className="text-red-500">
                    {errors.email}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Telefon Numarası</FieldLabel>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <FieldError className="text-red-500">
                    {errors.phone}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="student_number">
                  Öğrenci Numarası*
                </FieldLabel>
                <Input
                  type="text"
                  id="student_number"
                  name="student_number"
                  required
                  value={formState.student_number}
                  onChange={handleChange}
                />
                {errors.student_number && (
                  <FieldError className="text-red-500">
                    {errors.student_number}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Bölüm*</FieldLabel>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "cursor-pointer text-white p-2 rounded border border-input text-left w-full h-9 bg-transparent",
                        isPopoverOpen && "bg-gray-700"
                      )}
                    >
                      {formState.department ? (
                        formState.department
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Bölüm seç
                          </span>
                          <CaretSortIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-w-none bg-gray-900">
                    <Command>
                      <CommandInput
                        placeholder="Bölüm ara..."
                        className="text-gray-100 bg-gray-800 mb-3"
                      />
                      <CommandList className="max-h-96 overflow-y-auto text-white scrollbar-hide">
                        <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                        {Object.entries(departmentlist).map(
                          ([faculty, depts]) => (
                            <CommandGroup
                              key={faculty}
                              heading={faculty}
                              className="text-sm"
                            >
                              {depts.map((dept) => (
                                <CommandItem
                                  key={dept.key}
                                  value={dept.dept}
                                  onSelect={() => {
                                    handleSelectChange("department", dept.dept);
                                    setIsPopoverOpen(false);
                                  }}
                                >
                                  {dept.dept}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.department && (
                  <FieldError className="text-red-500">
                    {errors.department}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="team">
                  Hangi Takıma Katılmak İstiyorsunuz?*
                </FieldLabel>
                <Select
                  name="team"
                  required
                  onValueChange={(value) => handleSelectChange("team", value)}
                  value={formState.team}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Takım seçin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-gray-700 text-white scrollbar-hide">
                    <SelectItem value="Pehli1">
                      Pehlivan Team / Elektrikli Araç
                    </SelectItem>
                    <SelectItem value="Roket">Pehlivan Team / Roket</SelectItem>
                    <SelectItem value="Linux">
                      Pehlivan Team / Linux Geliştirme
                    </SelectItem>
                    <SelectItem value="Börü">Börü / Otonom Araç</SelectItem>
                    <SelectItem value="PR">PR / İçerik Üretimi</SelectItem>
                  </SelectContent>
                </Select>
                {errors.team && (
                  <FieldError className="text-red-500">
                    {errors.team}
                  </FieldError>
                )}
              </Field>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "Başvuruyu Gönder"
                )}
              </button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddMemberPage;
