import {
  Clock,
  MapPinned,
  Zap,
  Users,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react'

const FEATURES = [
  { icon: Clock, title: '7 Gün 24 Saat Hizmet' },
  { icon: MapPinned, title: 'Ankara’nın Her Bölgesine Hizmet' },
  { icon: Zap, title: 'Hızlı ve Güvenli Müdahale' },
  { icon: Users, title: 'Profesyonel Ekip' },
  { icon: ShieldCheck, title: 'Güvenli Araç Taşıma' },
  { icon: HeartHandshake, title: 'Müşteri Memnuniyeti Odaklı Hizmet' },
]

const STATS = [
  { value: '7/24', label: 'Kesintisiz Hizmet' },
  { value: 'Ankara Geneli', label: 'Geniş Hizmet Ağı' },
  { value: 'Hızlı', label: 'Müdahale Desteği' },
]

export function WhyUs() {
  return (
    <section className="bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Farkımız
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Neden Ankara Oto Kurtarma?
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-brand/15 text-accent-brand">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-base font-semibold text-foreground">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-primary p-8 text-center"
            >
              <p className="font-heading text-2xl font-extrabold text-accent-brand sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
