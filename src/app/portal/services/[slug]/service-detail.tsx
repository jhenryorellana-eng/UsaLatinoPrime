'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { getWorkflow } from '@/lib/workflows'
import type { ServiceCatalog } from '@/types/database'

interface ServiceDetailProps {
  service: ServiceCatalog
  userId: string
}

export function ServiceDetail({ service, userId }: ServiceDetailProps) {
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, any>>({})
  const [eligibilityPassed, setEligibilityPassed] = useState<boolean | null>(null)
  const [failMessages, setFailMessages] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const questions = service.eligibility_questions as any[] | null
  const workflow = getWorkflow(service.slug)

  function checkEligibility() {
    if (!questions || questions.length === 0) {
      setEligibilityPassed(true)
      return
    }

    const fails: string[] = []
    for (const q of questions) {
      const answer = eligibilityAnswers[q.id]
      if (q.type === 'boolean' && q.required_answer !== undefined) {
        if (answer !== q.required_answer) fails.push(q.fail_message)
      }
      if (q.type === 'multi_select' && q.min_selections) {
        if (!Array.isArray(answer) || answer.length < q.min_selections) fails.push(q.fail_message)
      }
    }

    setFailMessages(fails)
    setEligibilityPassed(fails.length === 0)
  }

  async function handleStartCase() {
    setCreating(true)
    try {
      const { data: newCase, error } = await supabase
        .from('cases')
        .insert({
          case_number: '',
          client_id: userId,
          service_id: service.id,
          intake_status: 'in_progress',
          total_cost: service.base_price,
          total_steps: workflow?.steps.length || 0,
          form_data: {},
          current_step: 0,
        })
        .select()
        .single()

      if (error) throw error

      await supabase.from('case_activity').insert({
        case_id: newCase.id,
        actor_id: userId,
        action: 'case_created',
        description: `Caso creado para ${service.name}`,
      })

      toast.success('Caso creado exitosamente')
      router.push(`/portal/cases/${newCase.id}/wizard`)
    } catch (error) {
      console.error('Error creating case:', error)
      toast.error('Error al crear el caso')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
        <p className="text-gray-600 mt-1">{service.short_description}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Costo del servicio</p>
              <p className="text-3xl font-bold">${service.base_price.toLocaleString()}</p>
            </div>
            {service.allow_installments && (
              <Badge variant="secondary">Planes de pago disponibles</Badge>
            )}
          </div>
          {service.estimated_duration && (
            <p className="text-sm text-gray-500 mt-2">
              Tiempo estimado: {service.estimated_duration}
            </p>
          )}
          {service.uscis_forms && service.uscis_forms.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Formularios: {service.uscis_forms.join(', ')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eligibility Questions */}
      {questions && questions.length > 0 && eligibilityPassed === null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preguntas de Pre-calificacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q: any) => (
              <div key={q.id} className="space-y-2">
                <Label className="text-sm font-medium">{q.question}</Label>
                {q.type === 'boolean' && (
                  <RadioGroup
                    value={eligibilityAnswers[q.id]?.toString()}
                    onValueChange={(v) =>
                      setEligibilityAnswers({ ...eligibilityAnswers, [q.id]: v === 'true' })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="true" id={`${q.id}-yes`} />
                        <Label htmlFor={`${q.id}-yes`}>Si</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="false" id={`${q.id}-no`} />
                        <Label htmlFor={`${q.id}-no`}>No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
                {q.type === 'multi_select' && (
                  <div className="space-y-2">
                    {q.options?.map((opt: string) => (
                      <div key={opt} className="flex items-center gap-2">
                        <Checkbox
                          id={`${q.id}-${opt}`}
                          checked={(eligibilityAnswers[q.id] || []).includes(opt)}
                          onCheckedChange={(checked) => {
                            const current = eligibilityAnswers[q.id] || []
                            setEligibilityAnswers({
                              ...eligibilityAnswers,
                              [q.id]: checked
                                ? [...current, opt]
                                : current.filter((o: string) => o !== opt),
                            })
                          }}
                        />
                        <Label htmlFor={`${q.id}-${opt}`} className="text-sm">{opt}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button onClick={checkEligibility} className="w-full">
              Verificar Elegibilidad
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Eligibility Result */}
      {eligibilityPassed === false && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Posibles limitaciones</h3>
                <ul className="mt-2 space-y-1">
                  {failMessages.map((msg, i) => (
                    <li key={i} className="text-sm text-red-700">{msg}</li>
                  ))}
                </ul>
                <p className="text-sm text-red-600 mt-3">
                  Contacte a Henry para evaluar su caso especifico.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Case Button */}
      {(eligibilityPassed === true || (!questions || questions.length === 0)) && (
        <Button onClick={handleStartCase} disabled={creating} size="lg" className="w-full">
          {creating ? 'Creando caso...' : (
            <>
              Comenzar mi Caso
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
