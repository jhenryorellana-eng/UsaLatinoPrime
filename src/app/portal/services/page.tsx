import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { WelcomeModal } from '@/components/portal/WelcomeModal'
import {
  Shield, Gavel, Baby, ArrowRightLeft, Receipt, Hash, CreditCard, FileText, Car,
  Star, Clock, CheckCircle2, Users, ChevronRight, MapPin, CalendarDays, Navigation,
  Globe, Sparkles, Phone, Zap, Award, TrendingUp
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
    <div className="space-y-10">
      <WelcomeModal firstName={firstName} />

      {/* ══════════ HERO HEADER ══════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#002855] via-[#001d42] to-[#000e20] p-8 md:p-10">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #F2A900 0px, #F2A900 1px, transparent 1px, transparent 40px),
                            repeating-linear-gradient(-45deg, #F2A900 0px, #F2A900 1px, transparent 1px, transparent 40px)`
        }} />
        {/* Radial glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F2A900]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-[#F2A900]/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Top label */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
            <span className="text-[11px] font-semibold text-[#F2A900] uppercase tracking-[0.15em]">UsaLatinoPrime</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {firstName ? (
              <>{firstName}, <span className="text-[#F2A900]">estos son</span> nuestros servicios</>
            ) : (
              <>Nuestros <span className="text-[#F2A900]">Servicios</span> Profesionales</>
            )}
          </h1>
          <p className="text-blue-100/80 mt-2 max-w-lg text-sm">
            Seleccione el servicio que necesita y lo guiaremos paso a paso en todo el proceso
          </p>

          {/* Gold divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-[#F2A900]/60 to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#F2A900]" />
          </div>
        </div>
      </div>

      {/* ══════════ TRUST BANNER ══════════ */}
      <div className="relative svc-trust-glow rounded-xl overflow-hidden">
        <div className="relative z-10 bg-gradient-to-r from-[#002855] via-[#002855] to-[#001a3a] rounded-xl p-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { icon: CheckCircle2, text: 'Consulta Gratuita', accent: false },
            { icon: Users, text: '+500 Familias Ayudadas', accent: false },
            { icon: Shield, text: '100% Confidencial', accent: false },
            { icon: Award, text: 'Atención Personalizada', accent: true },
          ].map(({ icon: Icon, text, accent }, i) => (
            <div key={i} className="flex items-center gap-2.5 group/trust">
              <div className={`p-1.5 rounded-lg ${accent ? 'bg-[#F2A900]/20' : 'bg-white/10'} group-hover/trust:bg-[#F2A900]/20 transition-colors`}>
                <Icon className="w-4 h-4 text-[#F2A900]" />
              </div>
              <span className="text-sm font-medium text-white/90">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ FEATURED SERVICES ══════════ */}
      {featured.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-[#F2A900] fill-[#F2A900]" />
              <Star className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900] opacity-60" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Servicios Destacados</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((service, i) => {
              const Icon = iconMap[service.icon || 'FileText'] || FileText
              return (
                <Link key={service.id} href={`/portal/services/${service.slug}`}>
                  <div
                    className="svc-card-enter svc-featured-shimmer svc-corner-tl svc-corner-br group relative rounded-2xl overflow-hidden cursor-pointer h-full"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#002855] via-[#001d42] to-[#000e20]" />
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #F2A900 0px, #F2A900 1px, transparent 1px, transparent 30px)`
                    }} />
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F2A900]/0 to-[#F2A900]/0 group-hover:from-[#F2A900]/5 group-hover:to-[#F2A900]/10 transition-all duration-500" />

                    {/* Popular ribbon */}
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-[#F2A900] to-[#d4920a] text-[#002855] text-[10px] font-extrabold px-4 py-1.5 rounded-bl-xl uppercase tracking-[0.15em] shadow-lg shadow-[#F2A900]/20">
                        Popular
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-7">
                      <div className="flex items-start gap-5">
                        {/* Icon */}
                        <div className="svc-icon-glow p-4 rounded-2xl bg-gradient-to-br from-[#F2A900]/20 to-[#F2A900]/5 border border-[#F2A900]/20 shrink-0">
                          <Icon className="w-7 h-7 text-[#F2A900]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-xl tracking-tight group-hover:text-[#F2A900] transition-colors duration-300">
                            {service.name}
                          </h3>
                          <p className="text-blue-100/70 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                            {service.short_description}
                          </p>
                        </div>
                      </div>

                      {/* Price row */}
                      <div className="mt-6 pt-5 border-t border-white/10 flex items-end justify-between">
                        <div>
                          <span className="text-xs text-blue-100/60 uppercase tracking-wider font-medium">Desde</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-3xl font-extrabold text-[#F2A900] tracking-tight">
                              ${Number(service.base_price).toLocaleString()}
                            </span>
                            <span className="text-sm text-blue-100/60">USD</span>
                          </div>
                          {service.allow_installments && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-[#F2A900]/10 border border-[#F2A900]/20 rounded-full px-3 py-1">
                              <TrendingUp className="w-3 h-3 text-[#F2A900]" />
                              <span className="text-[11px] font-semibold text-[#F2A900]">Planes de pago disponibles</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {service.estimated_duration && (
                            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-100/70" />
                              <span className="text-[11px] font-medium text-blue-100/70">
                                {service.estimated_duration}
                              </span>
                            </div>
                          )}
                          <div className="w-10 h-10 rounded-xl bg-[#F2A900] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#F2A900]/20">
                            <ChevronRight className="w-5 h-5 text-[#002855]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════ ALL SERVICES GRID ══════════ */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Todos los Servicios</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          <span className="text-xs text-gray-600 font-medium">{regular.length} servicios</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map((service, i) => {
            const Icon = iconMap[service.icon || 'FileText'] || FileText
            return (
              <Link key={service.id} href={`/portal/services/${service.slug}`}>
                <div
                  className="svc-card-enter svc-hover-lift svc-diagonal-stripe group relative bg-white rounded-2xl overflow-hidden cursor-pointer h-full border border-gray-100"
                  style={{ animationDelay: `${(i + 2) * 100}ms` }}
                >
                  {/* Top accent - dual tone bar */}
                  <div className="h-1 flex">
                    <div className="flex-1 bg-[#002855] group-hover:bg-[#002855] transition-colors" />
                    <div className="w-16 bg-gradient-to-r from-[#002855] to-[#F2A900] group-hover:w-full transition-all duration-500" />
                    <div className="flex-1 bg-gray-100 group-hover:bg-[#F2A900] transition-all duration-500" />
                  </div>

                  <div className="p-6">
                    {/* Icon + Title row */}
                    <div className="flex items-start gap-4">
                      <div className="svc-icon-glow p-3 rounded-xl bg-gradient-to-br from-[#002855]/8 to-[#002855]/3 group-hover:from-[#002855] group-hover:to-[#001a3a] transition-all duration-400 shrink-0 border border-[#002855]/8 group-hover:border-[#002855]">
                        <Icon className="w-5 h-5 text-[#002855] group-hover:text-[#F2A900] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#002855] transition-colors leading-snug">
                            {service.name}
                          </h3>
                          <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-gray-50 group-hover:bg-[#F2A900] flex items-center justify-center transition-all duration-300">
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#002855] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    {/* Divider with diamond */}
                    <div className="mt-5 mb-4 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gray-100 group-hover:bg-[#002855]/10 transition-colors" />
                      <div className="w-1 h-1 rotate-45 bg-gray-200 group-hover:bg-[#F2A900] transition-colors" />
                      <div className="h-px flex-1 bg-gray-100 group-hover:bg-[#002855]/10 transition-colors" />
                    </div>

                    {/* Price + Duration */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Precio</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-extrabold text-[#002855] tracking-tight">
                            ${Number(service.base_price).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">USD</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {service.allow_installments && (
                          <div className="flex items-center gap-1 bg-[#F2A900]/8 border border-[#F2A900]/15 rounded-full px-2.5 py-1">
                            <Zap className="w-3 h-3 text-[#F2A900]" />
                            <span className="text-[10px] font-bold text-[#9a6d00] uppercase">Cuotas</span>
                          </div>
                        )}
                        {service.estimated_duration && (
                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-semibold text-gray-600">
                              {service.estimated_duration}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ══════════ OFFICE LOCATION ══════════ */}
      <div className="relative">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#002855] to-[#001a3a] shadow-lg shadow-[#002855]/20">
            <MapPin className="w-5 h-5 text-[#F2A900]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Visítanos en Persona</h2>
            <p className="text-xs text-gray-600">Atención personalizada en nuestra oficina</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
        </div>

        {/* Main Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#002855]/8 border border-gray-100">
          {/* Top decorative bar */}
          <div className="h-1.5 flex">
            <div className="flex-1 bg-[#002855]" />
            <div className="w-32 bg-gradient-to-r from-[#002855] via-[#F2A900] to-[#002855]" />
            <div className="flex-1 bg-[#002855]" />
          </div>

          <div className="grid md:grid-cols-[1fr,360px]">
            {/* Map */}
            <div className="relative h-[280px] md:h-auto md:min-h-[360px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.5!2d-111.7955!3d40.4285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528a1e0e3fffff%3A0x0!2s10951+N+Town+Center+Dr%2C+Highland%2C+UT+84003!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '280px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de UsaLatinoPrime"
                className="absolute inset-0 w-full h-full"
              />
              {/* Floating badge */}
              <div className="svc-map-badge absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-xl border border-white/50">
                <div className="flex items-center gap-2.5">
                  <div className="svc-pulse-dot" />
                  <span className="text-xs font-bold text-[#002855] uppercase tracking-wider">Oficina Abierta</span>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="relative bg-gradient-to-br from-[#002855] via-[#002855] to-[#001230] p-8 flex flex-col justify-between overflow-hidden">
              {/* Background circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F2A900]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F2A900]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              {/* Geometric line */}
              <div className="absolute top-6 right-6 w-20 h-20 border border-[#F2A900]/10 rotate-45" />

              <div className="relative z-10 space-y-5">
                {/* Title */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
                    <Sparkles className="w-3 h-3 text-[#F2A900]" />
                    <span className="text-[10px] font-bold text-[#F2A900] uppercase tracking-[0.2em]">UsaLatinoPrime</span>
                  </div>
                  <h3 className="text-white text-xl font-bold leading-tight">
                    Nuestra Oficina
                  </h3>
                  <p className="text-blue-100/75 text-xs mt-1">Highland, Utah</p>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#F2A900]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">10951 N. Town Center Drive</p>
                    <p className="text-blue-100/80 text-sm">Highland, Utah 84003</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm shrink-0 mt-0.5">
                    <CalendarDays className="w-4 h-4 text-[#F2A900]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Lunes a Viernes</p>
                    <p className="text-[#F2A900] font-bold text-sm">9:00 AM — 5:00 PM</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#F2A900]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">801-941-3479</p>
                    <p className="text-blue-100/75 text-xs">Llámenos o envíe un mensaje</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/5">
                    <Globe className="w-3 h-3 text-[#F2A900]" />
                    <span className="text-[11px] font-medium text-white/80">En Español</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-[11px] font-medium text-white/80">Consulta Gratis</span>
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative z-10 mt-7">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=10951+N+Town+Center+Drive+Highland+UT+84003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center justify-center gap-2.5 w-full px-5 py-3.5 bg-gradient-to-r from-[#F2A900] to-[#d4920a] text-[#002855] font-bold text-sm rounded-xl hover:from-[#ffc030] hover:to-[#F2A900] transition-all duration-300 shadow-lg shadow-[#F2A900]/20 hover:shadow-[#F2A900]/40 hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-300" />
                  Obtener Direcciones
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ FOOTER TRUST ══════════ */}
      <div className="relative text-center pt-6 pb-2">
        <div className="flex items-center gap-4 justify-center mb-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-200" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#F2A900]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
        <p className="text-sm text-gray-600">
          Todos nuestros servicios incluyen seguimiento personalizado y atención en español
        </p>
      </div>
    </div>
  )
}
