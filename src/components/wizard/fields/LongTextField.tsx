'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'
import type { WorkflowField } from '@/types/wizard'

interface LongTextFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function LongTextField({ field, value, onChange, error }: LongTextFieldProps) {
  const text = (value as string) || ''
  const minLength = field.min_length || 0
  const meetsMin = text.length >= minLength

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={field.key}
        value={text}
        onChange={(e) => onChange(field.key, e.target.value)}
        rows={4}
        aria-invalid={!!error}
      />
      <div className="flex items-center justify-between">
        {field.helper && (
          <p className="text-muted-foreground text-xs">{field.helper}</p>
        )}
        {minLength > 0 && (
          <div className="flex items-center gap-1 text-xs ml-auto">
            <span className={meetsMin ? 'text-green-600' : 'text-muted-foreground'}>
              {text.length}/{minLength}
            </span>
            {meetsMin && <CheckCircle2 className="size-3.5 text-green-600" />}
          </div>
        )}
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
