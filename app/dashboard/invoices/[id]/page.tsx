"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Download, CheckCircle, Send, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { store } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils/calculations"
import { useCurrency } from "@/lib/currency-context"
import type { Invoice } from "@/lib/types"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useCurrency()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const hasTriggeredDownload = useRef(false)

  const shouldDownload = searchParams.get("download") === "true"

  useEffect(() => {
    const id = params.id as string
    const inv = store.getInvoice(id)
    if (inv) {
      setInvoice(inv)
    } else {
      router.push("/dashboard/invoices")
    }
  }, [params.id, router])

  useEffect(() => {
    if (shouldDownload && invoice && !hasTriggeredDownload.current) {
      hasTriggeredDownload.current = true
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [shouldDownload, invoice])

  const handleStatusChange = (newStatus: "sent" | "paid") => {
    if (invoice) {
      store.updateInvoice(invoice.id, { status: newStatus })
      setInvoice({ ...invoice, status: newStatus })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!invoice) {
    return (
      <DashboardLayout title="Invoice">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Invoice ${invoice.invoiceNumber}`}>
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <Link href="/dashboard/invoices" className="flex items-center gap-2 text-gray-600 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
          <div className="flex flex-wrap gap-2">
            {invoice.status === "draft" && (
              <Button variant="outline" onClick={() => handleStatusChange("sent")}>
                <Send className="h-4 w-4 mr-2" />
                Mark as Sent
              </Button>
            )}
            {invoice.status === "sent" && (
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                onClick={() => handleStatusChange("paid")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            )}
            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePrint}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div ref={printRef}>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-navy-900 rounded flex items-center justify-center">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">InvoiceFlow</h2>
                    <p className="text-sm text-gray-500">Professional Invoicing</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold text-navy-900">INVOICE</h1>
                  <p className="text-lg font-medium text-gray-700 mt-1">{invoice.invoiceNumber}</p>
                  <div className="mt-2 no-print">
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              </div>

              {/* Dates and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                  <p className="font-semibold text-navy-900">{invoice.client?.company}</p>
                  <p className="text-gray-600">{invoice.client?.name}</p>
                  <p className="text-gray-600">{invoice.client?.email}</p>
                  <p className="text-gray-600 text-sm mt-1">{invoice.client?.address}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Issue Date</span>
                      <p className="text-navy-900">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Due Date</span>
                      <p className="text-navy-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Description</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Qty</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 px-4 text-gray-800">{item.description}</td>
                        <td className="py-4 px-4 text-right text-gray-600">{item.quantity}</td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {formatCurrency(item.unitPrice, currency)}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-navy-900">
                          {formatCurrency(item.quantity * item.unitPrice, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(invoice.subtotal, currency)}</span>
                  </div>
                  {invoice.discountRate > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount ({invoice.discountRate}%)</span>
                      <span className="text-green-600">-{formatCurrency(invoice.discountAmount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span>{formatCurrency(invoice.taxAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-navy-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatCurrency(invoice.total, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h3>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p className="mt-1">
                  Payment is due within{" "}
                  {Math.ceil(
                    (new Date(invoice.dueDate).getTime() - new Date(invoice.issueDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
