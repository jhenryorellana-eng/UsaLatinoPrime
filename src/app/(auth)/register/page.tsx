'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contrasenas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        },
      },
    })

    if (error) {
      toast.error('Error al registrarse', { description: error.message })
      setLoading(false)
      return
    }

    toast.success('Cuenta creada exitosamente', {
      description: 'Ahora puede iniciar sesion.',
    })
    router.push('/login')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Crear Cuenta</CardTitle>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Juan"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Perez"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="su@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repita su contrasena"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Ya tiene cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Inicie sesion
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
