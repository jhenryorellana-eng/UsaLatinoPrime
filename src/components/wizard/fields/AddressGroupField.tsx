'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USStateSelect } from './USStateSelect'
import type { WorkflowField } from '@/types/wizard'

interface AddressGroupFieldProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

interface AddressValue {
  street?: string
  city?: string
  state?: string
  zip?: string
}

export function AddressGroupField({ field, value, onChange, error }: AddressGroupFieldProps) {
  const addr: AddressValue = (value as AddressValue) || {}

  function handlePart(part: keyof AddressValue, val: string) {
    onChange(field.key, { ...addr, [part]: val })
  }

  const stateField: WorkflowField = {
    key: `${field.key}.state`,
    label: 'Estado',
    type: 'us_state_select',
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="space-y-3 rounded-md border p-3">
        <div className="space-y-1">
          <Label htmlFor={`${field.key}-street`} className="text-xs">
            Calle
          </Label>
          <Input
            id={`${field.key}-street`}
            value={addr.street || ''}
            onChange={(e) => handlePart('street', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`${field.key}-city`} className="text-xs">
              Ciudad
            </Label>
            <Input
              id={`${field.key}-city`}
              value={addr.city || ''}
              onChange={(e) => handlePart('city', e.target.value)}
            />
          </div>
          <USStateSelect
            field={stateField}
            value={addr.state || ''}
            onChange={(_key, val) => handlePart('state', val)}
          />
        </div>
        <div className="w-1/2 space-y-1">
          <Label htmlFor={`${field.key}-zip`} className="text-xs">
            Codigo postal
          </Label>
          <Input
            id={`${field.key}-zip`}
            value={addr.zip || ''}
            onChange={(e) => handlePart('zip', e.target.value)}
            maxLength={10}
          />
        </div>
      </div>
      {field.helper && (
        <p className="text-muted-foreground text-xs">{field.helper}</p>
      )}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
