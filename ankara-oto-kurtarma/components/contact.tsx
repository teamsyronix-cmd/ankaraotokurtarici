'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Phone } from 'lucide-react'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/site'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: Bu form daha sonra bir API veya e-posta servisine bağlanabilir.
    setSubmitted(true)
  }

  return (
    <section id="iletisim" className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
              İletişim
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
              Bize Hemen Ulaşın
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              7/24 acil çağrı hattımızdan bize ulaşabilir veya formu
              doldurarak talebinizi iletebilirsiniz.
            </p>

            <a
              href={PHONE_HREF}
              className="mt-8 flex items-center gap-4 rounded-2xl bg-primary p-5 transition-opacity hover:opacity-95"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent-brand text-accent-brand-foreground">
                <Phone className="size-6" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-primary-foreground/70">
                  Acil Çağrı Hattı
                </span>
                <span className="font-heading text-2xl font-extrabold text-primary-foreground">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <CheckCircle2
                  className="size-14 text-accent-brand"
                  aria-hidden="true"
                />
                <p className="mt-4 font-heading text-xl font-bold text-foreground text-balance">
                  Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime
                  geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Ad Soyad
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-foreground"
                  >
                    Telefon Numaranız
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="district"
                    className="text-sm font-semibold text-foreground"
                  >
                    Bulunduğunuz İlçe
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-foreground"
                  >
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-accent-brand text-base font-bold text-accent-brand-foreground transition-all hover:brightness-95"
                >
                  Talebi Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
