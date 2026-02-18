'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload, FileText, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { Document } from '@/types/database'

interface PostSubmitDocUploaderProps {
  caseId: string
  clientId: string
}

export function PostSubmitDocUploader({ caseId, clientId }: PostSubmitDocUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [description, setDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadDocuments() {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (data) setDocuments(data)
    }
    loadDocuments()
  }, [caseId, supabase])

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const docKey = description.trim() || 'documento-adicional'
        const filePath = `${clientId}/${caseId}/post-submit/${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
          .from('case-documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: docRecord, error: dbError } = await supabase
          .from('documents')
          .insert({
            case_id: caseId,
            client_id: clientId,
            document_key: docKey,
            name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: clientId,
          })
          .select()
          .single()

        if (dbError) throw dbError

        setDocuments((prev) => [docRecord, ...prev])
        setDescription('')

        // Log activity
        await supabase.from('case_activity').insert({
          case_id: caseId,
          action: 'document_uploaded',
          description: `Documento adicional subido: ${file.name}`,
          visible_to_client: true,
        })

        toast.success('Documento subido exitosamente')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Error al subir el documento')
      } finally {
        setUploading(false)
      }
    },
    [caseId, clientId, description, supabase]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Documentos Adicionales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Suba documentos adicionales que Henry pueda necesitar para su caso.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Descripcion del documento (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
              e.target.value = ''
            }}
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Subiendo...' : (
              <>
                <Upload className="w-4 h-4 mr-1" />
                Subir
              </>
            )}
          </Button>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.document_key}
                    {doc.file_size ? ` — ${(doc.file_size / 1024).toFixed(0)} KB` : ''}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  doc.status === 'approved' ? 'bg-green-100 text-green-700'
                    : doc.status === 'rejected' ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {doc.status === 'approved' ? 'Aprobado'
                    : doc.status === 'rejected' ? 'Rechazado'
                    : 'Subido'}
                </span>
              </div>
            ))}
          </div>
        )}

        {documents.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No hay documentos subidos aun.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
