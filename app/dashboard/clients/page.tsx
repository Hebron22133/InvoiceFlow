"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Mail, Building, MapPin } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FormField } from "@/components/ui/form-field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { store } from "@/lib/store"
import { generateId } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils/calculations"
import type { Client } from "@/lib/types"

interface ClientFormData {
  name: string
  email: string
  company: string
  address: string
  phone: string
}

const emptyFormData: ClientFormData = {
  name: "",
  email: "",
  company: "",
  address: "",
  phone: "",
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ClientFormData>(emptyFormData)
  const [errors, setErrors] = useState<Partial<ClientFormData>>({})

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = () => {
    setClients(store.getClients())
  }

  const openAddModal = () => {
    setEditingClient(null)
    setFormData(emptyFormData)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      address: client.address,
      phone: client.phone || "",
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = (): boolean => {
    const newErrors: Partial<ClientFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    if (editingClient) {
      store.updateClient(editingClient.id, {
        ...formData,
        phone: formData.phone || undefined,
      })
    } else {
      store.addClient({
        id: generateId("cl"),
        ...formData,
        phone: formData.phone || undefined,
        createdAt: new Date(),
      })
    }

    setIsModalOpen(false)
    loadClients()
  }

  const handleDelete = () => {
    if (deleteId) {
      store.deleteClient(deleteId)
      loadClients()
      setDeleteId(null)
    }
  }

  return (
    <DashboardLayout title="Clients">
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={openAddModal}>
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Client</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-navy-700 font-semibold">{client.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{client.name}</CardTitle>
                      <p className="text-sm text-gray-500 truncate">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(client)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${client.email}`} className="hover:text-navy-900 truncate">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{client.company}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
                <p className="text-xs text-gray-400 pt-2">Added {formatDate(client.createdAt)}</p>
              </CardContent>
            </Card>
          ))}

          {clients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No clients yet. Add your first client to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Edit Client" : "Add New Client"}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="John Doe"
            required
          />

          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="john@company.com"
            required
          />

          <FormField
            label="Company Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company}
            placeholder="Acme Inc."
            required
          />

          <FormField
            label="Phone (Optional)"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />

          <div className="space-y-1.5">
            <Label htmlFor="address" className={errors.address ? "text-red-600" : ""}>
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
              rows={2}
              className={errors.address ? "border-red-500" : ""}
              required
            />
            {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent order-2 sm:order-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white order-1 sm:order-2">
              {editingClient ? "Update Client" : "Add Client"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? Any associated invoices will keep the client information but the client record will be removed."
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  )
}
