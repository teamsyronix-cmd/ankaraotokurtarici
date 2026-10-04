import { Phone } from 'lucide-react'
import { PHONE_HREF, PHONE_SHORT } from '@/lib/site'

export function About() {
  return (
    <section id="hakkimizda" className="bg-background py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16 lg:px-6">
        <div
          data-reveal="left"
          className="group relative order-last overflow-hidden rounded-3xl border border-border shadow-lg lg:order-first"
        >
          <img
            src="/fleet/fleet-02-s2000-front.jpeg"
            alt="Ankara’da bir aracı güvenle taşıyan profesyonel oto kurtarma çekicimiz"
            className="aspect-4/3 size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div data-reveal="right">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Hakkımızda
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Ankara’da Güvenilir Oto Kurtarma Hizmeti
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            Ankara genelinde oto çekici, oto kurtarma ve yol yardım hizmetleri
            sunuyoruz. Yolda kaldığınız her durumda hızlı müdahale, güvenli araç
            taşıma ve profesyonel hizmet anlayışıyla yanınızdayız. Müşteri
            memnuniyetini ön planda tutarak Ankara’nın tüm ilçelerine 7/24
            hizmet veriyoruz.
          </p>
          <a
            href={PHONE_HREF}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent-brand px-6 py-3.5 text-base font-bold text-accent-brand-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-95 hover:shadow-md"
          >
            <Phone className="size-5" aria-hidden="true" />
            {PHONE_SHORT}
          </a>
        </div>
      </div>
    </section>
  )
}
