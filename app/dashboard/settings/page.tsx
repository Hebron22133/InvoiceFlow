"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"
import { useCurrency, type Currency } from "@/lib/currency-context"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const { currency, setCurrency } = useCurrency()

  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Your Business Name",
    email: "contact@yourbusiness.com",
    phone: "+1 (555) 000-0000",
    address: "123 Business Street\nCity, State 12345",
    taxId: "",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultTaxRate: "8.5",
    defaultDueDays: "30",
    invoicePrefix: "INV",
    defaultNotes: "Thank you for your business!",
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl space-y-4 md:space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">Business Information</CardTitle>
            <CardDescription className="text-sm">This information will appear on your invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Business Name"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Email"
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              />
              <FormField
                label="Phone"
                type="tel"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm">
                Business Address
              </Label>
              <Textarea
                id="address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                rows={3}
              />
            </div>

            <FormField
              label="Tax ID / VAT Number"
              value={businessInfo.taxId}
              onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
              helperText="Optional - will be displayed on invoices if provided"
            />
          </CardContent>
        </Card>

        {/* Invoice Defaults */}
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">Invoice Defaults</CardTitle>
            <CardDescription className="text-sm">Default values for new invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                label="Default Tax Rate (%)"
                type="number"
                min="0"
                max="100"
                step="0.25"
                value={invoiceSettings.defaultTaxRate}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    defaultTaxRate: e.target.value,
                  })
                }
              />
              <FormField
                label="Payment Due (Days)"
                type="number"
                min="1"
                max="365"
                value={invoiceSettings.defaultDueDays}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    defaultDueDays: e.target.value,
                  })
                }
              />
              <FormField
                label="Invoice Prefix"
                value={invoiceSettings.invoicePrefix}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    invoicePrefix: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-sm">
                Currency
              </Label>
              <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                  <SelectItem value="NGN">NGN (₦) - Nigerian Naira</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Currency used for displaying amounts on invoices</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="defaultNotes" className="text-sm">
                Default Invoice Notes
              </Label>
              <Textarea
                id="defaultNotes"
                value={invoiceSettings.defaultNotes}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    defaultNotes: e.target.value,
                  })
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white min-w-32" onClick={handleSave}>
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
