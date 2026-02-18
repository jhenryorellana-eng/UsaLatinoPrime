'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'
import { CasesTable } from './CasesTable'
import { CaseKanban } from './CaseKanban'

type ViewMode = 'table' | 'kanban'

interface CasesViewProps {
  cases: any[]
}

export function CasesView({ cases }: CasesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  useEffect(() => {
    const saved = localStorage.getItem('henryflow-cases-view')
    if (saved === 'table' || saved === 'kanban') {
      setViewMode(saved)
    }
  }, [])

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode)
    localStorage.setItem('henryflow-cases-view', mode)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('table')}
        >
          <TableIcon className="w-4 h-4 mr-1" />
          Tabla
        </Button>
        <Button
          variant={viewMode === 'kanban' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('kanban')}
        >
          <LayoutGrid className="w-4 h-4 mr-1" />
          Kanban
        </Button>
      </div>

      {viewMode === 'table' ? (
        <CasesTable cases={cases} />
      ) : (
        <CaseKanban cases={cases} />
      )}
    </div>
  )
}
