'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WorkflowField } from '@/types/wizard'

interface SelectFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(field.key, val)}
      >
        <SelectTrigger id={field.key} className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {(field.options || []).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
