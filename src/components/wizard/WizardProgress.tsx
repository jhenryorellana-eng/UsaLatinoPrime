'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { WorkflowStep } from '@/types/wizard'

interface WizardProgressProps {
  steps: WorkflowStep[]
  currentStep: number
  completedSteps: number[]
  onStepClick: (step: number) => void
}

export function WizardProgress({ steps, currentStep, completedSteps, onStepClick }: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: simple text */}
      <div className="sm:hidden text-center mb-4">
        <p className="text-sm text-gray-500">
          Paso {currentStep + 1} de {steps.length}
        </p>
        <p className="font-medium">{steps[currentStep]?.title}</p>
      </div>

      {/* Desktop: circles with lines */}
      <div className="hidden sm:flex items-center justify-center gap-0 mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = index === currentStep
          const isClickable = isCompleted || index <= Math.max(...completedSteps, 0) + 1

          return (
            <div key={index} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all shrink-0',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && !isCompleted && 'bg-blue-600 text-white ring-4 ring-blue-100',
                  !isCurrent && !isCompleted && isClickable && 'bg-gray-200 text-gray-600 hover:bg-gray-300',
                  !isCurrent && !isCompleted && !isClickable && 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
                title={step.title}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
