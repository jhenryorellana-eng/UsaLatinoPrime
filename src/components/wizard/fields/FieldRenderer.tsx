'use client'

import type { WorkflowField } from '@/types/wizard'
import { TextField } from './TextField'
import { LongTextField } from './LongTextField'
import { SelectField } from './SelectField'
import { MultiSelectField } from './MultiSelectField'
import { DateField } from './DateField'
import { BooleanField } from './BooleanField'
import { PhoneField } from './PhoneField'
import { CountrySelect } from './CountrySelect'
import { USStateSelect } from './USStateSelect'
import { CurrencyField } from './CurrencyField'
import { TextArrayField } from './TextArrayField'
import { MonthYearField } from './MonthYearField'
import { MonthYearOrPresentField } from './MonthYearOrPresentField'
import { AddressGroupField } from './AddressGroupField'
import { RepeatableGroup } from './RepeatableGroup'
import { SpouseFormField } from './SpouseFormField'

interface FieldRendererProps {
  field: WorkflowField
  value: any
  onChange: (key: string, value: any) => void
  error?: string
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const props = { field, value, onChange, error }

  switch (field.type) {
    case 'text':
      return <TextField {...props} />
    case 'email':
      return <TextField {...props} />
    case 'long_text':
      return <LongTextField {...props} />
    case 'select':
      return <SelectField {...props} />
    case 'multi_select':
      return <MultiSelectField {...props} />
    case 'date':
      return <DateField {...props} />
    case 'boolean':
      return <BooleanField {...props} />
    case 'phone':
      return <PhoneField {...props} />
    case 'country_select':
      return <CountrySelect {...props} />
    case 'us_state_select':
      return <USStateSelect {...props} />
    case 'currency':
      return <CurrencyField {...props} />
    case 'number':
      return <CurrencyField {...props} />
    case 'text_array':
      return <TextArrayField {...props} />
    case 'month_year':
      return <MonthYearField {...props} />
    case 'month_year_or_present':
      return <MonthYearOrPresentField {...props} />
    case 'address_group':
      return <AddressGroupField {...props} />
    case 'repeatable_group':
      return <RepeatableGroup {...props} />
    case 'spouse_form':
      return <SpouseFormField {...props} />
    default:
      return <TextField {...props} />
  }
}
