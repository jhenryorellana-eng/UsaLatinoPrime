import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string }> = {
  payment_pending: { label: 'Pendiente de Pago', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  submitted: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  under_review: { label: 'En Revision', color: 'bg-orange-100 text-orange-800' },
  needs_correction: { label: 'Necesita Correcciones', color: 'bg-red-100 text-red-800' },
  approved_by_henry: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  filed: { label: 'Presentado', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service:service_catalog(name, slug, icon)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {profile?.first_name || 'Usuario'}
        </h1>
        <p className="text-gray-600">Bienvenido a su portal de servicios migratorios</p>
      </div>

      {cases && cases.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mis Casos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((c: any) => {
              const status = statusLabels[c.intake_status] || statusLabels.in_progress
              return (
                <Link key={c.id} href={
                  c.intake_status === 'in_progress' || c.intake_status === 'needs_correction'
                    ? `/portal/cases/${c.id}/wizard`
                    : `/portal/cases/${c.id}`
                }>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{c.service?.name}</CardTitle>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Caso #{c.case_number}</p>
                      {c.intake_status === 'in_progress' && (
                        <p className="text-sm text-blue-600 mt-1">
                          Paso {(c.current_step || 0) + 1} de {c.total_steps || '?'}
                        </p>
                      )}
                      {c.intake_status === 'needs_correction' && c.correction_notes && (
                        <p className="text-sm text-red-600 mt-1">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          {c.correction_notes.substring(0, 100)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
          <Link href="/portal/services">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </Link>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No tiene casos activos</h3>
            <p className="text-gray-600 mt-1 mb-4">
              Seleccione el servicio que necesita para comenzar
            </p>
            <Link href="/portal/services">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Seleccionar Servicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
