'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkflowField } from '@/types/wizard'

interface PhoneFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function PhoneField({ field, value, onChange, error }: PhoneFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.key}
        type="tel"
        placeholder="(555) 123-4567"
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        aria-invalid={!!error}
      />
      {field.helper ? (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      ) : (
        <p className="text-muted-foreground text-xs">
          Formato: (555) 123-4567
        </p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
