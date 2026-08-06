import { Truck, LifeBuoy, Wrench, Route } from 'lucide-react'

const SERVICES = [
  {
    icon: Truck,
    title: 'Oto Çekici',
    text: 'Arızalanan veya yolda kalan araçlarınız güvenli şekilde bulunduğu konumdan alınarak istediğiniz noktaya ulaştırılır.',
  },
  {
    icon: LifeBuoy,
    title: 'Oto Kurtarma',
    text: 'Kaza, arıza veya zorlu yol koşullarında aracınız için profesyonel kurtarma desteği sağlanır.',
  },
  {
    icon: Wrench,
    title: 'Yol Yardım',
    text: 'Akü, lastik ve temel yol sorunlarında hızlı destek sunulur.',
  },
  {
    icon: Route,
    title: 'Şehir İçi Araç Taşıma',
    text: 'Ankara içerisinde aracınız güvenli ve profesyonel şekilde istenilen adrese taşınır.',
  },
]

export function ServiceCards() {
  return (
    <section id="hizmetler" className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Hizmetlerimiz
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Yolda Kaldığınız Her An Yanınızdayız
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-brand/50 hover:shadow-lg"
            >
              <span className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-accent-brand opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent-brand group-hover:text-accent-brand-foreground">
                <service.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
