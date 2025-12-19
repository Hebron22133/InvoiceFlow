"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { store } from "@/lib/store"
import { generateId, generateInvoiceNumber } from "@/lib/mock-data"
import {
  calculateSubtotal,
  calculateTax,
  calculateDiscount,
  calculateTotal,
  formatCurrency,
  formatDateInput,
} from "@/lib/utils/calculations"
import { useCurrency } from "@/lib/currency-context"
import type { Client, Invoice, LineItem, InvoiceStatus } from "@/lib/types"

interface InvoiceFormProps {
  invoice?: Invoice
  isEditing?: boolean
}

interface FormErrors {
  clientId?: string
  lineItems?: string
  issueDate?: string
  dueDate?: string
}

export function InvoiceForm({ invoice, isEditing }: InvoiceFormProps) {
  const router = useRouter()
  const { currency } = useCurrency()
  const [clients, setClients] = useState<Client[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    clientId: invoice?.clientId || "",
    invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(),
    issueDate: formatDateInput(invoice?.issueDate || new Date()),
    dueDate: formatDateInput(invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    status: invoice?.status || ("draft" as InvoiceStatus),
    taxRate: invoice?.taxRate || 8.5,
    discountRate: invoice?.discountRate || 0,
    notes: invoice?.notes || "",
  })

  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.lineItems || [{ id: generateId("li"), description: "", quantity: 1, unitPrice: 0 }],
  )

  useEffect(() => {
    setClients(store.getClients())
  }, [])

  const subtotal = calculateSubtotal(lineItems)
  const taxAmount = calculateTax(subtotal, formData.taxRate)
  const discountAmount = calculateDiscount(subtotal, formData.discountRate)
  const total = calculateTotal(subtotal, taxAmount, discountAmount)

  const addLineItem = () => {
    setLineItems([...lineItems, { id: generateId("li"), description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.clientId) {
      newErrors.clientId = "Please select a client"
    }

    if (lineItems.some((item) => !item.description.trim())) {
      newErrors.lineItems = "All line items must have a description"
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    const invoiceData: Invoice = {
      id: invoice?.id || generateId("inv"),
      invoiceNumber: formData.invoiceNumber,
      clientId: formData.clientId,
      lineItems,
      subtotal,
      taxRate: formData.taxRate,
      taxAmount,
      discountRate: formData.discountRate,
      discountAmount,
      total,
      status: formData.status,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      notes: formData.notes,
      createdAt: invoice?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (isEditing && invoice) {
      store.updateInvoice(invoice.id, invoiceData)
    } else {
      store.addInvoice(invoiceData)
    }

    router.push("/dashboard/invoices")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/invoices" className="flex items-center gap-2 text-gray-600 hover:text-navy-900 text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Invoices</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="invoiceNumber" className="text-sm">
                    Invoice Number
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-sm">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: InvoiceStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client" className="text-sm">
                  Client
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger className={errors.clientId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company} - {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-red-600">{errors.clientId}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="issueDate" className="text-sm">
                    Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className={errors.issueDate ? "border-red-500" : ""}
                  />
                  {errors.issueDate && <p className="text-xs text-red-600">{errors.issueDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dueDate" className="text-sm">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={errors.dueDate ? "border-red-500" : ""}
                  />
                  {errors.dueDate && <p className="text-xs text-red-600">{errors.dueDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Line Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </CardHeader>
            <CardContent>
              {errors.lineItems && <p className="text-sm text-red-600 mb-4">{errors.lineItems}</p>}
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
                    {/* Desktop grid layout */}
                    <div className="hidden md:grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-5">
                        {index === 0 && <Label className="text-xs text-gray-500 mb-1 block">Description</Label>}
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2">
                        {index === 0 && <Label className="text-xs text-gray-500 mb-1 block">Qty</Label>}
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        {index === 0 && <Label className="text-xs text-gray-500 mb-1 block">Unit Price</Label>}
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        {index === 0 && <Label className="text-xs text-gray-500 mb-1 block">Amount</Label>}
                        <div className="h-9 flex items-center text-sm font-medium text-navy-900">
                          {formatCurrency(item.quantity * item.unitPrice, currency)}
                        </div>
                      </div>
                      <div className="col-span-1 flex items-end">
                        {index === 0 && <div className="h-5 mb-1" />}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="md:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Qty</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Unit Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Amount</span>
                        <span className="font-semibold text-navy-900">
                          {formatCurrency(item.quantity * item.unitPrice, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes or payment instructions..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-4 md:space-y-6">
          <Card className="xl:sticky xl:top-6">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-base md:text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="discountRate" className="text-sm text-gray-600 whitespace-nowrap">
                    Discount (%)
                  </Label>
                  <Input
                    id="discountRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.discountRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountRate: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 md:w-20 h-8 text-sm"
                  />
                  <span className="text-sm text-green-600 ml-auto">-{formatCurrency(discountAmount, currency)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="taxRate" className="text-sm text-gray-600 whitespace-nowrap">
                    Tax (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.25"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        taxRate: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-16 md:w-20 h-8 text-sm"
                  />
                  <span className="text-sm ml-auto">{formatCurrency(taxAmount, currency)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-navy-900">
                  <span>Total</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Update Invoice" : "Create Invoice"}
                </Button>
                <Link href="/dashboard/invoices">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
