import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
  overdue: { label: 'Vencido', color: 'bg-red-100 text-red-800' },
}

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: payments } = await supabase
    .from('payments')
    .select('*, case:cases(case_number)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const hasPayments = payments && payments.length > 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>

      {hasPayments ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caso</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Metodo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: any) => {
                  const statusInfo = paymentStatusLabels[payment.status] || paymentStatusLabels.pending
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-sm">
                        #{payment.case?.case_number || '—'}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {payment.installment_number}/{payment.total_installments}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {payment.paid_at
                          ? format(new Date(payment.paid_at), 'd MMM yyyy', { locale: es })
                          : payment.due_date
                          ? format(new Date(payment.due_date), 'd MMM yyyy', { locale: es })
                          : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {payment.payment_method || '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Sin pagos registrados</h3>
            <p className="text-gray-500 mt-1 text-sm">
              Cuando realice pagos por sus servicios, apareceran aqui con su historial completo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
