import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car
} from 'lucide-react'

const iconMap: Record<string, any> = {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car
}

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Servicios Disponibles</h1>
        <p className="text-gray-600">Seleccione el servicio que necesita</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => {
          const Icon = iconMap[service.icon || 'FileText'] || FileText
          return (
            <Link key={service.id} href={`/portal/services/${service.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.short_description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${service.base_price.toLocaleString()}
                        </span>
                        {service.allow_installments && (
                          <Badge variant="secondary" className="text-xs">
                            Planes de pago
                          </Badge>
                        )}
                      </div>
                      {service.estimated_duration && (
                        <p className="text-xs text-gray-400 mt-1">
                          Tiempo estimado: {service.estimated_duration}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
