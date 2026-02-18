'use client'

import type { IntakeStatus } from '@/types/database'
import { Check, Clock, FileText, AlertCircle, Send, Award } from 'lucide-react'

const progressSteps = [
  { key: 'in_progress', label: 'Llenando', icon: Clock },
  { key: 'submitted', label: 'Enviado', icon: Send },
  { key: 'under_review', label: 'En Revision', icon: FileText },
  { key: 'approved_by_henry', label: 'Aprobado', icon: Award },
  { key: 'filed', label: 'Presentado', icon: Check },
] as const

function getStepIndex(status: IntakeStatus): number {
  if (status === 'needs_correction') return 2 // Shows at "En Revision" level
  if (status === 'payment_pending') return -1
  if (status === 'cancelled') return -1
  const idx = progressSteps.findIndex((s) => s.key === status)
  return idx
}

interface CaseProgressBarProps {
  status: IntakeStatus
}

export function CaseProgressBar({ status }: CaseProgressBarProps) {
  const currentIndex = getStepIndex(status)
  const needsCorrection = status === 'needs_correction'

  if (currentIndex < 0) return null

  return (
    <div>
      {/* Desktop horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {progressSteps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isCurrent = i === currentIndex
          const Icon = step.icon

          return (
            <div key={step.key} className="flex-1 flex items-center">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent && needsCorrection
                      ? 'bg-red-100 border-red-500 text-red-600'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent && needsCorrection ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted
                      ? 'text-green-600'
                      : isCurrent && needsCorrection
                      ? 'text-red-600'
                      : isCurrent
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {isCurrent && needsCorrection ? 'Correcciones' : step.label}
                </span>
              </div>
              {i < progressSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    i < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile vertical */}
      <div className="sm:hidden space-y-3">
        {progressSteps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isCurrent = i === currentIndex
          const Icon = step.icon

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent && needsCorrection
                    ? 'bg-red-100 border-red-500 text-red-600'
                    : isCurrent
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-sm ${
                  isCompleted
                    ? 'text-green-600'
                    : isCurrent
                    ? needsCorrection
                      ? 'text-red-600 font-semibold'
                      : 'text-blue-600 font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {isCurrent && needsCorrection ? 'Correcciones Solicitadas' : step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
