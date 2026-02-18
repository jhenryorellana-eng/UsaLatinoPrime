import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const body = await request.json()
  const { case_id, amount, payment_method, notes } = body

  const { data: caseData } = await supabase.from('cases').select('client_id').eq('id', case_id).single()
  if (!caseData) return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 })

  const { data: payment, error } = await supabase.from('payments').insert({
    case_id,
    client_id: caseData.client_id,
    amount,
    payment_method,
    status: 'completed',
    due_date: new Date().toISOString().split('T')[0],
    paid_at: new Date().toISOString(),
    notes,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ payment })
}
