'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { CaseFormViewer } from '@/components/admin/CaseFormViewer'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, AlertCircle, FileText, Download, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AdminCaseViewProps {
  caseData: any
  documents: any[]
  activities: any[]
}

export function AdminCaseView({ caseData, documents, activities }: AdminCaseViewProps) {
  const [correctionNotes, setCorrectionNotes] = useState('')
  const [henryNotes, setHenryNotes] = useState(caseData.henry_notes || '')
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function updateStatus(newStatus: string, notes?: string) {
    setLoading(true)
    try {
      const updateData: any = { intake_status: newStatus }
      if (notes) updateData.correction_notes = notes
      if (henryNotes !== caseData.henry_notes) updateData.henry_notes = henryNotes

      await supabase.from('cases').update(updateData).eq('id', caseData.id)

      await supabase.from('case_activity').insert({
        case_id: caseData.id,
        action: 'status_change',
        description: `Estado cambiado a ${newStatus}${notes ? ': ' + notes : ''}`,
        visible_to_client: true,
      })

      // Create notification for client
      await supabase.from('notifications').insert({
        user_id: caseData.client_id,
        case_id: caseData.id,
        title: newStatus === 'approved_by_henry' ? 'Caso Aprobado' : newStatus === 'needs_correction' ? 'Correcciones Solicitadas' : 'Actualización de Caso',
        message: newStatus === 'approved_by_henry'
          ? 'Henry ha aprobado su caso y está listo para ser presentado.'
          : newStatus === 'needs_correction'
          ? notes || 'Se necesitan correcciones en su formulario.'
          : `El estado de su caso ha sido actualizado a ${newStatus}.`,
        type: newStatus === 'needs_correction' ? 'action_required' : 'success',
      })

      toast.success('Estado actualizado')
      router.refresh()
    } catch (error) {
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    if (pdfLoading) return
    setPdfLoading(true)
    try {
      const { generateCasePDF } = await import('@/lib/pdf/generate-case-pdf')
      const pdf = generateCasePDF({
        caseNumber: caseData.case_number,
        serviceName: caseData.service?.name || '',
        serviceSlug: caseData.service?.slug || '',
        clientName: `${caseData.client?.first_name || ''} ${caseData.client?.last_name || ''}`,
        clientEmail: caseData.client?.email || '',
        createdAt: caseData.created_at,
        formData: caseData.form_data || {},
      })
      const blob = pdf.output('blob')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `caso-${caseData.case_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('PDF descargado')
    } catch (error: any) {
      console.error('PDF generation error:', error)
      toast.error(`Error al generar el PDF: ${error.message}`)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/cases" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Casos
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Caso #{caseData.case_number}</h1>
          <p className="text-gray-600">{caseData.service?.name}</p>
          <p className="text-sm text-gray-500">
            {caseData.client?.first_name} {caseData.client?.last_name} &mdash; {caseData.client?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            {pdfLoading ? 'Generando...' : 'Descargar PDF'}
          </Button>
          {caseData.intake_status === 'submitted' && (
            <>
              <Button onClick={() => updateStatus('approved_by_henry')} disabled={loading}>
                <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={loading}>
                    <AlertCircle className="w-4 h-4 mr-1" /> Pedir Correcciones
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Correcciones</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="Describa qué necesita corregir el cliente..."
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={() => updateStatus('needs_correction', correctionNotes)}
                    disabled={!correctionNotes.trim() || loading}
                  >
                    Enviar Solicitud
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}
          {caseData.intake_status === 'approved_by_henry' && (
            <Button onClick={() => updateStatus('filed')} disabled={loading}>
              Marcar como Presentado
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Formulario</TabsTrigger>
          <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-4">
          <CaseFormViewer
            serviceSlug={caseData.service?.slug || ''}
            formData={caseData.form_data || {}}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="space-y-3">
            {documents.length > 0 ? documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.document_key} &mdash; {doc.file_type}</p>
                    </div>
                  </div>
                  <Badge>{doc.status}</Badge>
                </CardContent>
              </Card>
            )) : (
              <p className="text-sm text-gray-500">No hay documentos subidos.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((a: any) => (
                    <div key={a.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm">{a.description}</p>
                        <p className="text-xs text-gray-500">
                          {a.actor?.first_name ? `${a.actor.first_name} ${a.actor.last_name} \u2014 ` : ''}
                          {format(new Date(a.created_at), "d 'de' MMMM yyyy, h:mm a", { locale: es })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay actividad.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Notas internas (solo Henry)</label>
                <Textarea
                  value={henryNotes}
                  onChange={(e) => setHenryNotes(e.target.value)}
                  rows={4}
                  placeholder="Notas sobre este caso..."
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={async () => {
                    await supabase.from('cases').update({ henry_notes: henryNotes }).eq('id', caseData.id)
                    toast.success('Notas guardadas')
                  }}
                >
                  Guardar Notas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
