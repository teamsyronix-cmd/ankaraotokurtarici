import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ArrowLeft, Info } from 'lucide-react'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Veri Detayları | Ankara Oto Kurtarma',
}

export default async function DetailsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/giris')

  return (
    <div className="pb-16">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 lg:px-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Site Analizine Dön
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-8 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent-brand/15 text-accent-brand-foreground">
            <Info className="size-5" aria-hidden="true" />
          </span>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Veri Detayları
          </h1>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground shadow-sm sm:p-6">
          <h2 className="font-heading text-base font-bold">Paneldeki veriler</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Site analizi ekranındaki ziyaretçi, giriş, sayfa görüntüleme, arama tıklaması,
              cihaz, şehir ve trafik kaynağı değerleri ortalama trafiğe göre üretilmiş örnek
              verilerdir.
            </li>
            <li>
              “Şu Anda Sitede” sayısı da aynı örnek trafikten hesaplanır.
            </li>
            <li>
              Reklam harcaması kartındaki kredi (8.000 ₺ yükleme + 8.000 ₺ bonus), harcama,
              tıklama, gösterim ve dönüşüm değerleri örnek verilerdir. Kampanya adları ve
              türleri Reklam Ayarları sayfasından gelir.
            </li>
            <li>
              Gerçek zamanlı GA4 ve Ads bağlantısı kurulduğunda tüm değerler gerçek verilerle
              değiştirilecektir.
            </li>
            <li>Saatler Türkiye saatine (UTC+3) göredir.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
