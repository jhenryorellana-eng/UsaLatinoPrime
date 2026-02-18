import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WelcomeModal } from '@/components/portal/WelcomeModal'
import {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car,
  Star, Clock, CheckCircle2, Users, ChevronRight, MapPin, CalendarDays, Navigation,
  Phone, Globe, Sparkles
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

      {/* Office Location — Immersive Design */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#002855]/15 group/map">
        {/* Full-width map as background layer */}
        <div className="relative h-[420px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.5!2d-111.7955!3d40.4285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528a1e0e3fffff%3A0x0!2s10951+N+Town+Center+Dr%2C+Highland%2C+UT+84003!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de UsaLatinoPrime"
            className="absolute inset-0 w-full h-full"
          />

          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002855] via-[#002855]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002855]/80 to-transparent pointer-events-none" />

          {/* Floating "Open" badge */}
          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-[11px] font-bold text-[#002855] uppercase tracking-widest">Abierto Ahora</span>
            </div>
          </div>

          {/* Content overlay on map */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Left: Office Info */}
              <div className="space-y-4 max-w-md">
                {/* Brand tag */}
                <div className="inline-flex items-center gap-2 bg-[#F2A900]/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 border border-[#F2A900]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                  <span className="text-[10px] font-bold text-[#F2A900] uppercase tracking-[0.15em]">Visítanos en Persona</span>
                </div>

                <h3 className="text-white text-2xl sm:text-3xl font-black leading-tight">
                  Nuestra Oficina en<br />
                  <span className="text-[#F2A900]">Highland, Utah</span>
                </h3>

                {/* Info pills row */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
                    <MapPin className="w-4 h-4 text-[#F2A900] shrink-0" />
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">10951 N. Town Center Dr</p>
                      <p className="text-blue-200/70 text-[11px]">Highland, UT 84003</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/10">
                    <CalendarDays className="w-4 h-4 text-[#F2A900] shrink-0" />
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">Lun — Vie</p>
                      <p className="text-[#F2A900] text-[11px] font-bold">9:00 AM — 5:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Trust tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
                    <Globe className="w-3 h-3 text-[#F2A900]" />
                    <span className="text-[10px] font-medium text-white/80">Atención en Español</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-medium text-white/80">Primera Consulta Gratuita</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
                    <Shield className="w-3 h-3 text-blue-300" />
                    <span className="text-[10px] font-medium text-white/80">100% Confidencial</span>
                  </span>
                </div>
              </div>

              {/* Right: CTA Button */}
              <div className="shrink-0">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=10951+N+Town+Center+Drive+Highland+UT+84003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-[#F2A900] to-[#e09800] text-[#002855] font-bold text-sm rounded-2xl hover:from-[#ffc030] hover:to-[#F2A900] transition-all duration-300 shadow-xl shadow-[#F2A900]/25 hover:shadow-[#F2A900]/50 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <div className="p-2 bg-[#002855]/15 rounded-xl">
                    <Navigation className="w-5 h-5 group-hover/btn:rotate-45 transition-transform duration-300" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black">Obtener Direcciones</span>
                    <span className="block text-[10px] font-medium text-[#002855]/70">Abrir en Google Maps</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gold accent line */}
        <div className="h-1 bg-gradient-to-r from-[#F2A900] via-[#002855] to-[#F2A900]" />
      </div>

      {/* Footer trust */}
      <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
        <p>Todos nuestros servicios incluyen seguimiento personalizado y atención en español</p>
      </div>
    </div>
  )
}
