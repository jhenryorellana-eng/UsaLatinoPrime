'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkflowField } from '@/types/wizard'

interface TextArrayFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function TextArrayField({ field, value, onChange, error }: TextArrayFieldProps) {
  const items: string[] = Array.isArray(value) ? value : []

  function handleItemChange(index: number, text: string) {
    const next = [...items]
    next[index] = text
    onChange(field.key, next)
  }

  function handleAdd() {
    onChange(field.key, [...items, ''])
  }

  function handleRemove(index: number) {
    onChange(field.key, items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => handleRemove(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-1"
      >
        <Plus className="mr-1 size-4" />
        Agregar
      </Button>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
