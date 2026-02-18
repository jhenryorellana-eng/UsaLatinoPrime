'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FieldRenderer } from './FieldRenderer'
import type { WorkflowField } from '@/types/wizard'

interface RepeatableGroupProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function RepeatableGroup({ field, value, onChange, error }: RepeatableGroupProps) {
  const entries: Record<string, any>[] = Array.isArray(value) ? value : []
  const subfields = field.subfields || []

  function handleEntryChange(
    entryIndex: number,
    subfieldKey: string,
    subfieldValue: any
  ) {
    const next = [...entries]
    next[entryIndex] = { ...next[entryIndex], [subfieldKey]: subfieldValue }
    onChange(field.key, next)
  }

  function handleAdd() {
    const empty: Record<string, any> = {}
    subfields.forEach((sf) => {
      empty[sf.key] = undefined
    })
    onChange(field.key, [...entries, empty])
  }

  function handleRemove(index: number) {
    onChange(field.key, entries.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {entries.map((entry, entryIndex) => (
        <Card key={entryIndex}>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                #{entryIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(entryIndex)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 size-4" />
                Eliminar
              </Button>
            </div>
            <Separator />
            {subfields.map((subfield) => (
              <FieldRenderer
                key={subfield.key}
                field={subfield}
                value={entry[subfield.key]}
                onChange={(sfKey, sfVal) =>
                  handleEntryChange(entryIndex, sfKey, sfVal)
                }
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
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
