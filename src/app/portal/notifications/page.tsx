import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeLabels: Record<string, { label: string; color: string }> = {
  info: { label: 'Info', color: 'bg-blue-100 text-blue-800' },
  success: { label: 'Éxito', color: 'bg-green-100 text-green-800' },
  warning: { label: 'Aviso', color: 'bg-yellow-100 text-yellow-800' },
  payment: { label: 'Pago', color: 'bg-emerald-100 text-emerald-800' },
  action_required: { label: 'Acción Requerida', color: 'bg-red-100 text-red-800' },
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Mark all as read
  if (notifications && notifications.some(n => !n.is_read)) {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n: any) => {
            const typeInfo = typeLabels[n.type] || typeLabels.info
            return (
              <Card key={n.id} className={cn(!n.is_read && 'border-blue-200 bg-blue-50')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{n.title}</h3>
                        <Badge className={typeInfo.color} variant="secondary">
                          {typeInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(n.created_at).toLocaleDateString('es', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Sin notificaciones</h3>
            <p className="text-gray-600 mt-1">No tiene notificaciones aun.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
