"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { useRouter } from "next/navigation";
import z, { set } from "zod";

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
});

function page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formState, setFormState] = React.useState({
    values: {
      name: "",
      email: "",
      phone: "",
      student_number: "",
      department: "",
    },
    errors: {
      name: "",
      email: "",
      phone: "",
      student_number: "",
      department: "",
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const parsedData = formSchema.safeParse(data);
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
          },
          errors: {
            name: "",
            email: "",
            phone: "",
            student_number: "",
            department: "",
          },
        });
        return router.push("https://pehli1team.com?welcome=true", {
          scroll: false,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Form gönderilirken bir hata oluştu.");
        setIsLoading(false);
      });
  };

  return (
    <div className="pt-20">
      <div>TASARIM PROJE TOPLULUĞU 2025-2026 DÖNEMİ ÜYE KAYDI</div>
      <div>
        Aşağıdaki formu doldurarak topluluğumuza üye olabilirsiniz. Formu
        doldurduktan sonra en kısa sürede sizinle iletişime geçilecektir.
      </div>
      <div className="max-w-md mx-auto mt-8 p-5">
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
              <FieldLabel htmlFor="department">Bölüm</FieldLabel>
              <Input
                type="text"
                id="department"
                name="department"
                value={formState.values.department}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    values: { ...prev.values, department: e.target.value },
                  }))
                }
              />
              <FieldError className="text-red-500">
                {formState.errors.department}
              </FieldError>
            </Field>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Gönder
            </button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}

export default page;
