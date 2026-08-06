import { Phone } from 'lucide-react'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/site'

export function EmergencyCta() {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-primary-foreground text-balance sm:text-4xl">
          Aracınız Yolda mı Kaldı?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/80 text-pretty">
          Konumunuzu bildirin, profesyonel ekibimiz en kısa sürede size ulaşsın.
        </p>

        <a
          href={PHONE_HREF}
          className="mt-8 inline-block break-words font-heading text-3xl font-extrabold tracking-tight text-accent-brand transition-opacity hover:opacity-90 sm:text-5xl"
        >
          {PHONE_DISPLAY}
        </a>

        <div className="mt-8">
          <a
            href={PHONE_HREF}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-accent-brand px-8 py-4 text-lg font-bold text-accent-brand-foreground shadow-lg shadow-black/20 transition-all hover:brightness-95 hover:shadow-xl sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            <Phone className="size-6" aria-hidden="true" />
            Şimdi Ara
          </a>
        </div>
      </div>
    </section>
  )
}
