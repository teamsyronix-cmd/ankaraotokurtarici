'use client'

import { useEffect, useState } from 'react'
import { Menu, Phone, Truck, X } from 'lucide-react'
import { NAV_LINKS, PHONE_HREF, PHONE_SHORT } from '@/lib/site'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`animate-slide-down fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/95 shadow-sm backdrop-blur'
          : 'bg-background/70 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 md:h-18 lg:px-6">
        <a href="#anasayfa" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-10">
            <Truck
              className="group-hover:animate-drive size-5 text-accent-brand"
              aria-hidden="true"
            />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-heading text-sm font-extrabold tracking-tight text-primary sm:text-base md:text-lg">
              ANKARA OTO KURTARMA
            </span>
            <span className="mt-0.5 truncate text-[10px] font-medium text-muted-foreground sm:text-[11px] md:text-xs">
              7/24 Yol Yardım Hizmeti
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent-brand after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={PHONE_HREF}
            aria-label={`Hemen ara: ${PHONE_SHORT}`}
            className="inline-flex size-10 items-center justify-center gap-2 rounded-xl bg-accent-brand px-0 text-sm font-bold text-accent-brand-foreground shadow-sm transition-all hover:brightness-95 sm:size-auto sm:px-4 sm:py-2.5"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{PHONE_SHORT}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-border bg-background duration-200 lg:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col px-4 py-3"
            aria-label="Mobil menü"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-brand px-4 py-3 text-base font-bold text-accent-brand-foreground"
            >
              <Phone className="size-5" aria-hidden="true" />
              {PHONE_SHORT}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
