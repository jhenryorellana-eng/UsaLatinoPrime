'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { WorkflowField } from '@/types/wizard'

interface DateFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function DateField({ field, value, onChange, error }: DateFieldProps) {
  const date = value ? new Date(value as string) : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={field.key}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date
              ? format(date, 'PPP', { locale: es })
              : 'Seleccionar fecha...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) =>
              onChange(field.key, d ? d.toISOString() : '')
            }
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
