'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  ExternalLink,
  FileText,
  Globe2,
  Images,
  LogOut,
  Megaphone,
  MapPin,
  MousePointerClick,
  Phone,
  Smartphone,
  Truck,
  Users,
} from 'lucide-react'
import {
  getAdsReport,
  getAnalyticsSnapshot,
  type AnalyticsSnapshot,
  type Bucket,
  type RangeKey,
  type Totals,
} from '@/lib/analytics'
import type { CampaignSettings } from '@/lib/ads-config'
import { cn } from '@/lib/utils'
import { logout } from '@/app/admin/actions'
import { AdsCard } from './ads-card'
import {
  AnimatedNumber,
  AreaChart,
  BarList,
  Sparkline,
  formatNumber,
  type ChartPoint,
} from './charts'

const REFRESH_MS = 5_000
const TZ = 'Europe/Istanbul'

const RANGES: { key: RangeKey; label: string; short: string; previous: string }[] = [
  { key: '24h', label: 'Son 24 Saat', short: '24 saat', previous: 'önceki 24 saate göre' },
  { key: '7d', label: 'Son 7 Gün', short: '7 gün', previous: 'önceki 7 güne göre' },
  { key: '30d', label: 'Son 30 Gün', short: '30 gün', previous: 'önceki 30 güne göre' },
]

type MetricKey = 'sessions' | 'users' | 'views' | 'calls'
const METRICS: { key: MetricKey; label: string }[] = [
  { key: 'sessions', label: 'Giriş' },
  { key: 'users', label: 'Ziyaretçi' },
  { key: 'views', label: 'Sayfa Görüntüleme' },
  { key: 'calls', label: 'Arama Tıklaması' },
]

const timeFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})
const hourFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
})
const dayFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  day: 'numeric',
  month: 'short',
})
const weekdayFmt = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, weekday: 'short' })
const fullDayFmt = new Intl.DateTimeFormat('tr-TR', {
  timeZone: TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function change(current: number, previous: number) {
  if (!previous) return 0
  return ((current - previous) / previous) * 100
}

function formatDuration(sec: number) {
  const s = Math.round(sec)
  return `${Math.floor(s / 60)} dk ${String(s % 60).padStart(2, '0')} sn`
}

function toPoints(key: RangeKey, buckets: Bucket[], metric: MetricKey): ChartPoint[] {
  return buckets.map((b) => {
    const value = b.totals[metric]
    if (key === '24h') {
      return {
        label: hourFmt.format(b.start),
        tooltipLabel: `${hourFmt.format(b.start)} – ${hourFmt.format(b.start + 3_600_000)}`,
        value,
      }
    }
    return {
      label: key === '7d' ? weekdayFmt.format(b.start) : dayFmt.format(b.start),
      tooltipLabel: fullDayFmt.format(b.start),
      value,
    }
  })
}

export function AnalyticsDashboard({
  username,
  initialNow,
  initialSnapshot,
  campaigns,
}: {
  username: string
  initialNow: number
  initialSnapshot: AnalyticsSnapshot
  campaigns: CampaignSettings[]
}) {
  const [now, setNow] = useState(initialNow)
  const [range, setRange] = useState<RangeKey>('7d')
  const [metric, setMetric] = useState<MetricKey>('sessions')

  useEffect(() => {
    const refresh = () => setNow(Date.now())
    const id = window.setInterval(refresh, REFRESH_MS)
    const onVisible = () => document.visibilityState === 'visible' && refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const snapshot = useMemo(
    () => (now === initialNow ? initialSnapshot : getAnalyticsSnapshot(now)),
    [now, initialNow, initialSnapshot],
  )

  const ads = useMemo(() => getAdsReport(campaigns, initialNow), [campaigns, initialNow])
  const report = snapshot.ranges[range]
  const rangeMeta = RANGES.find((r) => r.key === range)!
  const metricMeta = METRICS.find((m) => m.key === metric)!
  const points = toPoints(range, report.buckets, metric)

  return (
    <div className="pb-16">
      {/* Üst bar */}
      <header className="animate-slide-down sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Truck className="size-5 text-accent-brand" aria-hidden="true" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-heading text-sm font-extrabold tracking-tight text-primary sm:text-base">
                ANKARA OTO KURTARMA
              </p>
              <p className="truncate text-xs text-muted-foreground">Yönetim Paneli</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
              </span>
              Canlı · {timeFmt.format(snapshot.generatedAt)}
            </span>
            <a
              href="/admin/reklam"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Megaphone className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reklam Ayarları</span>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            >
              Siteyi Gör
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 lg:px-6">
        <div
          className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Hoş geldiniz, {username}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Site Analizi
            </h1>
          </div>

          {/* Zaman aralığı filtresi */}
          <div
            role="tablist"
            aria-label="Zaman aralığı"
            className="inline-flex w-full rounded-xl border border-border bg-card p-1 shadow-sm sm:w-auto"
          >
            {RANGES.map((r) => (
              <button
                key={r.key}
                role="tab"
                type="button"
                aria-selected={range === r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:flex-none',
                  range === r.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dönem kartları + gerçek zamanlı */}
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {RANGES.map((r, index) => {
            const rep = snapshot.ranges[r.key]
            const delta = change(rep.totals.sessions, rep.previous.sessions)
            const active = range === r.key
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                aria-pressed={active}
                style={{ '--delay': `${80 + index * 80}ms` } as React.CSSProperties}
                className={cn(
                  'animate-fade-up group rounded-2xl border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
                  active ? 'border-primary ring-2 ring-primary/15' : 'border-border',
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">{r.label}</p>
                  <DeltaBadge value={delta} />
                </div>
                <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                  <AnimatedNumber value={rep.totals.sessions} />
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  giriş ·{' '}
                  <AnimatedNumber
                    value={rep.totals.users}
                    className="font-semibold text-foreground"
                  />{' '}
                  ziyaretçi
                </p>
                <Sparkline
                  values={rep.buckets.map((b) => b.totals.sessions)}
                  className="mt-4"
                />
                <p className="mt-2 text-xs text-muted-foreground">{r.previous}</p>
              </button>
            )
          })}

          <RealtimeCard snapshot={snapshot} />
        </section>

        {/* Trend grafiği */}
        <section
          className="animate-fade-up mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          style={{ '--delay': '400ms' } as React.CSSProperties}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                {metricMeta.label} Trendi
              </h2>
              <p className="text-sm text-muted-foreground">
                {rangeMeta.label} ·{' '}
                {range === '24h' ? 'saatlik' : 'günlük'} ·{' '}
                toplam{' '}
                <span className="font-semibold text-foreground tabular-nums">
                  {formatNumber(report.totals[metric])}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={metric === m.key}
                  onClick={() => setMetric(m.key)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    metric === m.key
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 -mx-1 overflow-hidden">
            <AreaChart
              key={`${range}-${metric}`}
              points={points}
              valueLabel={metricMeta.label}
              tickEvery={range === '24h' ? 4 : range === '7d' ? 1 : 5}
            />
          </div>
        </section>

        {/* Dönem metrikleri */}
        <section className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <KpiTile
            icon={FileText}
            label="Sayfa Görüntüleme"
            value={report.totals.views}
            previous={report.previous.views}
            index={0}
          />
          <KpiTile
            icon={Phone}
            label="Arama Butonu Tıklaması"
            value={report.totals.calls}
            previous={report.previous.calls}
            index={1}
          />
          <KpiTile
            icon={MousePointerClick}
            label="Form Gönderimi"
            value={report.totals.forms}
            previous={report.previous.forms}
            index={2}
          />
          <KpiTile
            icon={Clock}
            label="Ort. Etkileşim Süresi"
            value={report.totals.avgEngagement}
            previous={report.previous.avgEngagement}
            format={formatDuration}
            index={3}
          />
          <KpiTile
            icon={BarChart3}
            label="Etkileşim Oranı"
            value={report.totals.engagedRate * 100}
            previous={report.previous.engagedRate * 100}
            format={(v) => `%${v.toFixed(1).replace('.', ',')}`}
            index={4}
            className="col-span-2 lg:col-span-1"
          />
        </section>

        <AdsCard report={ads} />

        {/* Kırılımlar */}
        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <BreakdownCard icon={Globe2} title="Trafik Kaynakları" index={0}>
            <BarList items={report.sources} />
          </BreakdownCard>
          <BreakdownCard icon={Smartphone} title="Cihazlar" index={1}>
            <BarList items={report.devices} />
          </BreakdownCard>
          <BreakdownCard icon={MapPin} title="Şehirler" index={2}>
            <BarList items={report.cities} />
          </BreakdownCard>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <EventsCard totals={report.totals} label={rangeMeta.short} />
          <DailyTable report={snapshot.ranges['7d'].buckets} />
        </section>

        
      </main>
    </div>
  )
}

function DeltaBadge({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
        up ? 'bg-emerald-600/10 text-emerald-700' : 'bg-red-600/10 text-red-700',
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{up ? 'artış' : 'düşüş'}</span>%
      {Math.abs(value).toFixed(1).replace('.', ',')}
    </span>
  )
}

function RealtimeCard({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const max = Math.max(1, ...snapshot.activeByMinute)
  return (
    <div
      className="animate-fade-up rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm"
      style={{ '--delay': '320ms' } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary-foreground/70">Şu Anda Sitede</p>
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-brand opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-accent-brand" />
        </span>
      </div>
      <p className="mt-3 flex items-baseline gap-2 font-heading text-3xl font-extrabold tracking-tight">
        <AnimatedNumber value={snapshot.activeNow} className="text-accent-brand" />
        <span className="font-sans text-sm font-medium text-primary-foreground/70">
          aktif kullanıcı
        </span>
      </p>
      <div
        className="mt-4 flex h-12 items-end gap-[2px]"
        role="img"
        aria-label="Son 30 dakikada dakika başına kullanıcı"
      >
        {snapshot.activeByMinute.map((v, i) => (
          <span
            key={i}
            title={`${30 - i} dk önce: ${v} kullanıcı`}
            className="flex-1 rounded-t-[3px] bg-accent-brand/80 transition-[height] duration-700 hover:bg-accent-brand"
            style={{ height: `${Math.max(6, (v / max) * 100)}%`, opacity: v ? 1 : 0.25 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-primary-foreground/60">
        <span>30 dk önce</span>
        <span>şimdi</span>
      </div>
    </div>
  )
}

function KpiTile({
  icon: Icon,
  label,
  value,
  previous,
  format,
  index,
  className,
}: {
  icon: React.ElementType
  label: string
  value: number
  previous: number
  format?: (v: number) => string
  index: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
      style={{ '--delay': `${480 + index * 60}ms` } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        <p className="truncate text-xs font-semibold">{label}</p>
      </div>
      <p className="mt-2 font-heading text-xl font-extrabold tracking-tight text-foreground">
        <AnimatedNumber value={value} format={format} />
      </p>
      <div className="mt-1.5">
        <DeltaBadge value={change(value, previous)} />
      </div>
    </div>
  )
}

function BreakdownCard({
  icon: Icon,
  title,
  index,
  children,
}: {
  icon: React.ElementType
  title: string
  index: number
  children: React.ReactNode
}) {
  return (
    <div
      className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
      style={{ '--delay': `${560 + index * 80}ms` } as React.CSSProperties}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent-brand/15 text-accent-brand-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function EventsCard({ totals, label }: { totals: Totals; label: string }) {
  const rows = [
    { icon: Users, label: 'Oturum başlatma', value: totals.sessions },
    { icon: FileText, label: 'Sayfa görüntüleme', value: totals.views },
    { icon: Phone, label: 'Telefon araması tıklaması', value: totals.calls },
    { icon: Images, label: 'Filo galerisi görüntüleme', value: totals.galleryOpens },
    { icon: MousePointerClick, label: 'İletişim formu gönderimi', value: totals.forms },
  ]
  return (
    <div
      className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
      style={{ '--delay': '720ms' } as React.CSSProperties}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-heading text-base font-bold text-foreground">Olaylar</h2>
        <span className="text-xs text-muted-foreground">Son {label}</span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3 py-2.5">
            <span className="flex items-center gap-2.5 text-sm text-foreground">
              <row.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              {row.label}
            </span>
            <AnimatedNumber
              value={row.value}
              className="text-sm font-semibold text-foreground"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function DailyTable({ report }: { report: Bucket[] }) {
  const rows = [...report].reverse()
  return (
    <div
      className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      style={{ '--delay': '780ms' } as React.CSSProperties}
    >
      <div className="flex items-baseline justify-between p-5 pb-3">
        <h2 className="font-heading text-base font-bold text-foreground">Günlük Özet</h2>
        <span className="text-xs text-muted-foreground">Son 7 gün</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border bg-muted/60 text-left text-xs text-muted-foreground">
              <th className="px-5 py-2 font-semibold">Gün</th>
              <th className="px-3 py-2 text-right font-semibold">Giriş</th>
              <th className="px-3 py-2 text-right font-semibold">Ziyaretçi</th>
              <th className="px-5 py-2 text-right font-semibold">Arama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((b, i) => (
              <tr key={b.start} className="transition-colors hover:bg-muted/50">
                <td className="px-5 py-2.5 text-foreground">
                  {i === 0 ? 'Bugün' : fullDayFmt.format(b.start)}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-foreground">
                  {formatNumber(b.totals.sessions)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                  {formatNumber(b.totals.users)}
                </td>
                <td className="px-5 py-2.5 text-right tabular-nums text-muted-foreground">
                  {formatNumber(b.totals.calls)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
