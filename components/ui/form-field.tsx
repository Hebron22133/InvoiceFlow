import type React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export function FormField({ label, error, helperText, className, id, ...props }: FormFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={inputId} className={cn("text-sm font-medium", error && "text-red-600")}>
        {label}
      </Label>
      <Input
        id={inputId}
        className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}
