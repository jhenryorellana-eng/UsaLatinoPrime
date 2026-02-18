'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard, FileText, CreditCard, Bell, LogOut, Menu, User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/services', label: 'Servicios', icon: FileText },
  { href: '/portal/payments', label: 'Pagos', icon: CreditCard },
  { href: '/portal/notifications', label: 'Notificaciones', icon: Bell },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single()
        if (profile) setUserName(`${profile.first_name} ${profile.last_name}`)
      }
    }
    loadUser()
  }, [supabase])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">HenryFlow</h2>
        <p className="text-sm text-gray-500">Portal del Cliente</p>
      </div>
      <Separator />
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{userName}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesion
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r bg-white">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-4 bg-white border-b px-4 py-3 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
        <h1 className="font-semibold">HenryFlow</h1>
      </div>

      {/* Main content */}
      <main className="md:ml-64 p-6">
        {children}
      </main>
    </div>
  )
}
