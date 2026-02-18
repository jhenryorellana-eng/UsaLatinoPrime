'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { WorkflowField } from '@/types/wizard'

interface MultiSelectFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function MultiSelectField({ field, value, onChange, error }: MultiSelectFieldProps) {
  const selected: string[] = Array.isArray(value) ? value : []

  function handleToggle(option: string, checked: boolean) {
    const next = checked
      ? [...selected, option]
      : selected.filter((v) => v !== option)
    onChange(field.key, next)
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.min_selections && (
        <p className="text-muted-foreground text-xs">
          Selecciona al menos {field.min_selections}
        </p>
      )}
      <div className="space-y-2">
        {(field.options || []).map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={(checked) =>
                handleToggle(option, checked === true)
              }
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
