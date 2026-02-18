'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { statusLabels } from '@/lib/case-status'

interface CasesTableProps {
  cases: any[]
}

export function CasesTable({ cases }: CasesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caso</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c: any) => {
              const status = statusLabels[c.intake_status] || statusLabels.in_progress
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/admin/cases/${c.id}`} className="text-blue-600 hover:underline font-medium">
                      #{c.case_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{c.client?.first_name} {c.client?.last_name}</p>
                      <p className="text-xs text-gray-500">{c.client?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.service?.name}</TableCell>
                  <TableCell><Badge className={status.color}>{status.label}</Badge></TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(c.created_at), 'd MMM yyyy', { locale: es })}
                  </TableCell>
                </TableRow>
              )
            })}
            {cases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No hay casos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
