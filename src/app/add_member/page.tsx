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
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const departmentlist: Record<string, { dept: string; key: string }[]> = {
  "Keşan Hakkı Yörük Sağlık Yüksekokulu": [
    {
      dept: "Acil Yardım ve Afet Yönetimi",
      key: "AYAY",
    },
    {
      dept: "Hemşirelik",
      key: "hemsirelik",
    },
  ],
  "Edebiyat Fakültesi": [
    {
      dept: "Almanca Mütercim ve Tercümanlık",
      key: "AMT",
    },
    {
      dept: "Arkeoloji",
      key: "arkeoloji",
    },
    {
      dept: "Arnavut Dili ve Edebiyatı",
      key: "ADE",
    },
    {
      dept: "Boşnak Dili ve Edebiyatı",
      key: "BDE",
    },
    {
      dept: "Bulgarca Mütercim ve Tercümanlık",
      key: "BMT",
    },
    {
      dept: "Çağdaş Yunan Dili ve Edebiyatı",
      key: "CYDE",
    },
    {
      dept: "İngilizce Mütercim ve Tercümanlık",
      key: "IMT",
    },
    {
      dept: "Sanat Tarihi",
      key: "ST",
    },
    {
      dept: "Tarih",
      key: "tarih",
    },
    {
      dept: "Türk Dili ve Edebiyatı",
      key: "TDE",
    },
  ],
  "Eğitim Fakültesi": [
    {
      dept: "Almanca Öğretmenliği",
      key: "AO",
    },
    {
      dept: "Fen Bilgisi Öğretmenliği",
      key: "FBO",
    },
    {
      dept: "İlköğretim Matematik Öğretmenliği",
      key: "IMO",
    },
    {
      dept: "İngilizce Öğretmenliği",
      key: "IO",
    },
    {
      dept: "Okul Öncesi Öğretmenliği",
      key: "OOO",
    },
    {
      dept: "Özel Eğitim Öğretmenliği",
      key: "OEO",
    },
    {
      dept: "Rehberlik ve Psikolojik Danışmanlık",
      key: "RPD",
    },
    {
      dept: "Sınıf Öğretmenliği",
      key: "SO",
    },
    {
      dept: "Sosyal Bilgiler Öğretmenliği",
      key: "SBO",
    },
    {
      dept: "Türkçe Öğretmenliği",
      key: "TO",
    },
  ],
  "Uzunköprü Uygulamalı Bilimler Yüksekokulu": [
    {
      dept: "Bankacılık ve Sigortacılık",
      key: "BS",
    },
    {
      dept: "Muhasebe ve Finans Yönetimi",
      key: "MFY",
    },
  ],
  "Keşan Yusuf Çapraz Uygulamalı Bilimler Yüksekokulu": [
    {
      dept: "Bankacılık ve Sigortacılık",
      key: "BS",
    },
    {
      dept: "Bilişim Sistemleri ve Teknolojileri",
      key: "BST",
    },
    {
      dept: "Gümrük İşletme",
      key: "GI",
    },
    {
      dept: "Halkla İlişkiler ve Reklamcılık",
      key: "HIR",
    },
    {
      dept: "Uluslararası Ticaret ve Finansman",
      key: "UTF",
    },
  ],
  "Sağlık Bilimleri Fakültesi": [
    {
      dept: "Beslenme ve Diyetetik",
      key: "BD",
    },
    {
      dept: "Ergoterapi",
      key: "ergoterapi",
    },
    {
      dept: "Fizyoterapi ve Rehabilitasyon",
      key: "FR",
    },
    {
      dept: "Hemşirelik",
      key: "hemsirelik",
    },
    {
      dept: "Odyoloji",
      key: "odyoloji",
    },
    {
      dept: "Sağlık Yönetimi",
      key: "SY",
    },
  ],
  "Fen Fakültesi": [
    {
      dept: "Bilgi Güvenliği Teknolojisi",
      key: "BGT",
    },
    {
      dept: "Biyoloji",
      key: "biyoloji",
    },
    {
      dept: "Fizik",
      key: "fizik",
    },
    {
      dept: "Kimya",
      key: "kimya",
    },
    {
      dept: "Matematik",
      key: "matematik",
    },
    {
      dept: "Yazılım Geliştirme",
      key: "YG",
    },
  ],
  "Mühendislik Fakültesi": [
    {
      dept: "Bilgisayar Mühendisliği",
      key: "BM",
    },
    {
      dept: "Elektrik-Elektronik Mühendisliği",
      key: "EEM",
    },
    {
      dept: "Genetik ve Biyomühendislik",
      key: "GB",
    },
    {
      dept: "Gıda Mühendisliği",
      key: "GM",
    },
    {
      dept: "Makine Mühendisliği",
      key: "MM",
    },
  ],
  "İktisadi ve İdari Bilimler Fakültesi": [
    {
      dept: "Çalışma Ekonomisi ve Endüstri İlişkileri",
      key: "CEEI",
    },
    {
      dept: "Ekonometri",
      key: "ekonometri",
    },
    {
      dept: "İktisat",
      key: "iktisat",
    },
    {
      dept: "İşletme",
      key: "isletme",
    },
    {
      dept: "Maliye",
      key: "maliye",
    },
    {
      dept: "Siyaset Bilimi ve Kamu Yönetimi",
      key: "SBKY",
    },
    {
      dept: "Uluslararası İlişkiler",
      key: "UI",
    },
  ],
  "Diş Hekimliği Fakültesi": [
    {
      dept: "Diş Hekimliği",
      key: "DH",
    },
  ],
  "Eczacılık Fakültesi": [
    {
      dept: "Eczacılık",
      key: "eczacilik",
    },
  ],
  "Uygulamalı Bilimler Fakültesi": [
    {
      dept: "Finans ve Bankacılık",
      key: "FB",
    },
    {
      dept: "Turizm İşletmeciliği",
      key: "TI",
    },
    {
      dept: "Yönetim Bilişim Sistemleri",
      key: "YBS",
    },
  ],
  "Mimarlık Fakültesi": [
    {
      dept: "İç Mimarlık",
      key: "IM",
    },
    {
      dept: "Mimarlık",
      key: "mimarlik",
    },
    {
      dept: "Peyzaj Mimarlığı",
      key: "PM",
    },
  ],
  "İlahiyat Fakültesi": [
    {
      dept: "İlahiyat",
      key: "ilahiyat",
    },
  ],
  "Güzel Sanatlar Fakültesi": [
    {
      dept: "İletişim ve Tasarımı",
      key: "IT",
    },
  ],
  "Kırkpınar Spor Bilimleri Fakültesi": [
    {
      dept: "Spor Yöneticiliği",
      key: "SY",
    },
  ],
  "Tıp Fakültesi": [
    {
      dept: "Tıp",
      key: "tip",
    },
  ],
};

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
    <div className="sm:pt-0 lg:pt-20 min-h-screen flex flex-col gap-2p-4 justify-center items-center bg-gray-100 pt-20">
      <div className="text-lg font-bold">
        TASARIM PROJE TOPLULUĞU 2025-2026 DÖNEMİ ÜYE KAYDI
      </div>
      <div className="max-w-3xl text-sm sm:text-base text-gray-800">
        2013'ten bugüne faaliyetlerini sürdüren tasarım ve proje topluluğu Güneş
        Arabası, Yüksek Verimli elektrikli araçlar, Kompozit sistemler,
        Elektronik sistemler gibi konularda kendini bugüne kadar kanıtladı.
        Şimdi de çeşitli ekipler ile başarılarını sürdürmek için yola devam
        ediyor. Anketi doldur ve aramıza katıl.
      </div>
      <div className="max-w-md mx-auto sm:mt-0 mt-8 p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">İsim Soyisim*</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                required
                value={formState.values.name}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, name: e.target.value },
                  }))
                }
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
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, email: e.target.value },
                  }))
                }
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
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, phone: e.target.value },
                  }))
                }
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
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, student_number: e.target.value },
                  }))
                }
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
                      "underline cursor-pointer text-black  p-2 rounded border border-gray-300",
                      isPopoverOpen && "bg-white"
                    )}
                  >
                    {formState.values.department ? (
                      `Bölüm seç: ${formState.values.department}`
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Bölüm seç*</span>
                        <ArrowDown />
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-w-none bg-white">
                  <Command className="">
                    <CommandInput
                      placeholder="Bölüm ara..."
                      content={formState.values.department}
                    />
                    <CommandList className="max-h-96 overflow-y-auto">
                      <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                      {Object.keys(departmentlist).map((faculty) => (
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
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="text-xs text-gray-500">
                *Bölümünüzü bilmiyorsanız veya listede yoksa boş
                bırakabilirsiniz.
              </div>
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
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white">
                  <SelectItem value="-">Lütfen bir takım seçin</SelectItem>
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
