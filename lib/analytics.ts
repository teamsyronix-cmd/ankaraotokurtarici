/**
 * Yönetim paneli için sentetik trafik verisi.
 *
 * Gerçek bir veri kaynağı yoktur: tüm değerler zamana bağlı, seed'li bir
 * fonksiyondan üretilir. Aynı an için sunucuda, tarayıcıda ve farklı
 * cihazlarda hep aynı sayı çıkar; zaman ilerledikçe veriler kendiliğinden
 * artar. Saatlik değerler günlük toplamların, günlükler de 7/30 günlük
 * toplamların parçası olduğu için tüm kartlar birbiriyle tutarlıdır.
 *
 * Gerçek GA4 verisine geçilirken yalnızca getAnalyticsSnapshot() yerine
 * GA4 Data API çağrısı yazmak yeterlidir; dönen yapı aynı kalabilir.
 */

import {
  CAMPAIGN_TYPES,
  DEFAULT_CAMPAIGNS,
  type CampaignSettings,
} from './ads-config'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
/** Europe/Istanbul (UTC+3, yaz saati uygulaması yok) */
const TZ_OFFSET = 3 * HOUR

/** Ortalama günlük ziyaretçi (hafta içi, trend uygulanmadan önce) */
const BASE_DAILY_USERS = 240
/** Trend başlangıcı: 2026-09-01 (yerel gün indeksi) */
const TREND_ANCHOR_DAY = Math.floor((Date.UTC(2026, 8, 1) + TZ_OFFSET) / DAY)

/**
 * Google Ads bütçesi: 8.000 ₺ yüklendi, Google 8.000 ₺ bonus tanımladı;
 * toplam 16.000 ₺'nin tamamı harcandı. Reklamlar yalnızca yayın aralığında
 * ücretli trafik getirir; bütçe bitince "Ücretli Arama" kaynağı sıfırlanır.
 * Kampanya ayarları (tür, hedef, anahtar kelimeler…) lib/ads-config.ts'de
 * tanımlı ve /admin/reklam panelinden düzenlenir.
 */
const ADS_BUDGET = {
  deposit: 8000,
  bonus: 8000,
  /** 28 Ağustos 2026 09:30 (TR) */
  start: Date.UTC(2026, 7, 28, 9, 30) - TZ_OFFSET,
  /** 23 Eylül 2026 16:42 (TR) — bütçe tükendi */
  end: Date.UTC(2026, 8, 23, 16, 42) - TZ_OFFSET,
  /** Ortalama tıklama başı maliyet (₺) */
  cpc: 7.67,
  /** Tıklama oranı */
  ctr: 0.0684,
  /** Tıklamadan aramaya dönüşüm */
  conversionRate: 0.078,
}
/** Canlı kullanıcı üst sınırı: reklam yokken / reklam yayındayken */
const ACTIVE_CAP_IDLE = 3
const ACTIVE_CAP_ADS = 12
/** Aynı kişi reklama birden fazla tıklayabildiği için tıklama / ücretli ziyaretçi */
const CLICKS_PER_PAID_USER = 1.09

// Oto kurtarma sitesi: gece düşük, sabah trafiği ve akşam iş çıkışı zirve
const HOUR_WEIGHTS = [
  0.9, 0.7, 0.55, 0.45, 0.4, 0.5, 0.9, 1.6, 2.3, 2.4, 2.2, 2.1, 2.2, 2.1, 2.0,
  2.2, 2.5, 2.8, 2.9, 2.6, 2.2, 1.8, 1.5, 1.2,
]
const HOUR_WEIGHT_SUM = HOUR_WEIGHTS.reduce((a, b) => a + b, 0)

// 0 = Pazar. Hafta sonu yolculuk artar.
const WEEKDAY_FACTOR = [1.12, 0.95, 0.93, 0.95, 0.98, 1.08, 1.15]

/** Tam sayı girdiden [0, 1) aralığında deterministik değer */
function hash(n: number, salt: number): number {
  let x = (Math.imul(n | 0, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca77)) >>> 0
  x ^= x >>> 16
  x = Math.imul(x, 0x7feb352d)
  x ^= x >>> 15
  x = Math.imul(x, 0x846ca68b)
  x ^= x >>> 16
  return (x >>> 0) / 4294967296
}

/** Yumuşak değişen gürültü (günden güne ani sıçrama olmasın) */
function smoothNoise(t: number, salt: number): number {
  const i = Math.floor(t)
  const f = t - i
  const u = (1 - Math.cos(f * Math.PI)) / 2
  return hash(i, salt) * (1 - u) + hash(i + 1, salt) * u
}

const localDayIndex = (ms: number) => Math.floor((ms + TZ_OFFSET) / DAY)
const localHourOfDay = (hourIndex: number) =>
  ((hourIndex + 3) % 24 + 24) % 24
/** Yerel günün başlangıcı (UTC ms) */
const dayStartMs = (dayIndex: number) => dayIndex * DAY - TZ_OFFSET

function dayLevel(dayIndex: number): number {
  const weekday = ((dayIndex + 4) % 7 + 7) % 7 // 1970-01-01 Perşembe
  const drift = 1 + (smoothNoise(dayIndex / 6, 11) - 0.5) * 0.36
  const trend = 1 + Math.max(-0.3, (dayIndex - TREND_ANCHOR_DAY) * 0.0012)
  return BASE_DAILY_USERS * WEEKDAY_FACTOR[weekday] * drift * trend
}

type HourStats = {
  users: number
  paidUsers: number
  sessions: number
  views: number
  calls: number
  forms: number
  galleryOpens: number
  engagementSec: number
  engagedRate: number
}

/** Saatin organik ziyaretçisi (reklamdan bağımsız) */
function organicUsers(hourIndex: number): number {
  const day = Math.floor((hourIndex * HOUR + TZ_OFFSET) / DAY)
  const weight = HOUR_WEIGHTS[localHourOfDay(hourIndex)] / HOUR_WEIGHT_SUM
  return dayLevel(day) * weight * (0.8 + 0.4 * hash(hourIndex, 3))
}

/** Reklam oranı 1 iken saatin ücretli ziyaretçisi */
function paidBase(hourIndex: number, start: number, end: number): number {
  const hourStart = hourIndex * HOUR
  // Reklamın bu saatte açık olduğu süre oranı
  const adsOn =
    Math.max(0, Math.min(hourStart + HOUR, end) - Math.max(hourStart, start)) / HOUR
  if (!adsOn) return 0
  return organicUsers(hourIndex) * adsOn * (0.75 + 0.5 * hash(hourIndex, 27))
}

/** Bütçe / TBM kadar tıklama çıkacak şekilde ücretli trafik ölçeklenir */
function buildAds() {
  const { start, end, deposit, bonus, cpc } = ADS_BUDGET
  const credit = deposit + bonus
  let base = 0
  for (let h = Math.floor(start / HOUR); h * HOUR < end; h++) base += paidBase(h, start, end)
  const targetPaid = credit / cpc / CLICKS_PER_PAID_USER
  return { start, end, credit, paidRatio: base ? targetPaid / base : 0 }
}

const ads = buildAds()
const hourCache = new Map<number, HourStats>()

/** Belirli bir saatin (UTC saat indeksi) tam değerleri */
function hourStats(hourIndex: number): HourStats {
  const cached = hourCache.get(hourIndex)
  if (cached) return cached

  const organic = organicUsers(hourIndex)
  const paidUsers = paidBase(hourIndex, ads.start, ads.end) * ads.paidRatio
  const users = organic + paidUsers
  const sessions = users * (1.16 + 0.14 * hash(hourIndex, 5))
  const views = sessions * (1.8 + 0.6 * hash(hourIndex, 7))
  const calls = users * (0.055 + 0.035 * hash(hourIndex, 9))

  const stats: HourStats = {
    users,
    paidUsers,
    sessions,
    views,
    calls,
    forms: calls * (0.12 + 0.1 * hash(hourIndex, 15)),
    galleryOpens: users * (0.1 + 0.08 * hash(hourIndex, 17)),
    engagementSec: 62 + 48 * hash(hourIndex, 13),
    engagedRate: 0.56 + 0.12 * hash(hourIndex, 19),
  }

  if (hourCache.size > 5000) hourCache.clear()
  hourCache.set(hourIndex, stats)
  return stats
}

export type Totals = {
  users: number
  paidUsers: number
  sessions: number
  views: number
  calls: number
  forms: number
  galleryOpens: number
  /** saniye */
  avgEngagement: number
  /** 0-1 */
  engagedRate: number
}

/** [start, end) aralığının toplamları; saat içindeki kısmi dilimler orantılanır */
function totalsBetween(start: number, end: number): Totals {
  const acc = {
    users: 0,
    paidUsers: 0,
    sessions: 0,
    views: 0,
    calls: 0,
    forms: 0,
    galleryOpens: 0,
    engagementWeighted: 0,
    engagedWeighted: 0,
  }
  if (end > start) {
    for (let h = Math.floor(start / HOUR); h * HOUR < end; h++) {
      const from = Math.max(start, h * HOUR)
      const to = Math.min(end, (h + 1) * HOUR)
      const part = (to - from) / HOUR
      const s = hourStats(h)
      acc.users += s.users * part
      acc.paidUsers += s.paidUsers * part
      acc.sessions += s.sessions * part
      acc.views += s.views * part
      acc.calls += s.calls * part
      acc.forms += s.forms * part
      acc.galleryOpens += s.galleryOpens * part
      acc.engagementWeighted += s.engagementSec * s.sessions * part
      acc.engagedWeighted += s.engagedRate * s.sessions * part
    }
  }
  return {
    users: Math.floor(acc.users),
    // Ücretli, toplamdan büyük olamasın
    paidUsers: Math.min(Math.floor(acc.users), Math.round(acc.paidUsers)),
    sessions: Math.floor(acc.sessions),
    views: Math.floor(acc.views),
    calls: Math.floor(acc.calls),
    forms: Math.floor(acc.forms),
    galleryOpens: Math.floor(acc.galleryOpens),
    avgEngagement: acc.sessions ? acc.engagementWeighted / acc.sessions : 0,
    engagedRate: acc.sessions ? acc.engagedWeighted / acc.sessions : 0,
  }
}

function sumTotals(list: Totals[]): Totals {
  const sessions = list.reduce((a, t) => a + t.sessions, 0)
  const weighted = (key: 'avgEngagement' | 'engagedRate') =>
    sessions ? list.reduce((a, t) => a + t[key] * t.sessions, 0) / sessions : 0
  return {
    users: list.reduce((a, t) => a + t.users, 0),
    paidUsers: list.reduce((a, t) => a + t.paidUsers, 0),
    sessions,
    views: list.reduce((a, t) => a + t.views, 0),
    calls: list.reduce((a, t) => a + t.calls, 0),
    forms: list.reduce((a, t) => a + t.forms, 0),
    galleryOpens: list.reduce((a, t) => a + t.galleryOpens, 0),
    avgEngagement: weighted('avgEngagement'),
    engagedRate: weighted('engagedRate'),
  }
}

export type RangeKey = '24h' | '7d' | '30d'

export type Bucket = { start: number; end: number; totals: Totals }

export type Share = { label: string; value: number }

export type RangeReport = {
  key: RangeKey
  totals: Totals
  previous: Totals
  buckets: Bucket[]
  sources: Share[]
  devices: Share[]
  cities: Share[]
}

function bucketsFor(key: RangeKey, now: number, shift = 0): Bucket[] {
  const end = now - shift
  const buckets: Bucket[] = []
  if (key === '24h') {
    const currentHour = Math.floor(end / HOUR) * HOUR
    for (let i = 23; i >= 0; i--) {
      const start = currentHour - i * HOUR
      const bEnd = Math.min(start + HOUR, end)
      buckets.push({ start, end: bEnd, totals: totalsBetween(start, bEnd) })
    }
  } else {
    const days = key === '7d' ? 7 : 30
    const today = localDayIndex(end)
    for (let i = days - 1; i >= 0; i--) {
      const start = dayStartMs(today - i)
      const bEnd = Math.min(start + DAY, end)
      buckets.push({ start, end: bEnd, totals: totalsBetween(start, bEnd) })
    }
  }
  return buckets
}

/** Toplamı bozmadan paylara böler (en büyük kalan yöntemi) */
function allocate(
  total: number,
  base: { label: string; weight: number }[],
  seed: number,
  salt: number,
): Share[] {
  const jittered = base.map((b, i) => ({
    label: b.label,
    weight: b.weight * (0.9 + 0.2 * smoothNoise(seed / 3 + i * 7.3, salt)),
  }))
  const sum = jittered.reduce((a, b) => a + b.weight, 0)
  const raw = jittered.map((b) => (b.weight / sum) * total)
  const floors = raw.map(Math.floor)
  let remaining = total - floors.reduce((a, b) => a + b, 0)
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
  for (const { i } of order) {
    if (remaining <= 0) break
    floors[i]++
    remaining--
  }
  return jittered.map((b, i) => ({ label: b.label, value: floors[i] }))
}

const SOURCES = [
  { label: 'Organik Arama', weight: 0.46 },
  { label: 'Doğrudan', weight: 0.22 },
  { label: 'Google Haritalar', weight: 0.1 },
  { label: 'Sosyal Medya', weight: 0.05 },
]

const DEVICES = [
  { label: 'Mobil', weight: 0.81 },
  { label: 'Masaüstü', weight: 0.16 },
  { label: 'Tablet', weight: 0.03 },
]

const CITIES = [
  { label: 'Ankara', weight: 0.84 },
  { label: 'İstanbul', weight: 0.04 },
  { label: 'Kırıkkale', weight: 0.03 },
  { label: 'Konya', weight: 0.025 },
  { label: 'Eskişehir', weight: 0.02 },
  { label: 'Diğer', weight: 0.045 },
]

const SHIFT: Record<RangeKey, number> = { '24h': DAY, '7d': 7 * DAY, '30d': 30 * DAY }

function rangeReport(key: RangeKey, now: number): RangeReport {
  const buckets = bucketsFor(key, now)
  const totals = sumTotals(buckets.map((b) => b.totals))
  const previous = sumTotals(bucketsFor(key, now, SHIFT[key]).map((b) => b.totals))
  const seed = localDayIndex(now) + (key === '24h' ? 0 : key === '7d' ? 100 : 200)
  const sortDesc = (list: Share[]) =>
    list.sort((a, b) => (a.label === 'Diğer' ? 1 : b.label === 'Diğer' ? -1 : b.value - a.value))
  return {
    key,
    totals,
    previous,
    buckets,
    sources: sortDesc([
      ...allocate(totals.users - totals.paidUsers, SOURCES, seed, 21),
      { label: 'Ücretli Arama', value: totals.paidUsers },
    ]),
    devices: sortDesc(allocate(totals.users, DEVICES, seed, 23)),
    cities: sortDesc(allocate(totals.users, CITIES, seed, 25)),
  }
}

export type AnalyticsSnapshot = {
  generatedAt: number
  /** Şu anda sitede olan kullanıcı (reklamsız dönemde çoğunlukla 0, en fazla 3) */
  activeNow: number
  /** Son 30 dakikanın dakikalık kullanıcıları, eskiden yeniye */
  activeByMinute: number[]
  ranges: Record<RangeKey, RangeReport>
}

export function getAnalyticsSnapshot(now: number = Date.now()): AnalyticsSnapshot {
  // Her dakikanın ziyaretçileri dakika içinde deterministik bir saniyede gelir
  // ve 30 sn – 3 dk arası sitede kalır. "Şu anda" sayısı, girişi geçmiş ama
  // henüz çıkmamış ziyaretçilerdir; saatlik trafikle tutarlı olarak reklamsız
  // dönemde çoğunlukla 0, ara sıra 1-2 çıkar.
  const adsLive = now >= ads.start && now < ads.end
  const minuteNow = Math.floor(now / MINUTE)
  const activeByMinute: number[] = []
  let activeNow = 0
  for (let i = 30; i >= 0; i--) {
    const m = minuteNow - i
    const s = hourStats(Math.floor((m * MINUTE) / HOUR))
    const rate = (s.users / 60) * (0.6 + 0.8 * hash(m, 31))
    const arrivals = Math.floor(rate + hash(m, 33))
    let inMinute = 0
    for (let k = 0; k < arrivals; k++) {
      const t = m * MINUTE + hash(m * 8 + k, 35) * MINUTE
      if (t > now) continue
      inMinute++
      const stay = 30_000 + hash(m * 8 + k, 39) * 150_000
      if (t + stay > now) activeNow++
    }
    if (i < 30) activeByMinute.push(inMinute)
  }
  activeNow = Math.min(adsLive ? ACTIVE_CAP_ADS : ACTIVE_CAP_IDLE, activeNow)

  return {
    generatedAt: now,
    activeNow,
    activeByMinute,
    ranges: {
      '24h': rangeReport('24h', now),
      '7d': rangeReport('7d', now),
      '30d': rangeReport('30d', now),
    },
  }
}

export type AdsDay = { start: number; spend: number; clicks: number }

export type AdsCampaign = {
  name: string
  typeLabel: string
  enabled: boolean
  spend: number
  clicks: number
  impressions: number
  conversions: number
}

export type AdsReport = {
  /** Yüklenen tutar */
  deposit: number
  /** Google Ads promosyon kredisi */
  bonus: number
  /** deposit + bonus */
  credit: number
  spent: number
  remaining: number
  /** Reklamlar şu anda yayında */
  live: boolean
  /** Yayın henüz başlamadı */
  scheduled: boolean
  startedAt: number
  /** Bütçenin tükendiği / tükeneceği an */
  depletedAt: number
  clicks: number
  impressions: number
  conversions: number
  days: AdsDay[]
  campaigns: AdsCampaign[]
}

/** Metinden sabit bir tam sayı (kampanya adına göre deterministik sapma için) */
function nameSeed(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193)
  return h
}

/** Kuruş hassasiyetinde, toplamı koruyarak paylaştırır */
function splitExact(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1
  const raw = weights.map((w) => (w / sum) * total)
  const out = raw.map(Math.floor)
  let rest = total - out.reduce((a, b) => a + b, 0)
  raw
    .map((r, i) => ({ i, f: r - Math.floor(r) }))
    .sort((a, b) => b.f - a.f)
    .forEach(({ i }) => {
      if (rest > 0) {
        out[i]++
        rest--
      }
    })
  return out
}

/**
 * Reklam raporu. Bütçe, yayın süresince ücretli trafikle orantılı harcanır;
 * yayın sürüyorsa yalnızca "now" anına kadarki kısım harcanmış görünür.
 */
export function getAdsReport(
  campaigns: CampaignSettings[] = DEFAULT_CAMPAIGNS,
  now: number = Date.now(),
): AdsReport {
  const { start, end, credit } = ads
  const cutoff = Math.min(end, Math.max(start, now))

  // Tüm dönemin ücretli ziyaretçisi (harcanan oranı bulmak için)
  let paidTotal = 0
  for (let h = Math.floor(start / HOUR); h * HOUR < end; h++) paidTotal += hourStats(h).paidUsers

  const dayStarts: number[] = []
  const paid: number[] = []
  if (cutoff > start) {
    for (let d = localDayIndex(start); d <= localDayIndex(cutoff - 1); d++) {
      const dStart = dayStartMs(d)
      dayStarts.push(dStart)
      paid.push(totalsBetween(Math.max(dStart, start), Math.min(dStart + DAY, cutoff)).paidUsers)
    }
  }
  const paidSoFar = paid.reduce((a, b) => a + b, 0)
  const ratio = cutoff >= end ? 1 : paidTotal ? Math.min(1, paidSoFar / paidTotal) : 0
  const spentKurus = Math.round(credit * 100 * ratio)

  // Boş gün kalmasın diye her güne küçük bir taban ağırlık
  const dayWeights = paid.map((p) => p + 0.5)
  const totalClicks = Math.round(paidSoFar * CLICKS_PER_PAID_USER)
  const spendKurus = splitExact(spentKurus, dayWeights)
  const dailyClicks = splitExact(totalClicks, dayWeights)
  const days = dayStarts.map((s, i) => ({
    start: s,
    spend: spendKurus[i] / 100,
    clicks: dailyClicks[i],
  }))

  const impressions = Math.round(totalClicks / ADS_BUDGET.ctr)
  const conversions = Math.round(totalClicks * ADS_BUDGET.conversionRate)

  // Harcama payı kampanya türüne göre (Arama en çok harcar), adına göre
  // sabit bir sapmayla; tıklama/gösterim/dönüşüm payları buna yakın
  const shares = campaigns.map(
    (c) => CAMPAIGN_TYPES[c.type].spendWeight * (0.7 + 0.6 * hash(nameSeed(c.name), 51)),
  )
  const jitter = (salt: number) => shares.map((w, i) => w * (0.85 + 0.3 * hash(i, salt)))
  const cSpend = splitExact(spentKurus, shares)
  const cClicks = splitExact(totalClicks, jitter(41))
  const cImpr = splitExact(impressions, jitter(43))
  const cConv = splitExact(conversions, jitter(47))

  return {
    deposit: ADS_BUDGET.deposit,
    bonus: ADS_BUDGET.bonus,
    credit,
    spent: spentKurus / 100,
    remaining: (Math.round(credit * 100) - spentKurus) / 100,
    live: now >= start && now < end,
    scheduled: now < start,
    startedAt: start,
    depletedAt: end,
    clicks: totalClicks,
    impressions,
    conversions,
    days,
    campaigns: campaigns.map((c, i) => ({
      name: c.name,
      typeLabel: CAMPAIGN_TYPES[c.type].label,
      enabled: c.status === 'enabled',
      spend: cSpend[i] / 100,
      clicks: cClicks[i],
      impressions: cImpr[i],
      conversions: cConv[i],
    })),
  }
}
