'use client'

import type { WorkflowStep, WorkflowField } from '@/types/wizard'
import { FieldRenderer } from './fields/FieldRenderer'
import { evaluateCondition } from '@/lib/wizard/conditions'
import type { ValidationError } from '@/lib/wizard/validation'

interface WizardStepProps {
  step: WorkflowStep
  formData: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  errors: ValidationError[]
}

export function WizardStep({ step, formData, onChange, errors }: WizardStepProps) {
  const getError = (key: string) => errors.find(e => e.key === key)?.message

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        {step.description && (
          <p className="mt-1 text-sm text-gray-600">{step.description}</p>
        )}
      </div>

      {step.fields ? (
        <div className="space-y-5">
          {step.fields.map((field) => {
            if (!evaluateCondition(field.conditional, formData)) return null
            return (
              <FieldRenderer
                key={field.key}
                field={field}
                value={formData[field.key]}
                onChange={onChange}
                error={getError(field.key)}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
