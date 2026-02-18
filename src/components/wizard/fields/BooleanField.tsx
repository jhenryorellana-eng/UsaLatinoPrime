'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { WorkflowField } from '@/types/wizard'

interface BooleanFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function BooleanField({ field, value, onChange, error }: BooleanFieldProps) {
  const strValue =
    value === true ? 'true' : value === false ? 'false' : ''

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <RadioGroup
        value={strValue}
        onValueChange={(val) => onChange(field.key, val === 'true')}
        className="flex gap-4"
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <RadioGroupItem value="true" />
          <span className="text-sm">Si</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <RadioGroupItem value="false" />
          <span className="text-sm">No</span>
        </label>
      </RadioGroup>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
