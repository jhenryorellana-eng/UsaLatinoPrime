'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { RequiredDocument } from '@/types/wizard'
import type { Document } from '@/types/database'

interface DocumentUploaderProps {
  caseId: string
  clientId: string
  requiredDocuments: RequiredDocument[]
  uploadedDocuments: Document[]
  onDocumentUploaded: (doc: Document) => void
}

export function DocumentUploader({
  caseId,
  clientId,
  requiredDocuments,
  uploadedDocuments,
  onDocumentUploaded,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const supabase = createClient()

  const getUploadedDocs = (key: string) =>
    uploadedDocuments.filter((d) => d.document_key === key)

  const handleUpload = useCallback(
    async (docKey: string, file: File) => {
      setUploading(docKey)
      try {
        const filePath = `${clientId}/${caseId}/${docKey}/${Date.now()}-${file.name}`
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

        onDocumentUploaded(docRecord)
        toast.success('Documento subido exitosamente')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Error al subir el documento')
      } finally {
        setUploading(null)
      }
    },
    [caseId, clientId, supabase, onDocumentUploaded]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Documentos de Soporte</h2>
        <p className="mt-1 text-sm text-gray-600">
          Suba los documentos que tenga disponibles. No se preocupe si no tiene todos — Henry le indicará cuáles son prioritarios.
        </p>
      </div>

      <div className="space-y-4">
        {requiredDocuments.map((doc) => {
          const uploaded = getUploadedDocs(doc.key)
          const hasUploaded = uploaded.length > 0

          return (
            <Card key={doc.key} className={hasUploaded ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{doc.label}</span>
                      {doc.required ? (
                        <Badge variant="destructive" className="text-xs">Requerido</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Opcional</Badge>
                      )}
                      {hasUploaded && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                    {doc.helper && (
                      <p className="text-xs text-gray-500 mt-1">{doc.helper}</p>
                    )}

                    {/* Show uploaded files */}
                    {uploaded.map((u) => (
                      <div key={u.id} className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <FileText className="w-3 h-3" />
                        <span>{u.name}</span>
                        <span className="text-gray-400">
                          ({(u.file_size! / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUpload(doc.key, file)
                        }}
                        disabled={uploading === doc.key}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading === doc.key}
                        asChild
                      >
                        <span>
                          {uploading === doc.key ? (
                            'Subiendo...'
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-1" />
                              Subir
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
