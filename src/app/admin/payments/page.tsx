import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  overdue: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default async function AdminPaymentsPage() {
  const supabase = await createClient()
  const { data: payments } = await supabase
    .from('payments')
    .select('*, case:cases(case_number), client:profiles(first_name, last_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caso</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>M&eacute;todo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>#{p.case?.case_number}</TableCell>
                  <TableCell>{p.client?.first_name} {p.client?.last_name}</TableCell>
                  <TableCell className="font-medium">${Number(p.amount).toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{p.payment_method || '\u2014'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[p.status] || ''}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(p.created_at), 'd MMM yyyy', { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
              {(!payments || payments.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No hay pagos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
