"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Eye, Pencil, Trash2, Filter, Download } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { store } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils/calculations"
import { useCurrency } from "@/lib/currency-context"
import type { Invoice, InvoiceStatus } from "@/lib/types"

const statusFilters: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
]

export default function InvoicesPage() {
  const { currency } = useCurrency()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    setInvoices(store.getInvoices())
  }

  const filteredInvoices = filter === "all" ? invoices : invoices.filter((inv) => inv.status === filter)

  const handleDelete = () => {
    if (deleteId) {
      store.deleteInvoice(deleteId)
      loadInvoices()
      setDeleteId(null)
    }
  }

  return (
    <DashboardLayout title="Invoices">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex gap-1 overflow-x-auto pb-1">
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded transition-colors whitespace-nowrap ${
                      filter === f.value ? "bg-navy-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Link href="/dashboard/invoices/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm" size="sm">
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">New Invoice</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Invoices Table/Cards */}
        <Card>
          <CardHeader className="py-3 md:py-4">
            <CardTitle className="text-base md:text-lg">
              {filter === "all" ? "All Invoices" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Invoices`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Issue Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-navy-900">{invoice.invoiceNumber}</td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{invoice.client?.company || "Unknown"}</div>
                            <div className="text-sm text-gray-500">{invoice.client?.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{formatDate(invoice.issueDate)}</td>
                        <td className="py-4 px-4 text-gray-600">{formatDate(invoice.dueDate)}</td>
                        <td className="py-4 px-4 font-semibold text-navy-900">
                          {formatCurrency(invoice.total, currency)}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-1">
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Invoice">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </Link>
                            <Link href={`/dashboard/invoices/${invoice.id}?download=true`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </Link>
                            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Invoice">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteId(invoice.id)}
                              title="Delete Invoice"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-gray-100">
              {filteredInvoices.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No invoices found</div>
              ) : (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="font-semibold text-navy-900 hover:text-orange-600"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                        <p className="text-sm text-gray-600">{invoice.client?.company || "Unknown"}</p>
                      </div>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-navy-900">{formatCurrency(invoice.total, currency)}</span>
                      <span className="text-xs text-gray-500">Due: {formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/invoices/${invoice.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs bg-transparent"
                        onClick={() => setDeleteId(invoice.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  )
}
