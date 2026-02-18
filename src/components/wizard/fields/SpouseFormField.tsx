'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FieldRenderer } from './FieldRenderer'
import type { WorkflowField } from '@/types/wizard'

interface SpouseFormFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function SpouseFormField({ field, value, onChange, error }: SpouseFormFieldProps) {
  const data: Record<string, any> = (value as Record<string, any>) || {}
  const subfields = field.subfields || []

  function handleSubfieldChange(subfieldKey: string, subfieldValue: any) {
    onChange(field.key, { ...data, [subfieldKey]: subfieldValue })
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Card>
        <CardContent className="pt-4 space-y-4">
          {subfields.map((subfield) => (
            <FieldRenderer
              key={subfield.key}
              field={subfield}
              value={data[subfield.key]}
              onChange={handleSubfieldChange}
            />
          ))}
        </CardContent>
      </Card>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
