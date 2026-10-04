'use client'

import { useActionState } from 'react'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import { login } from '../actions'

const inputClass =
  'h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30'

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-semibold text-foreground">
          Kullanıcı Adı
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-foreground">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-brand text-base font-bold text-accent-brand-foreground transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-70"
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="size-5" aria-hidden="true" />
        )}
        {pending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>
    </form>
  )
}
