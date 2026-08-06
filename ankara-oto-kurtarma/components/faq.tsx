'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Ankara’nın her bölgesine hizmet veriyor musunuz?',
    a: 'Evet. Ankara’nın tüm ilçelerine oto çekici, oto kurtarma ve yol yardım hizmeti sunuyoruz.',
  },
  {
    q: '7/24 hizmet veriyor musunuz?',
    a: 'Evet. Günün her saatinde bize ulaşabilirsiniz.',
  },
  {
    q: 'Ne kadar sürede geliyorsunuz?',
    a: 'Ulaşım süresi bulunduğunuz konuma ve trafik yoğunluğuna göre değişmektedir. Konumunuzu paylaştığınızda tahmini süre hakkında bilgi verilir.',
  },
  {
    q: 'Aracım güvenli şekilde taşınır mı?',
    a: 'Evet. Araç taşıma işlemleri güvenli ve profesyonel şekilde gerçekleştirilir.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent-brand">
            S.S.S.
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-base font-bold text-foreground">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-accent-brand transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
