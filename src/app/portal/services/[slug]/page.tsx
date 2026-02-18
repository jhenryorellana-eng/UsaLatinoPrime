import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ServiceDetail } from './service-detail'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!service) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return <ServiceDetail service={service} userId={user!.id} />
}
