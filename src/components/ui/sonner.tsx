"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Varsayılan bildirimler için
          toast:
            "group toast group-[.toaster]:bg-[var(--sonner-toast-background)] group-[.toaster]:text-[var(--sonner-toast-foreground)] group-[.toaster]:border-[var(--sonner-toast-border)] group-[.toaster]:shadow-lg",

          // Başarı bildirimleri için
          success:
            "group success group-[.toaster]:bg-[var(--sonner-success-background)] group-[.toaster]:text-[var(--sonner-success-foreground)] group-[.toaster]:border-[var(--sonner-success-foreground)]/20",

          // Hata bildirimleri için
          error:
            "group error group-[.toaster]:bg-[var(--sonner-error-background)] group-[.toaster]:text-[var(--sonner-error-foreground)] group-[.toaster]:border-[var(--sonner-error-foreground)]/20",

          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
