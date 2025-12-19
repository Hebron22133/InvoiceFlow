"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, DollarSign, Clock, CheckCircle, ArrowUpRight } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { store } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils/calculations"
import { useCurrency } from "@/lib/currency-context"
import type { Invoice } from "@/lib/types"

export default function DashboardPage() {
  const { currency } = useCurrency()
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
    draftCount: 0,
    sentCount: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    setStats(store.getStats())
    setRecentInvoices(store.getInvoices().slice(0, 5))
  }, [])

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-navy-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-navy-900">{stats.totalInvoices}</div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {stats.draftCount} draft, {stats.sentCount} sent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-navy-900">{stats.paidInvoices}</div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {((stats.paidInvoices / stats.totalInvoices) * 100 || 0).toFixed(0)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg md:text-3xl font-bold text-navy-900 truncate">
                {formatCurrency(stats.totalRevenue, currency)}
              </div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-500">Outstanding</CardTitle>
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-lg md:text-3xl font-bold text-navy-900 truncate">
                {formatCurrency(stats.outstandingAmount, currency)}
              </div>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">Pending payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base md:text-lg">Recent Invoices</CardTitle>
            <Link
              href="/dashboard/invoices"
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="text-navy-900 font-medium hover:text-orange-600"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{invoice.client?.company || "Unknown Client"}</td>
                      <td className="py-4 px-4 font-medium text-navy-900">{formatCurrency(invoice.total, currency)}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(invoice.dueDate)}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-100">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-navy-900">{invoice.invoiceNumber}</span>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{invoice.client?.company || "Unknown"}</span>
                    <span className="font-semibold text-navy-900">{formatCurrency(invoice.total, currency)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Due: {formatDate(invoice.dueDate)}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
