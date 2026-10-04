'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const numberFormat = new Intl.NumberFormat('tr-TR')

export function formatNumber(value: number) {
  return numberFormat.format(Math.round(value))
}

/** Değer değiştiğinde eskisinden yenisine sayarak geçer */
export function AnimatedNumber({
  value,
  format = formatNumber,
  duration = 900,
  className,
}: {
  value: number
  format?: (v: number) => string
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const [flash, setFlash] = useState(false)
  const fromRef = useRef(value)

  useEffect(() => {
    const from = fromRef.current
    if (from === value) return
    fromRef.current = value
    setFlash(true)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(value)
      return
    }

    let frame = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (value - from) * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const off = window.setTimeout(() => setFlash(false), 1200)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(off)
    }
  }, [value, duration])

  return (
    <span
      className={cn(
        'tabular-nums transition-colors duration-700',
        flash && 'text-emerald-600',
        className,
      )}
    >
      {format(display)}
    </span>
  )
}

/** Tek serili küçük çizgi grafik (kart içi eğilim) */
export function Sparkline({
  values,
  className,
}: {
  values: number[]
  className?: string
}) {
  const w = 120
  const h = 36
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? w / (values.length - 1) : w
  const points = values.map((v, i) => [i * step, h - 2 - (v / max) * (h - 4)])
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn('h-9 w-full', className)}
      aria-hidden="true"
    >
      <path d={area} className="fill-primary/10" />
      <path
        d={line}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export type ChartPoint = { label: string; tooltipLabel: string; value: number }

/** Crosshair + tooltip'li alan grafiği; genişliği kapsayıcıya göre ölçülür */
export function AreaChart({
  points,
  valueLabel,
  tickEvery,
}: {
  points: ChartPoint[]
  valueLabel: string
  tickEvery: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(640)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.max(280, entry.contentRect.width)),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const height = 260
  const pad = { top: 16, right: 12, bottom: 28, left: 44 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const rawMax = Math.max(1, ...points.map((p) => p.value))
  const niceMax = niceCeil(rawMax)
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f))

  const x = (i: number) =>
    pad.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : innerW / 2)
  const y = (v: number) => pad.top + innerH - (v / niceMax) * innerH

  const line = points
    .map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(points.length - 1)},${pad.top + innerH} L${x(0)},${pad.top + innerH} Z`

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = (e.clientX - rect.left) / rect.width
    const i = Math.round(rel * (points.length - 1))
    setHover(Math.max(0, Math.min(points.length - 1, i)))
  }

  const hp = hover !== null ? points[hover] : null
  const tooltipLeft = hover !== null ? x(hover) : 0
  const flip = tooltipLeft > width - 160

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      <svg
        width={width}
        height={height}
        className="block"
        role="img"
        aria-label={`${valueLabel} grafiği`}
      >
        {gridValues.map((v) => (
          <g key={v}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(v)}
              y2={y(v)}
              className="stroke-border"
              strokeDasharray={v === 0 ? undefined : '3 4'}
            />
            <text
              x={pad.left - 8}
              y={y(v)}
              dy="0.32em"
              textAnchor="end"
              className="fill-muted-foreground text-[11px] tabular-nums"
            >
              {formatNumber(v)}
            </text>
          </g>
        ))}

        {points.map((p, i) =>
          i % tickEvery === 0 || i === points.length - 1 ? (
            <text
              key={i}
              x={x(i)}
              y={height - 8}
              textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
              className="fill-muted-foreground text-[11px]"
            >
              {p.label}
            </text>
          ) : null,
        )}

        <path d={area} className="fill-primary/10 transition-[d] duration-700" />
        <path
          d={line}
          fill="none"
          className="stroke-primary transition-[d] duration-700"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hp && hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={pad.top}
              y2={pad.top + innerH}
              className="stroke-muted-foreground/50"
              strokeDasharray="3 3"
            />
            <circle
              cx={x(hover)}
              cy={y(hp.value)}
              r={5}
              className="fill-accent-brand stroke-card"
              strokeWidth={2}
            />
          </g>
        )}

        <rect
          x={pad.left}
          y={pad.top}
          width={innerW}
          height={innerH}
          fill="transparent"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hp && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg"
          style={{
            left: tooltipLeft,
            transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <p className="font-medium text-muted-foreground">{hp.tooltipLabel}</p>
          <p className="mt-0.5 font-heading text-sm font-bold text-foreground tabular-nums">
            {formatNumber(hp.value)}{' '}
            <span className="font-sans text-xs font-medium text-muted-foreground">
              {valueLabel.toLocaleLowerCase('tr-TR')}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

function niceCeil(v: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (m * pow >= v) return m * pow
  }
  return 10 * pow
}

/** Etiketli yatay çubuk listesi (kaynak, cihaz, şehir kırılımları) */
export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = (item.value / total) * 100
        return (
          <li
            key={item.label}
            className="group"
            title={`${item.label}: ${formatNumber(item.value)} (%${pct.toFixed(1)})`}
          >
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="tabular-nums text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {formatNumber(item.value)}
                </span>{' '}
                · %{pct.toFixed(1).replace('.', ',')}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out group-hover:bg-accent-brand"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
