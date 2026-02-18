'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WorkflowField } from '@/types/wizard'

interface MonthYearOrPresentFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function getYearOptions() {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current; y >= current - 30; y--) {
    years.push(y)
  }
  return years
}

export function MonthYearOrPresentField({
  field,
  value,
  onChange,
  error,
}: MonthYearOrPresentFieldProps) {
  const isPresent = value === 'Presente'
  const parsed =
    !isPresent && typeof value === 'object' && value
      ? (value as { month?: string; year?: string })
      : {}
  const years = getYearOptions()

  function handleChange(part: 'month' | 'year', val: string) {
    onChange(field.key, { ...parsed, [part]: val })
  }

  function handlePresentToggle(checked: boolean) {
    if (checked) {
      onChange(field.key, 'Presente')
    } else {
      onChange(field.key, {})
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select
          value={isPresent ? '' : parsed.month || ''}
          onValueChange={(val) => handleChange('month', val)}
          disabled={isPresent}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={String(i + 1).padStart(2, '0')}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={isPresent ? '' : parsed.year || ''}
          onValueChange={(val) => handleChange('year', val)}
          disabled={isPresent}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={isPresent}
          onCheckedChange={(checked) => handlePresentToggle(checked === true)}
        />
        <span className="text-sm">Presente</span>
      </label>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
