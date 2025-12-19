"use client"

import { store } from "@/lib/store"
import { User, Menu } from "lucide-react"

interface TopbarProps {
  title: string
  onMenuClick?: () => void
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const user = store.getUser()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-navy-900 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-navy-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">{user?.username}</span>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-navy-100 flex items-center justify-center">
          <User className="w-4 h-4 md:w-5 md:h-5 text-navy-600" />
        </div>
      </div>
    </header>
  )
}
