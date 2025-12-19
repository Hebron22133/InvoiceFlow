"use client"

import type { Client, Invoice, User } from "./types"
import { mockClients, mockInvoices } from "./mock-data"

// Simple in-memory store for demo purposes
// Can be replaced with a real backend later

let clients: Client[] = [...mockClients]
let invoices: Invoice[] = [...mockInvoices]
let currentUser: User | null = null

export const store = {
  // Auth
  login: (username: string, password: string): boolean => {
    if (username === "Trueadmin" && password === "bhayana44") {
      currentUser = { username, isAuthenticated: true }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("invoiceflow_auth", JSON.stringify(currentUser))
      }
      return true
    }
    return false
  },

  logout: () => {
    currentUser = null
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("invoiceflow_auth")
    }
  },

  getUser: (): User | null => {
    if (currentUser) return currentUser
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("invoiceflow_auth")
      if (stored) {
        currentUser = JSON.parse(stored)
        return currentUser
      }
    }
    return null
  },

  // Clients
  getClients: (): Client[] => clients,

  getClient: (id: string): Client | undefined => clients.find((c) => c.id === id),

  addClient: (client: Client): void => {
    clients = [...clients, client]
  },

  updateClient: (id: string, updates: Partial<Client>): void => {
    clients = clients.map((c) => (c.id === id ? { ...c, ...updates } : c))
  },

  deleteClient: (id: string): void => {
    clients = clients.filter((c) => c.id !== id)
  },

  // Invoices
  getInvoices: (): Invoice[] => {
    return invoices.map((inv) => ({
      ...inv,
      client: clients.find((c) => c.id === inv.clientId),
    }))
  },

  getInvoice: (id: string): Invoice | undefined => {
    const inv = invoices.find((i) => i.id === id)
    if (inv) {
      return {
        ...inv,
        client: clients.find((c) => c.id === inv.clientId),
      }
    }
    return undefined
  },

  addInvoice: (invoice: Invoice): void => {
    invoices = [...invoices, invoice]
  },

  updateInvoice: (id: string, updates: Partial<Invoice>): void => {
    invoices = invoices.map((i) => (i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i))
  },

  deleteInvoice: (id: string): void => {
    invoices = invoices.filter((i) => i.id !== id)
  },

  // Dashboard stats
  getStats: () => {
    const allInvoices = invoices
    const paidInvoices = allInvoices.filter((i) => i.status === "paid")
    const outstandingInvoices = allInvoices.filter((i) => i.status !== "paid")

    return {
      totalInvoices: allInvoices.length,
      paidInvoices: paidInvoices.length,
      totalRevenue: paidInvoices.reduce((sum, i) => sum + i.total, 0),
      outstandingAmount: outstandingInvoices.reduce((sum, i) => sum + i.total, 0),
      draftCount: allInvoices.filter((i) => i.status === "draft").length,
      sentCount: allInvoices.filter((i) => i.status === "sent").length,
    }
  },
}
