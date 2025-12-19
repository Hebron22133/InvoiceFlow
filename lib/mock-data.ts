import type { Client, Invoice } from "./types"

export const mockClients: Client[] = []

export const mockInvoices: Invoice[] = []

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 900) + 100
  return `INV-${year}-${randomNum}`
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
