'use client'

import { useState } from 'react'
import { AlertTriangle, CalendarClock, Megaphone, Radio } from 'lucide-react'
import type { AdsReport } from '@/lib/analytics'
import { formatNumber } from './charts'

const TZ = 'Europe/Istanbul'
const money = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
})
const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const dateTimeFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})
const shortDay = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, day: 'numeric', month: 'short' })
const longDay = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const pct = (v: number) => `%${v.toFixed(2).replace('.', ',')}`

export function AdsCard({ report }: { report: AdsReport }) {
  const [hover, setHover] = useState<number | null>(null)
  const maxSpend = Math.max(1, ...report.days.map((d) => d.spend))
  const usedPct = report.credit ? (report.spent / report.credit) * 100 : 0
  const ended = !report.live && !report.scheduled
  const avg = (total: number, count: number) => (count ? total / count : 0)

  const stats = [
    { label: 'Tıklama', value: formatNumber(report.clicks) },
    { label: 'Gösterim', value: formatNumber(report.impressions) },
    { label: 'Tıklama Oranı', value: pct(avg(report.clicks, report.impressions) * 100) },
    { label: 'Ort. TBM', value: money.format(avg(report.spent, report.clicks)) },
    { label: 'Dönüşüm (Arama)', value: formatNumber(report.conversions) },
    { label: 'Dönüşüm Başı Maliyet', value: money.format(avg(report.spent, report.conversions)) },
  ]

  const hovered = hover !== null ? report.days[hover] : null

  return (
    <section
      className="animate-fade-up mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
      style={{ '--delay': '520ms' } as React.CSSProperties}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent-brand/15 text-accent-brand-foreground">
            <Megaphone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Reklam Harcaması
            </h2>
            <p className="text-sm text-muted-foreground">
              Google Ads · {dateFmt.format(report.startedAt)} –{' '}
              {dateFmt.format(report.depletedAt)}
            </p>
          </div>
        </div>
        {report.live ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Radio className="size-3.5" aria-hidden="true" />
            Reklamlar yayında
          </span>
        ) : report.scheduled ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            Planlandı · {dateTimeFmt.format(report.startedAt)}
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-700">
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            Bütçe tükendi · Reklamlar durdu
          </span>
        )}
      </div>

      {/* Kredi durumu */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Toplam Kredi</p>
          <p className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
            {money.format(report.credit)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            {money.format(report.deposit)} yükleme + {money.format(report.bonus)} Google bonusu
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Harcanan</p>
          <p className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
            {money.format(report.spent)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Kalan Bakiye</p>
          <p
            className={`mt-1 font-heading text-2xl font-extrabold tracking-tight tabular-nums ${
              ended ? 'text-red-700' : 'text-foreground'
            }`}
          >
            {money.format(report.remaining)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div
          className="h-3 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(usedPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kredi kullanımı"
        >
          <div
            className="h-full origin-left animate-in slide-in-from-left rounded-full bg-primary duration-1000"
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Kredinin{' '}
            <span className="font-semibold text-foreground">
              %{Math.round(usedPct)}
            </span>{' '}
            kullanıldı
          </span>
          <span>
            {ended ? 'Son harcama' : 'Planlanan bitiş'}: {dateTimeFmt.format(report.depletedAt)} ·{' '}
            {report.days.length} gün · günlük ort.{' '}
            {money.format(avg(report.spent, report.days.length))}
          </span>
        </div>
      </div>

      {/* Performans */}
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/60 px-3 py-2.5">
            <dt className="truncate text-xs font-medium text-muted-foreground">{s.label}</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-foreground tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Günlük harcama */}
        <div className="lg:col-span-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold text-foreground">Günlük Harcama</h3>
            <p className="h-4 text-xs text-muted-foreground tabular-nums">
              {hovered
                ? `${longDay.format(hovered.start)} · ${money.format(hovered.spend)} · ${formatNumber(hovered.clicks)} tıklama`
                : 'Detay için çubukların üzerine gelin'}
            </p>
          </div>
          {report.days.length === 0 ? (
            <p className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              Yayın başladığında günlük harcama burada görünecek
            </p>
          ) : (
          <>
          <div
            className="mt-3 flex h-40 items-end gap-[2px]"
            onPointerLeave={() => setHover(null)}
          >
            {report.days.map((d, i) => (
              <button
                key={d.start}
                type="button"
                aria-label={`${longDay.format(d.start)}: ${money.format(d.spend)}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group flex h-full flex-1 items-end outline-none"
              >
                <span
                  className={`w-full rounded-t-[4px] transition-colors ${
                    hover === i ? 'bg-accent-brand' : 'bg-primary group-focus-visible:bg-accent-brand'
                  }`}
                  style={{ height: `${(d.spend / maxSpend) * 100}%` }}
                />
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-1.5 text-[11px] text-muted-foreground">
            <span>{shortDay.format(report.days[0].start)}</span>
            <span>{shortDay.format(report.days[report.days.length - 1].start)}</span>
          </div>
          </>
          )}
        </div>

        {/* Kampanyalar */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-foreground">Kampanyalar</h3>
          <ul className="mt-3 divide-y divide-border">
            {report.campaigns.map((c, i) => (
              <li key={`${i}-${c.name}`} className="py-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-foreground">{c.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                    {money.format(c.spend)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {formatNumber(c.clicks)} tıklama · {formatNumber(c.impressions)} gösterim ·{' '}
                  {formatNumber(c.conversions)} dönüşüm
                </p>
                <p className="mt-1 text-[11px] font-medium">
                  <span className="text-muted-foreground">{c.typeLabel} · </span>
                  {!c.enabled ? (
                    <span className="text-muted-foreground">Duraklatıldı</span>
                  ) : report.live ? (
                    <span className="text-emerald-700">Yayında</span>
                  ) : report.scheduled ? (
                    <span className="text-amber-700">Planlandı</span>
                  ) : (
                    <span className="text-red-700">Durduruldu · bütçe yok</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {ended && (
      <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <span>
          Reklam krediniz {dateTimeFmt.format(report.depletedAt)} itibarıyla tükendi. Bu
          tarihten sonra reklamlarınız gösterilmiyor ve ücretli arama trafiği durdu.
          Kampanyaların yeniden yayına girmesi için hesaba bakiye yüklenmesi gerekir.
        </span>
      </p>
      )}
    </section>
  )
}
