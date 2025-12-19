"use client"

import { InvoiceForm } from "@/components/invoices/invoice-form"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function NewInvoicePage() {
  return (
    <DashboardLayout title="Create Invoice">
      <InvoiceForm />
    </DashboardLayout>
  )
}
