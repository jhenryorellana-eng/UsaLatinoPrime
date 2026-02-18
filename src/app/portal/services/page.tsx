import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WelcomeModal } from '@/components/portal/WelcomeModal'
import {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car,
  Star, Clock, CheckCircle2, Users, ChevronRight, MapPin, CalendarDays
} from 'lucide-react'

const iconMap: Record<string, any> = {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car
}

const featuredSlugs = ['cambio-de-corte', 'visa-juvenil']

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: { user } } = await supabase.auth.getUser()
  const firstName = user?.user_metadata?.first_name || ''

  const featured = services?.filter(s => featuredSlugs.includes(s.slug)) || []
  const regular = services?.filter(s => !featuredSlugs.includes(s.slug)) || []

  return (
    <div className="space-y-8">
      <WelcomeModal firstName={firstName} />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {firstName ? `${firstName}, ` : ''}estos son nuestros servicios
        </h1>
        <p className="text-gray-500 mt-1">
          Seleccione el servicio que necesita y lo guiaremos paso a paso
        </p>
      </div>

      {/* Trust Banner */}
      <div className="bg-[#002855] rounded-xl p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/90 text-sm">
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#F2A900]" />
          Consulta gratuita
        </span>
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#F2A900]" />
          +500 familias ayudadas
        </span>
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#F2A900]" />
          Proceso 100% confidencial
        </span>
      </div>

      {/* Featured Services */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F2A900] fill-[#F2A900]" />
            <h2 className="text-lg font-semibold text-gray-900">Servicios Destacados</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((service) => {
              const Icon = iconMap[service.icon || 'FileText'] || FileText
              return (
                <Link key={service.id} href={`/portal/services/${service.slug}`}>
                  <Card className="relative overflow-hidden border-2 border-[#F2A900]/40 hover:border-[#F2A900] bg-gradient-to-br from-white to-amber-50/50 hover:shadow-lg hover:shadow-[#F2A900]/10 transition-all duration-300 cursor-pointer h-full group">
                    {/* Featured ribbon */}
                    <div className="absolute top-0 right-0">
                      <div className="bg-[#F2A900] text-[#002855] text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Popular
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#002855] shadow-md shrink-0">
                          <Icon className="w-6 h-6 text-[#F2A900]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#002855] transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {service.short_description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-[#002855]">
                                ${Number(service.base_price).toLocaleString()}
                              </span>
                              {service.allow_installments && (
                                <Badge className="ml-2 bg-[#002855]/10 text-[#002855] border-0 text-[10px]">
                                  Planes de pago
                                </Badge>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#F2A900] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                              <ChevronRight className="w-4 h-4 text-[#002855]" />
                            </div>
                          </div>
                          {service.estimated_duration && (
                            <div className="mt-3 inline-flex items-center gap-1.5 bg-[#002855]/10 rounded-full px-3 py-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#002855]" />
                              <span className="text-xs font-semibold text-[#002855]">
                                Tiempo estimado: {service.estimated_duration}
                              </span>
                            </div>
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
      )}

      {/* All Other Services */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Todos los Servicios</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map((service) => {
            const Icon = iconMap[service.icon || 'FileText'] || FileText
            return (
              <Link key={service.id} href={`/portal/services/${service.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg hover:border-[#002855]/30 transition-all duration-300 cursor-pointer h-full group border border-gray-200 hover:-translate-y-0.5">
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-[#002855] to-[#002855]/60 group-hover:to-[#F2A900] transition-all duration-500" />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#002855]/10 to-[#002855]/5 group-hover:from-[#002855] group-hover:to-[#002855]/80 transition-all duration-300 shrink-0">
                        <Icon className="w-5 h-5 text-[#002855] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#002855] transition-colors">
                            {service.name}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#F2A900] group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    {/* Price + Duration bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#002855]">
                          ${Number(service.base_price).toLocaleString()}
                        </span>
                        {service.allow_installments && (
                          <Badge className="bg-[#F2A900]/10 text-[#9a6d00] border-0 text-[10px] font-semibold">
                            Planes de pago
                          </Badge>
                        )}
                      </div>
                      {service.estimated_duration && (
                        <div className="flex items-center gap-1.5 bg-[#002855]/5 rounded-full px-3 py-1">
                          <Clock className="w-3.5 h-3.5 text-[#002855]" />
                          <span className="text-xs font-semibold text-[#002855]">
                            {service.estimated_duration}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Office Location */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Visítanos en Persona</h2>
        <Card className="overflow-hidden border border-gray-200">
          <div className="grid md:grid-cols-[1fr,280px]">
            {/* Map */}
            <div className="h-[250px] md:h-auto min-h-[250px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.5!2d-111.7955!3d40.4285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528a1e0e3fffff%3A0x0!2s10951+N+Town+Center+Dr%2C+Highland%2C+UT+84003!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '250px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de UsaLatinoPrime"
              />
            </div>

            {/* Info panel */}
            <CardContent className="p-5 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50/50">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#002855]/5 shrink-0">
                    <MapPin className="w-5 h-5 text-[#002855]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dirección</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      10951 N. Town Center Drive
                    </p>
                    <p className="text-sm text-gray-600">Highland, Utah 84003</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#002855]/5 shrink-0">
                    <CalendarDays className="w-5 h-5 text-[#002855]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Horario</p>
                    <p className="text-sm text-gray-600 mt-0.5">Lunes a Viernes</p>
                    <p className="text-sm font-medium text-[#002855]">9:00 AM — 5:00 PM</p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=10951+N+Town+Center+Drive+Highland+UT+84003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 bg-[#002855] text-white text-sm font-semibold rounded-lg hover:bg-[#001a3a] transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Cómo llegar
                </a>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Footer trust */}
      <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
        <p>Todos nuestros servicios incluyen seguimiento personalizado y atención en español</p>
      </div>
    </div>
  )
}
