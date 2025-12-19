"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Currency = "USD" | "NGN"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD")

  useEffect(() => {
    // Load saved currency preference from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("invoiceflow_currency")
      if (saved === "USD" || saved === "NGN") {
        setCurrencyState(saved)
      }
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    if (typeof window !== "undefined") {
      localStorage.setItem("invoiceflow_currency", newCurrency)
    }
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
