import { redirect } from 'next/navigation'
import { Truck } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { LoginForm } from './login-form'

export default async function LoginPage() {
  if (await getSession()) redirect('/admin')

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-accent-brand/15 blur-3xl"
      />
      <div className="animate-fade-up relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Truck className="size-7 text-accent-brand" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-extrabold tracking-tight text-primary-foreground">
            ANKARA OTO KURTARMA
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/60">
            Yönetim Paneli
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Giriş Yap
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Devam etmek için hesap bilgilerinizi girin.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
