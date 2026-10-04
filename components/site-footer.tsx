import { Phone, Truck } from 'lucide-react'
import { NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-primary pb-24 pt-16 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div data-reveal className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Truck
                  className="size-5 text-accent-brand"
                  aria-hidden="true"
                />
              </span>
              <span className="font-heading text-lg font-extrabold tracking-tight text-primary-foreground">
                ANKARA OTO KURTARMA
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Ankara genelinde 7/24 profesyonel oto çekici, oto kurtarma ve yol
              yardım hizmeti.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-accent-brand">
              Hızlı Bağlantılar
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-accent-brand">
              İletişim
            </h3>
            <a
              href={PHONE_HREF}
              className="mt-4 inline-flex items-center gap-2 font-heading text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Phone className="size-5 text-accent-brand" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6">
          <p className="text-center text-sm text-primary-foreground/60">
            © 2026 Ankara Oto Kurtarma. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
