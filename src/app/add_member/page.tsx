"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import z, { set } from "zod";
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
import { ArrowDown, ArrowUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { departmentlist } from "./departments";
import { Separator } from "@radix-ui/react-separator";
import { CaretSortIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalı." }),
  email: z.string().email({ message: "Geçerli bir email girin." }).optional(),
  phone: z
    .string()
    .min(10, { message: "Telefon numarası en az 10 karakter olmalı." })
    .optional(),
  student_number: z
    .string()
    .min(5, { message: "Öğrenci numarası en az 5 karakter olmalı." }),
  department: z
    .string()
    .min(2, { message: "Bölüm en az 2 karakter olmalı." })
    .optional(),
  team: z.string().min(2, { message: "Lütfen bir takım seçin." }),
});

function page() {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formState, setFormState] = React.useState({
    values: {
      name: "",
      email: "",
      phone: "",
      student_number: "",
      department: "",
      team: "",
    },
    errors: {
      name: "",
      email: "",
      phone: "",
      student_number: "",
      department: "",
      team: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const result = formState.values;
    const parsedData = formSchema.safeParse(result);
    console.log(parsedData);
    if (!parsedData.success) {
      console.error(parsedData.error);
      alert("Lütfen formu doğru şekilde doldurun.");
      const errors = parsedData.error.message || "";
      const fieldErrors = parsedData.error.message;
      console.log(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Form verilerini işleme (örneğin, bir API'ye gönderme)
    fetch("/api/add_member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData.data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);

        setFormState({
          values: {
            name: "",
            email: "",
            phone: "",
            student_number: "",
            department: "",
            team: "",
          },
          errors: {
            name: "",
            email: "",
            phone: "",
            student_number: "",
            department: "",
            team: "",
          },
        });
        setIsLoading(false);
        router.push("/?welcome=true");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Form gönderilirken bir hata oluştu.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isLoading) {
      // sayfa en üste çık
      window.scrollTo(0, 0);
    }
    console.log(formState);
  }, [formState, isLoading]);

  return (
    <div className="sm:pt-0 lg:pt-20 min-h-screen flex flex-col gap-2p-4 justify-center items-center bg-gray-800 text-white pt-20">
      <div className="text-lg font-bold">
        TASARIM PROJE TOPLULUĞU 2025-2026 DÖNEMİ ÜYE KAYDI
      </div>
      <div className="max-w-3xl text-sm sm:text-base text-gray-200">
        2013'ten bugüne faaliyetlerini sürdüren tasarım ve proje topluluğu Güneş
        Arabası, Yüksek Verimli elektrikli araçlar, Kompozit sistemler,
        Elektronik sistemler gibi konularda kendini bugüne kadar kanıtladı.
        Şimdi de çeşitli ekipler ile başarılarını sürdürmek için yola devam
        ediyor. Anketi doldur ve aramıza katıl.
      </div>
      <div className="mt-10 mb-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[50vw]">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">İsim Soyisim*</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                required
                value={formState.values.name}
                onChange={handleChange}
              />
              <FieldError className="text-red-500">
                {formState.errors.name}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                name="email"
                value={formState.values.email}
                onChange={handleChange}
              />
              <FieldError className="text-red-500">
                {formState.errors.email}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Telefon Numarası</FieldLabel>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formState.values.phone}
                onChange={handleChange}
              />
              <FieldError className="text-red-500">
                {formState.errors.phone}
              </FieldError>
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
                value={formState.values.student_number}
                onChange={handleChange}
              />
              <FieldError className="text-red-500">
                {formState.errors.student_number}
              </FieldError>
            </Field>
            <Field>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      " cursor-pointer text-white p-2 rounded border border-gray-300",
                      isPopoverOpen && "bg-gray-700"
                    )}
                  >
                    {formState.values.department ? (
                      `${formState.values.department}`
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-100">Bölüm seç*</span>
                        <CaretSortIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-w-none bg-gray-900 ">
                  <Command>
                    <CommandInput
                      placeholder="Bölüm ara..."
                      content={formState.values.department}
                      className="text-gray-100 bg-gray-800 "
                    />
                    <CommandList className="max-h-96 overflow-y-auto text-white scrollbar-hide">
                      <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                      {Object.keys(departmentlist).map((faculty) => (
                        <React.Fragment key={faculty}>
                          <Separator
                            key={faculty}
                            className="h-1 bg-gray-100"
                          />
                          <CommandGroup
                            key={faculty}
                            heading={faculty}
                            className="text-sm"
                          >
                            {departmentlist[faculty].map((dept, index) => (
                              <CommandItem
                                content={dept.key}
                                key={dept.key}
                                value={dept.dept}
                                onSelect={() => {
                                  setFormState((prev) => ({
                                    ...prev,
                                    values: {
                                      ...prev.values,
                                      department: dept.dept,
                                    },
                                  }));
                                  setIsPopoverOpen(false);
                                }}
                              >
                                {dept.dept}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </React.Fragment>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="team">
                Hangi Takıma Katılmak İstiyorsunuz?
              </FieldLabel>
              <Select
                name="team"
                required
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, team: value },
                  }))
                }
                value={formState.values.team}
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

              <FieldError className="text-red-500">
                {formState.errors.team}
              </FieldError>

              <FieldError className="text-red-500">
                {formState.errors.department}
              </FieldError>
            </Field>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Yükleniyor..." : "Gönder"}
            </button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

export default page;
