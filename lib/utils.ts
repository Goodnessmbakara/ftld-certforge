import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCertificateId(): string {
  return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateVerificationCode(): string {
  const part1 = Math.random().toString(36).substr(2, 4).toUpperCase()
  const part2 = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `FTLD-${part1}-${part2}`
}
