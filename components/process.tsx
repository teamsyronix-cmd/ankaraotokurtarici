import { Phone, MapPin, Truck } from 'lucide-react'

const STEPS = [
  {
    number: '1',
    icon: Phone,
    title: 'Bizi Arayın',
    text: '0541 377 01 72 numarasından bize ulaşın.',
  },
  {
    number: '2',
    icon: MapPin,
    title: 'Konumunuzu Bildirin',
    text: 'Bulunduğunuz konumu ve aracınızın durumunu paylaşın.',
  },
  {
    number: '3',
    icon: Truck,
    title: 'Ekibimiz Yanınıza Gelsin',
    text: 'Profesyonel ekibimiz en kısa sürede bulunduğunuz noktaya yönlendirilsin.',
  },
]

export function Process() {
  return (
    <section className="bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Hizmet Süreci
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Nasıl Hizmet Alabilirsiniz?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              data-reveal
              style={{ '--delay': `${index * 180}ms` } as React.CSSProperties}
              className="group relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                <step.icon
                  className="size-7 text-accent-brand"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-5 flex size-8 items-center justify-center rounded-full bg-accent-brand font-heading text-sm font-extrabold text-accent-brand-foreground">
                {step.number}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
