import { createClient } from '@/lib/supabase/server'
import { CasesView } from '@/components/admin/CasesView'

export default async function AdminCasesPage() {
  const supabase = await createClient()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service:service_catalog(name), client:profiles(first_name, last_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Todos los Casos</h1>
      <CasesView cases={cases || []} />
    </div>
  )
}
