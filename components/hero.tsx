import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { PHONE_HREF } from '@/lib/site'

const TRUST_ITEMS = [
  { icon: Clock, label: '7/24 Kesintisiz Hizmet' },
  { icon: MapPin, label: 'Ankara’nın Tüm İlçeleri' },
  { icon: ArrowRight, label: 'Hızlı Müdahale' },
  { icon: ShieldCheck, label: 'Güvenli Araç Taşıma' },
]

export function Hero() {
  return (
    <section id="anasayfa" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fleet/fleet-01-night.jpeg"
          alt="Ankara yollarında bir aracı güvenle taşıyan profesyonel oto çekicimiz"
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/95" />
      </div>

      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 pt-24 pb-14 sm:pt-28 sm:pb-16 md:min-h-[88vh] lg:px-6">
        <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-accent-brand/40 bg-accent-brand/15 px-4 py-1.5 text-sm font-semibold text-accent-brand">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-brand opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-brand" />
          </span>
          Şu an hizmetteyiz
        </div>

        <h1
          style={{ '--delay': '120ms' } as React.CSSProperties}
          className="animate-fade-up mt-5 max-w-3xl font-heading text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-primary-foreground text-balance sm:mt-6 sm:text-5xl sm:leading-[1.05] lg:text-6xl">
          Ankara’nın Her Noktasına 7/24 Oto Kurtarma
        </h1>

        <p
          style={{ '--delay': '240ms' } as React.CSSProperties}
          className="animate-fade-up mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/85 text-pretty sm:mt-6 sm:text-lg">
          Aracınız yolda mı kaldı? Ankara’nın tüm ilçelerine hızlı, güvenli ve
          profesyonel oto çekici hizmeti sunuyoruz. Bizi hemen arayın, en kısa
          sürede yanınızda olalım.
        </p>

        <div
          style={{ '--delay': '360ms' } as React.CSSProperties}
          className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href={PHONE_HREF}
            className="shine inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-brand px-7 py-4 text-lg font-bold text-accent-brand-foreground shadow-lg shadow-accent-brand/20 transition-all hover:-translate-y-0.5 hover:brightness-95 hover:shadow-xl active:translate-y-0"
          >
            <Phone className="animate-ring size-5" aria-hidden="true" />
            Hemen Ara
          </a>
          <a
            href="#hizmetler"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 px-7 py-4 text-lg font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-primary-foreground/20"
          >
            Hizmetlerimizi İncele
            <ArrowRight
              className="size-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, index) => (
            <li
              key={item.label}
              style={{ '--delay': `${480 + index * 90}ms` } as React.CSSProperties}
              className="animate-fade-up flex items-center gap-2.5 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-3 backdrop-blur"
            >
              <CheckCircle2
                className="size-5 shrink-0 text-accent-brand"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-primary-foreground">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#hizmetler"
        aria-label="Aşağı kaydır"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-primary-foreground/70 transition-colors hover:text-primary-foreground md:block"
      >
        <ChevronDown className="animate-scroll-cue size-7" aria-hidden="true" />
      </a>
    </section>
  )
}
