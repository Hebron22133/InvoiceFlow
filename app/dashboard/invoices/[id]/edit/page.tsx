"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { store } from "@/lib/store"
import type { Invoice } from "@/lib/types"

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    const id = params.id as string
    const inv = store.getInvoice(id)
    if (inv) {
      setInvoice(inv)
    } else {
      router.push("/dashboard/invoices")
    }
  }, [params.id, router])

  if (!invoice) {
    return (
      <DashboardLayout title="Edit Invoice">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Edit ${invoice.invoiceNumber}`}>
      <InvoiceForm invoice={invoice} isEditing />
    </DashboardLayout>
  )
}
