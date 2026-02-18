'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkflowField } from '@/types/wizard'

interface CurrencyFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function CurrencyField({ field, value, onChange, error }: CurrencyFieldProps) {
  const [display, setDisplay] = React.useState(() => {
    if (value != null && value !== '') {
      return String(Number(value).toFixed(2))
    }
    return ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    setDisplay(raw)
    const num = parseFloat(raw)
    onChange(field.key, isNaN(num) ? '' : num)
  }

  function handleBlur() {
    if (display === '') return
    const num = parseFloat(display)
    if (!isNaN(num)) {
      setDisplay(num.toFixed(2))
      onChange(field.key, num)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
          $
        </span>
        <Input
          id={field.key}
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          className="pl-7"
          aria-invalid={!!error}
        />
      </div>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
