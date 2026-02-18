'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAutoSave(
  caseId: string,
  formData: Record<string, unknown>,
  currentStep: number,
  enabled: boolean = true
) {
  const supabase = createClient()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')
  const isSavingRef = useRef(false)

  const save = useCallback(async () => {
    if (isSavingRef.current) return

    const dataString = JSON.stringify(formData)
    if (dataString === lastSavedRef.current) return

    isSavingRef.current = true
    try {
      await supabase
        .from('cases')
        .update({ form_data: formData, current_step: currentStep })
        .eq('id', caseId)
      lastSavedRef.current = dataString
    } catch (error) {
      console.error('Auto-save error:', error)
    } finally {
      isSavingRef.current = false
    }
  }, [caseId, formData, currentStep, supabase])

  useEffect(() => {
    if (!enabled) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(save, 2000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formData, currentStep, save, enabled])

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      save()
    }
  }, [save])

  return { save, isSaving: isSavingRef.current }
}
