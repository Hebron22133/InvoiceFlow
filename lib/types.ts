export type InvoiceStatus = "draft" | "sent" | "paid"

export interface Client {
  id: string
  name: string
  email: string
  company: string
  address: string
  phone?: string
  createdAt: Date
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  client?: Client
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  username: string
  isAuthenticated: boolean
}
