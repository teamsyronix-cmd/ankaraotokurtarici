import { MapPin } from 'lucide-react'
import { DISTRICTS } from '@/lib/site'

export function ServiceAreas() {
  return (
    <section id="bolgeler" className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            Hizmet Bölgelerimiz
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Ankara’nın Tüm İlçelerine Hizmet Veriyoruz
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Ankara’nın tüm ilçelerinde oto çekici, oto kurtarma ve yol yardım
            hizmeti sunuyoruz.
          </p>
        </div>

        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {DISTRICTS.map((district, index) => (
            <li
              key={district}
              data-reveal="zoom"
              style={{ '--delay': `${index * 35}ms` } as React.CSSProperties}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent-brand/50 hover:bg-accent-brand/10"
            >
              <MapPin
                className="size-4 text-accent-brand transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              {district}
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-12 text-center font-heading text-xl font-bold text-foreground text-balance sm:text-2xl">
          Ankara’nın neresinde olursanız olun, bir telefon kadar yakınız.
        </p>
      </div>
    </section>
  )
}
