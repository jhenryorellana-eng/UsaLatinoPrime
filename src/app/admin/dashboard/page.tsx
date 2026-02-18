import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, Users, DollarSign, AlertCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Metrics
  const { count: submittedCount } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('intake_status', 'submitted')

  const { count: activeCount } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .in('intake_status', ['in_progress', 'submitted', 'under_review', 'needs_correction'])

  const { count: clientCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const { data: completedPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed')

  const totalCollected = completedPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

  // Cases needing attention
  const { data: attentionCases } = await supabase
    .from('cases')
    .select('*, service:service_catalog(name), client:profiles(first_name, last_name)')
    .in('intake_status', ['submitted', 'needs_correction'])
    .order('updated_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Casos Enviados</p>
                <p className="text-3xl font-bold">{submittedCount || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Casos Activos</p>
                <p className="text-3xl font-bold">{activeCount || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes</p>
                <p className="text-3xl font-bold">{clientCount || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cobrado</p>
                <p className="text-3xl font-bold">${totalCollected.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attention Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Requieren Atenci&oacute;n
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attentionCases && attentionCases.length > 0 ? (
            <div className="space-y-3">
              {attentionCases.map((c: any) => (
                <Link key={c.id} href={`/admin/cases/${c.id}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">
                        {c.client?.first_name} {c.client?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{c.service?.name} — #{c.case_number}</p>
                    </div>
                    <Badge className={c.intake_status === 'submitted' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}>
                      {c.intake_status === 'submitted' ? 'Enviado' : 'Correcci\u00f3n Pendiente'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay casos que requieran atenci&oacute;n inmediata.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
