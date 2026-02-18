export type FieldType =
  | 'text'
  | 'long_text'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'boolean'
  | 'phone'
  | 'email'
  | 'country_select'
  | 'us_state_select'
  | 'currency'
  | 'number'
  | 'text_array'
  | 'month_year'
  | 'month_year_or_present'
  | 'address_group'
  | 'repeatable_group'
  | 'spouse_form'

export interface WorkflowField {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  helper?: string
  conditional?: string
  min_length?: number
  min_selections?: number
  subfields?: WorkflowField[]
  multiple?: boolean
}

export interface WorkflowStep {
  step: number
  title: string
  description?: string
  fields?: WorkflowField[]
  type?: 'form' | 'documents' | 'review'
}

export interface RequiredDocument {
  key: string
  label: string
  required: boolean
  category?: string
  helper?: string
  multiple?: boolean
}

export interface EligibilityQuestion {
  id: string
  question: string
  type: 'boolean' | 'select' | 'multi_select'
  options?: string[]
  required_answer?: boolean | string
  min_selections?: number
  fail_message: string
}

export interface ServiceWorkflow {
  slug: string
  name: string
  steps: WorkflowStep[]
  required_documents: RequiredDocument[]
  eligibility_questions?: EligibilityQuestion[]
}
