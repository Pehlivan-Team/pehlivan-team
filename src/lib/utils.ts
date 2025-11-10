//Kısa yollar ve stil yardımcı fonksiyonları

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Yardımcı fonksiyon: clsx ve tailwind-merge'i birleştirir
// Shadcn UI otomatik olarak bunu kullanır.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
