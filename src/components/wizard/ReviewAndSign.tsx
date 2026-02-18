'use client'

import { useState } from 'react'
import type { WorkflowStep, WorkflowField } from '@/types/wizard'
import { evaluateCondition } from '@/lib/wizard/conditions'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ReviewAndSignProps {
  steps: WorkflowStep[]
  formData: Record<string, unknown>
  onSignatureChange: (signed: boolean) => void
  signed: boolean
}

export function ReviewAndSign({ steps, formData, onSignatureChange, signed }: ReviewAndSignProps) {
  const formSteps = steps.filter((s) => s.fields && s.fields.length > 0)

  function formatLeafValue(v: unknown): string {
    if (v === undefined || v === null || v === '') return '—'
    if (typeof v === 'boolean') return v ? 'Sí' : 'No'
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)) {
      try {
        const d = new Date(v)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('es-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
      } catch { /* fall through */ }
    }
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      const obj = v as Record<string, unknown>
      if ('year' in obj && 'month' in obj && Object.keys(obj).length === 2) {
        return `${String(obj.month).padStart(2, '0')}/${obj.year}`
      }
      return Object.entries(obj).map(([k, val]) => `${k}: ${formatLeafValue(val)}`).join(', ')
    }
    return String(v)
  }

  function renderValue(field: WorkflowField, value: unknown): string {
    if (value === undefined || value === null || value === '') return '—'
    if (typeof value === 'boolean') return value ? 'Sí' : 'No'
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
      try {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('es-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
      } catch { /* fall through */ }
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '—'
      if (typeof value[0] === 'object') {
        return value.map((entry, i) =>
          `[${i + 1}] ` + Object.entries(entry).map(([k, v]) => `${k}: ${formatLeafValue(v)}`).join(', ')
        ).join(' | ')
      }
      return value.join(', ')
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>
      if ('year' in obj && 'month' in obj && Object.keys(obj).length === 2) {
        return `${String(obj.month).padStart(2, '0')}/${obj.year}`
      }
      return Object.entries(obj).map(([k, v]) => `${k}: ${formatLeafValue(v)}`).join(', ')
    }
    return String(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Revisión y Firma</h2>
        <p className="mt-1 text-sm text-gray-600">
          Revise toda la información que ha proporcionado. Si necesita hacer cambios, regrese al paso correspondiente.
        </p>
      </div>

      {formSteps.map((step) => (
        <Card key={step.step}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Paso {step.step}: {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {step.fields!.map((field) => {
                if (!evaluateCondition(field.conditional, formData)) return null
                const value = formData[field.key]
                if (value === undefined || value === null || value === '') return null

                return (
                  <div key={field.key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-sm">
                    <span className="text-gray-500">{field.label}</span>
                    <span className="sm:col-span-2 font-medium">
                      {renderValue(field, value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="signature"
              checked={signed}
              onCheckedChange={(checked) => onSignatureChange(checked === true)}
            />
            <Label htmlFor="signature" className="text-sm leading-relaxed cursor-pointer">
              Declaro bajo pena de perjurio que toda la información proporcionada en este formulario
              es verdadera y correcta según mi mejor conocimiento y entendimiento. Entiendo que
              proporcionar información falsa puede tener consecuencias legales y afectar mi caso
              de inmigración.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
