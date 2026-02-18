import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, AlertCircle, FileText, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CaseProgressBar } from '@/components/portal/CaseProgressBar'
import { PostSubmitDocUploader } from '@/components/portal/PostSubmitDocUploader'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800', icon: Clock },
  submitted: { label: 'Enviado a Henry', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  under_review: { label: 'En Revision por Henry', color: 'bg-orange-100 text-orange-800', icon: Clock },
  needs_correction: { label: 'Necesita Correcciones', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  approved_by_henry: { label: 'Aprobado por Henry', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  filed: { label: 'Presentado', color: 'bg-emerald-100 text-emerald-800', icon: FileText },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: caseData } = await supabase
    .from('cases')
    .select('*, service:service_catalog(name, slug)')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!caseData) notFound()

  const { data: activities } = await supabase
    .from('case_activity')
    .select('*')
    .eq('case_id', id)
    .eq('visible_to_client', true)
    .order('created_at', { ascending: false })

  const status = statusConfig[caseData.intake_status] || statusConfig.in_progress
  const canUploadDocs = ['submitted', 'under_review', 'needs_correction'].includes(caseData.intake_status)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/portal/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Caso #{caseData.case_number}
          </h1>
          <p className="text-gray-600">{caseData.service?.name}</p>
        </div>
        <Badge className={status.color}>{status.label}</Badge>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <CaseProgressBar status={caseData.intake_status} />
        </CardContent>
      </Card>

      {caseData.intake_status === 'needs_correction' && caseData.correction_notes && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Correcciones Solicitadas</h3>
                <p className="text-sm text-red-700 mt-1">{caseData.correction_notes}</p>
                <Link href={`/portal/cases/${id}/wizard`}>
                  <Button size="sm" className="mt-3">
                    Corregir Formulario
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad del Caso</CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.created_at), "d 'de' MMMM yyyy, h:mm a", { locale: es })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay actividad registrada aun.</p>
          )}
        </CardContent>
      </Card>

      {/* Post-Submit Document Upload */}
      {canUploadDocs && (
        <PostSubmitDocUploader caseId={id} clientId={user.id} />
      )}
    </div>
  )
}
