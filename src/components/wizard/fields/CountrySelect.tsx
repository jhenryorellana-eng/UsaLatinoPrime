'use client'

import * as React from 'react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { countries } from '@/lib/data/countries'
import type { WorkflowField } from '@/types/wizard'

interface CountrySelectProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function CountrySelect({ field, value, onChange, error }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filtered = React.useMemo(() => {
    if (!search) return countries
    const lower = search.toLowerCase()
    return countries.filter((c) => c.label.toLowerCase().includes(lower))
  }, [search])

  const selectedLabel = React.useMemo(() => {
    if (!value) return null
    return countries.find((c) => c.value === value)?.label
  }, [value])

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            {selectedLabel || 'Seleccionar pais...'}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="p-2">
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="h-60">
            <div className="p-1">
              {filtered.length === 0 && (
                <p className="text-muted-foreground p-2 text-center text-sm">
                  Sin resultados
                </p>
              )}
              {filtered.map((country) => (
                <button
                  key={country.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent',
                    value === country.value && 'bg-accent'
                  )}
                  onClick={() => {
                    onChange(field.key, country.value)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <Check
                    className={cn(
                      'size-4 shrink-0',
                      value === country.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {country.label}
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
