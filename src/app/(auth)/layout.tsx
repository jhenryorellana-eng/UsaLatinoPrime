import { AnimatedHero } from '@/components/auth/AnimatedHero'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002855] via-[#001e45] to-[#001230] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow orbs */}
        <div className="auth-bg-glow" style={{ top: '10%', left: '15%' }} />
        <div className="auth-bg-glow" style={{ bottom: '15%', right: '10%', animationDelay: '2s' }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <AnimatedHero />
        {children}
      </div>
    </div>
  )
}
