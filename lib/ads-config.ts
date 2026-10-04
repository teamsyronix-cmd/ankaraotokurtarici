/**
 * Google Ads kampanya ayarları (demo).
 *
 * Google Ads'teki kampanya oluşturma adımlarını izler: hedef, kampanya türü,
 * dönüşüm hedefleri, teklif, ağlar, konum/dil, reklam zaman planı, cihazlar,
 * anahtar kelimeler, reklam metinleri ve öğeler. Bütçe bu ayarların parçası
 * değildir; harcama lib/analytics.ts'de sabittir.
 *
 * Hem sunucuda (kayıt, doğrulama) hem tarayıcıda (form) kullanılır.
 */

import { PHONE_DISPLAY } from './site'

export const OBJECTIVES = {
  sales: { label: 'Satışlar', hint: 'İnternetten, uygulamada, telefonla veya mağazada satış' },
  leads: { label: 'Potansiyel müşteriler', hint: 'Arama, form ve diğer işlemlerle müşteri adayı' },
  traffic: { label: 'Web sitesi trafiği', hint: 'Doğru kişilerin web sitenizi ziyaret etmesi' },
  awareness: { label: 'Bilinirlik ve değerlendirme', hint: 'Geniş kitleye ulaşıp ilgi oluşturma' },
  local: { label: 'Yerel mağaza ziyaretleri', hint: 'Haritalar ve yol tarifi ile işletmeye ziyaret' },
  none: { label: 'Hedef olmadan kampanya oluştur', hint: 'Hedef önerisi olmadan tüm ayarlar' },
} as const
export type ObjectiveKey = keyof typeof OBJECTIVES

export const CAMPAIGN_TYPES = {
  search: { label: 'Arama', hint: 'Google aramalarında metin reklamları', spendWeight: 1 },
  pmax: {
    label: 'Performance Max',
    hint: 'Arama, Haritalar, YouTube ve Görüntülü Reklam Ağı tek kampanyada',
    spendWeight: 0.7,
  },
  display: { label: 'Görüntülü Reklam', hint: 'Web sitelerinde görsel reklamlar', spendWeight: 0.35 },
  video: { label: 'Video', hint: 'YouTube’da video reklamlar', spendWeight: 0.3 },
  demandGen: {
    label: 'Talep Yaratma',
    hint: 'YouTube, Discover ve Gmail’de ilgi çekici reklamlar',
    spendWeight: 0.3,
  },
} as const
export type CampaignTypeKey = keyof typeof CAMPAIGN_TYPES

/** Google Ads'te her hedefin izin verdiği kampanya türleri */
export const TYPES_BY_OBJECTIVE: Record<ObjectiveKey, CampaignTypeKey[]> = {
  sales: ['search', 'pmax', 'display', 'video', 'demandGen'],
  leads: ['search', 'pmax', 'display', 'video', 'demandGen'],
  traffic: ['search', 'pmax', 'display', 'video', 'demandGen'],
  awareness: ['display', 'video', 'demandGen'],
  local: ['pmax'],
  none: ['search', 'pmax', 'display', 'video', 'demandGen'],
}

export const CONVERSION_GOALS = {
  calls: 'Telefon aramaları',
  forms: 'İletişim formu gönderimi',
  directions: 'Yol tarifi alma',
  pageViews: 'Önemli sayfa görüntüleme',
} as const
export type ConversionGoalKey = keyof typeof CONVERSION_GOALS

export const BIDDING = {
  conversions: { label: 'Dönüşümleri artırma', target: 'Hedef EBM (dönüşüm başı maliyet)' },
  conversionValue: { label: 'Dönüşüm değerini artırma', target: 'Hedef ROAS (%)' },
  clicks: { label: 'Tıklamaları artırma', target: 'Maksimum TBM teklif sınırı' },
  impressionShare: { label: 'Hedef gösterim payı', target: 'Hedef gösterim payı (%)' },
  manualCpc: { label: 'Manuel TBM', target: 'Varsayılan TBM teklifi' },
} as const
export type BiddingKey = keyof typeof BIDDING

/** Teklif hedefi ₺ mi % mi */
export const BIDDING_UNIT: Record<BiddingKey, '₺' | '%'> = {
  conversions: '₺',
  conversionValue: '%',
  clicks: '₺',
  impressionShare: '%',
  manualCpc: '₺',
}

export const LOCATION_OPTIONS = {
  presence: 'Hedeflenen konumlarda bulunan veya düzenli olarak bulunan kişiler (önerilen)',
  presenceOrInterest: 'Hedeflenen konumlarda bulunan veya bu konumlarla ilgilenen kişiler',
} as const
export type LocationOptionKey = keyof typeof LOCATION_OPTIONS

export const LANGUAGES = {
  tr: 'Türkçe',
  en: 'İngilizce',
  ar: 'Arapça',
  de: 'Almanca',
  ru: 'Rusça',
} as const
export type LanguageKey = keyof typeof LANGUAGES

export const DEVICES = {
  mobile: 'Mobil telefonlar',
  desktop: 'Bilgisayarlar',
  tablet: 'Tabletler',
} as const
export type DeviceKey = keyof typeof DEVICES

/** 1 = Pazartesi … 7 = Pazar */
export const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] as const

export const LIMITS = {
  name: 80,
  headline: 30,
  headlinesMin: 3,
  headlinesMax: 15,
  description: 90,
  descriptionsMin: 2,
  descriptionsMax: 4,
  path: 15,
  callout: 25,
  calloutsMax: 10,
  sitelinkText: 25,
  sitelinksMax: 8,
  keywordsMax: 200,
  locationsMax: 20,
  campaignsMax: 10,
} as const

export type CampaignSettings = {
  id: string
  name: string
  status: 'enabled' | 'paused'
  objective: ObjectiveKey
  type: CampaignTypeKey
  conversionGoals: ConversionGoalKey[]
  bidding: BiddingKey
  /** İsteğe bağlı teklif hedefi; birimi BIDDING_UNIT'e göre */
  bidTarget: number | null
  networks: { searchPartners: boolean; display: boolean }
  locations: string[]
  locationOption: LocationOptionKey
  languages: LanguageKey[]
  schedule: { allDay: boolean; days: number[]; from: string; to: string }
  devices: DeviceKey[]
  /** Satır başına bir anahtar kelime: geniş, "sıralı", [tam] */
  keywords: string[]
  negativeKeywords: string[]
  ad: {
    finalUrl: string
    path1: string
    path2: string
    headlines: string[]
    descriptions: string[]
  }
  assets: {
    phone: string
    callouts: string[]
    sitelinks: { text: string; url: string }[]
  }
}

const SITE_URL = 'https://ankaraotokurtarici.com'

function baseCampaign(id: string): CampaignSettings {
  return {
    id,
    name: '',
    status: 'enabled',
    objective: 'leads',
    type: 'search',
    conversionGoals: ['calls', 'forms'],
    bidding: 'conversions',
    bidTarget: null,
    networks: { searchPartners: false, display: false },
    locations: ['Ankara, Türkiye'],
    locationOption: 'presence',
    languages: ['tr'],
    schedule: { allDay: true, days: [1, 2, 3, 4, 5, 6, 7], from: '00:00', to: '24:00' },
    devices: ['mobile', 'desktop', 'tablet'],
    keywords: [],
    negativeKeywords: [],
    ad: { finalUrl: SITE_URL, path1: '', path2: '', headlines: [], descriptions: [] },
    assets: { phone: PHONE_DISPLAY, callouts: [], sitelinks: [] },
  }
}

export function newCampaign(): CampaignSettings {
  return {
    ...baseCampaign(`c${Date.now().toString(36)}`),
    name: 'Yeni Kampanya',
    ad: {
      finalUrl: SITE_URL,
      path1: '',
      path2: '',
      headlines: ['', '', ''],
      descriptions: ['', ''],
    },
  }
}

export const DEFAULT_CAMPAIGNS: CampaignSettings[] = [
  {
    ...baseCampaign('ankara-oto-cekici'),
    name: 'Arama · Ankara Oto Çekici',
    keywords: [
      '[ankara oto çekici]',
      '"ankara çekici"',
      '"oto kurtarma ankara"',
      '[en yakın çekici]',
      'çekici çağır ankara',
      '"ankara oto kurtarıcı"',
    ],
    negativeKeywords: ['oyuncak', 'iş ilanı', 'satılık çekici', 'ikinci el'],
    ad: {
      finalUrl: SITE_URL,
      path1: 'oto-cekici',
      path2: 'ankara',
      headlines: [
        'Ankara Oto Çekici 7/24',
        'Dakikalar İçinde Yanınızda',
        'Hemen Ara: 0541 377 01 72',
        'Kayar Kasa Çekici Hizmeti',
        'Uygun Fiyat, Hızlı Hizmet',
        'Tüm İlçelere Oto Kurtarma',
      ],
      descriptions: [
        'Ankara’nın her ilçesine 7/24 oto çekici ve kurtarma. Hemen arayın, hızla gelelim.',
        'Kayar kasa çekicilerle aracınızı hasarsız taşıyoruz. Şehir içi ve şehirlerarası.',
      ],
    },
    assets: {
      phone: PHONE_DISPLAY,
      callouts: ['7/24 Hizmet', 'Hasarsız Taşıma', 'Şehirlerarası Çekici', 'Uygun Fiyat'],
      sitelinks: [
        { text: 'Hizmetlerimiz', url: `${SITE_URL}/#hizmetler` },
        { text: 'Araç Filomuz', url: `${SITE_URL}/#filo` },
        { text: 'Hizmet Bölgeleri', url: `${SITE_URL}/#bolgeler` },
        { text: 'İletişim', url: `${SITE_URL}/#iletisim` },
      ],
    },
  },
  {
    ...baseCampaign('yol-yardim'),
    name: 'Arama · Yol Yardım 7/24',
    conversionGoals: ['calls'],
    bidding: 'clicks',
    bidTarget: 12,
    networks: { searchPartners: true, display: false },
    devices: ['mobile'],
    keywords: [
      '"yol yardım ankara"',
      '[akü takviye ankara]',
      '"lastik değişimi yol yardım"',
      'aracım yolda kaldı',
      '"7/24 yol yardım"',
    ],
    negativeKeywords: ['sigorta', 'kasko', 'ücretsiz'],
    ad: {
      finalUrl: SITE_URL,
      path1: 'yol-yardim',
      path2: '7-24',
      headlines: [
        'Yolda mı Kaldınız? Hemen Ara',
        'Ankara 7/24 Yol Yardım',
        'Akü Takviye ve Lastik Değişimi',
        'Gece Gündüz Kesintisiz Hizmet',
      ],
      descriptions: [
        'Akü, lastik, yakıt ve çekici desteği. Ankara genelinde 7/24 yol yardım hizmeti.',
        'Bulunduğunuz konuma en yakın ekibimizi hemen yönlendirelim. Tek telefonla yardım.',
      ],
    },
    assets: {
      phone: PHONE_DISPLAY,
      callouts: ['7/24 Ulaşılabilir', 'Hızlı Müdahale', 'Deneyimli Ekip'],
      sitelinks: [
        { text: 'Hemen Ara', url: `${SITE_URL}/#iletisim` },
        { text: 'Hizmetlerimiz', url: `${SITE_URL}/#hizmetler` },
      ],
    },
  },
  {
    ...baseCampaign('google-haritalar'),
    name: 'Yerel · Google Haritalar',
    objective: 'local',
    type: 'pmax',
    conversionGoals: ['directions', 'calls'],
    bidding: 'conversions',
    locations: ['Ankara, Türkiye', 'Kırıkkale, Türkiye'],
    ad: {
      finalUrl: SITE_URL,
      path1: '',
      path2: '',
      headlines: [
        'Ankara Oto Kurtarma',
        'Size En Yakın Çekici',
        '7/24 Oto Çekici Hizmeti',
      ],
      descriptions: [
        'Ankara’da size en yakın oto çekici. Haritadan yol tarifi alın ya da hemen arayın.',
        'Tüm ilçelerde hızlı ve güvenli araç taşıma hizmeti.',
      ],
    },
    assets: {
      phone: PHONE_DISPLAY,
      callouts: ['7/24 Hizmet', 'Tüm İlçeler'],
      sitelinks: [],
    },
  },
]

/** Alan yolu → hata mesajı, ör. "ad.headlines.2" */
export type CampaignErrors = Record<string, string>

const isUrl = (v: string) => {
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}
const TIME_RE = /^([01]\d|2[0-4]):[0-5]\d$/

export function validateCampaign(c: CampaignSettings): CampaignErrors {
  const e: CampaignErrors = {}
  const L = LIMITS

  if (!c.name.trim()) e.name = 'Kampanya adı gerekli.'
  else if (c.name.length > L.name) e.name = `En fazla ${L.name} karakter.`

  if (!TYPES_BY_OBJECTIVE[c.objective].includes(c.type))
    e.type = `“${OBJECTIVES[c.objective].label}” hedefi bu kampanya türünü desteklemiyor.`

  if (c.objective !== 'awareness' && c.objective !== 'none' && c.conversionGoals.length === 0)
    e.conversionGoals = 'En az bir dönüşüm hedefi seçin.'

  if (c.bidTarget !== null) {
    const pct = BIDDING_UNIT[c.bidding] === '%'
    const max = c.bidding === 'conversionValue' ? 10_000 : pct ? 100 : 100_000
    if (!(c.bidTarget > 0 && c.bidTarget <= max))
      e.bidTarget = pct ? `0 – ${max} arası bir yüzde girin.` : 'Geçerli bir tutar girin.'
  }

  if (c.locations.length === 0) e.locations = 'En az bir konum ekleyin.'
  else if (c.locations.length > L.locationsMax) e.locations = `En fazla ${L.locationsMax} konum.`
  if (c.languages.length === 0) e.languages = 'En az bir dil seçin.'
  if (c.devices.length === 0) e.devices = 'En az bir cihaz türü seçin.'

  if (!c.schedule.allDay) {
    if (c.schedule.days.length === 0) e.schedule = 'En az bir gün seçin.'
    else if (!TIME_RE.test(c.schedule.from) || !TIME_RE.test(c.schedule.to))
      e.schedule = 'Saatleri SS:DD biçiminde girin.'
    else if (c.schedule.from >= c.schedule.to)
      e.schedule = 'Bitiş saati başlangıçtan sonra olmalı.'
  }

  if (c.type === 'search') {
    // Form satır satır düzenlediği için boş satırlar sayılmaz
    const kws = c.keywords.filter((k) => k.trim())
    if (kws.length === 0) e.keywords = 'Arama kampanyası için en az bir anahtar kelime ekleyin.'
    else if (kws.length > L.keywordsMax) e.keywords = `En fazla ${L.keywordsMax} anahtar kelime.`
    else if (kws.some((k) => k.length > 80)) e.keywords = 'Anahtar kelimeler en fazla 80 karakter.'
  }

  if (!isUrl(c.ad.finalUrl)) e['ad.finalUrl'] = 'http(s):// ile başlayan geçerli bir adres girin.'
  if (c.ad.path1.length > L.path) e['ad.path1'] = `En fazla ${L.path} karakter.`
  if (c.ad.path2.length > L.path) e['ad.path2'] = `En fazla ${L.path} karakter.`
  if (c.ad.path2 && !c.ad.path1) e['ad.path2'] = 'Önce 1. yolu doldurun.'

  const headlines = c.ad.headlines.filter((h) => h.trim())
  c.ad.headlines.forEach((h, i) => {
    if (h.length > L.headline) e[`ad.headlines.${i}`] = `${h.length}/${L.headline}`
  })
  if (headlines.length < L.headlinesMin) e['ad.headlines'] = `En az ${L.headlinesMin} başlık gerekli.`
  else if (new Set(headlines.map((h) => h.trim().toLocaleLowerCase('tr'))).size !== headlines.length)
    e['ad.headlines'] = 'Başlıklar birbirinden farklı olmalı.'

  const descriptions = c.ad.descriptions.filter((d) => d.trim())
  c.ad.descriptions.forEach((d, i) => {
    if (d.length > L.description) e[`ad.descriptions.${i}`] = `${d.length}/${L.description}`
  })
  if (descriptions.length < L.descriptionsMin)
    e['ad.descriptions'] = `En az ${L.descriptionsMin} açıklama gerekli.`

  if (c.assets.phone && !/^\+?[\d\s()-]{7,20}$/.test(c.assets.phone))
    e['assets.phone'] = 'Geçerli bir telefon numarası girin.'
  c.assets.callouts.forEach((t, i) => {
    if (t.length > L.callout) e[`assets.callouts.${i}`] = `${t.length}/${L.callout}`
  })
  c.assets.sitelinks.forEach((s, i) => {
    if (!s.text.trim() || s.text.length > L.sitelinkText)
      e[`assets.sitelinks.${i}`] = `Bağlantı metni 1–${L.sitelinkText} karakter olmalı.`
    else if (!isUrl(s.url)) e[`assets.sitelinks.${i}`] = 'Geçerli bir adres girin.'
  })

  return e
}

/** Tüm kampanyalar: indeks → hatalar (boşsa geçerli) */
export function validateCampaigns(list: CampaignSettings[]): Record<number, CampaignErrors> {
  const out: Record<number, CampaignErrors> = {}
  const names = new Map<string, number>()
  list.forEach((c, i) => {
    const e = validateCampaign(c)
    const key = c.name.trim().toLocaleLowerCase('tr')
    if (key && names.has(key)) e.name = 'Bu adla başka bir kampanya var.'
    names.set(key, i)
    if (Object.keys(e).length) out[i] = e
  })
  return out
}

// ---- Bilinmeyen girdiyi (JSON dosyası, form) güvenle çevirme ----

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const str = (v: unknown, d = '') => (typeof v === 'string' ? v : d)
const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d)
const strList = (v: unknown, max: number) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max) : []
function pick<K extends string>(v: unknown, options: Record<K, unknown>, d: K): K {
  return typeof v === 'string' && v in options ? (v as K) : d
}
function pickList<K extends string>(v: unknown, options: Record<K, unknown>): K[] {
  return [...new Set(strList(v, 20).filter((x): x is K => x in options))]
}

export function coerceCampaign(raw: unknown, index: number): CampaignSettings {
  const r = obj(raw)
  const base = baseCampaign(str(r.id) || `c${index}`)
  const net = obj(r.networks)
  const sch = obj(r.schedule)
  const ad = obj(r.ad)
  const assets = obj(r.assets)
  const target = typeof r.bidTarget === 'number' && Number.isFinite(r.bidTarget) ? r.bidTarget : null
  return {
    id: base.id.slice(0, 40),
    name: str(r.name).trim(),
    status: r.status === 'paused' ? 'paused' : 'enabled',
    objective: pick(r.objective, OBJECTIVES, base.objective),
    type: pick(r.type, CAMPAIGN_TYPES, base.type),
    conversionGoals: pickList(r.conversionGoals, CONVERSION_GOALS),
    bidding: pick(r.bidding, BIDDING, base.bidding),
    bidTarget: target,
    networks: {
      searchPartners: bool(net.searchPartners, false),
      display: bool(net.display, false),
    },
    locations: strList(r.locations, 50).map((x) => x.trim()).filter(Boolean),
    locationOption: pick(r.locationOption, LOCATION_OPTIONS, base.locationOption),
    languages: pickList(r.languages, LANGUAGES),
    schedule: {
      allDay: bool(sch.allDay, true),
      days: Array.isArray(sch.days)
        ? [...new Set(sch.days.filter((d): d is number => Number.isInteger(d) && d >= 1 && d <= 7))].sort()
        : base.schedule.days,
      from: str(sch.from, '00:00'),
      to: str(sch.to, '24:00'),
    },
    devices: pickList(r.devices, DEVICES),
    keywords: strList(r.keywords, 500).map((x) => x.trim()).filter(Boolean),
    negativeKeywords: strList(r.negativeKeywords, 500).map((x) => x.trim()).filter(Boolean),
    ad: {
      finalUrl: str(ad.finalUrl).trim(),
      path1: str(ad.path1).trim(),
      path2: str(ad.path2).trim(),
      headlines: strList(ad.headlines, LIMITS.headlinesMax),
      descriptions: strList(ad.descriptions, LIMITS.descriptionsMax),
    },
    assets: {
      phone: str(assets.phone).trim(),
      callouts: strList(assets.callouts, LIMITS.calloutsMax),
      sitelinks: (Array.isArray(assets.sitelinks) ? assets.sitelinks : [])
        .slice(0, LIMITS.sitelinksMax)
        .map((s) => ({ text: str(obj(s).text).trim(), url: str(obj(s).url).trim() })),
    },
  }
}

export function coerceCampaigns(raw: unknown): CampaignSettings[] {
  const list = Array.isArray(obj(raw).campaigns) ? (obj(raw).campaigns as unknown[]) : []
  return list.slice(0, LIMITS.campaignsMax).map(coerceCampaign)
}

/** Kaydetmeden önce boş satırları temizle */
export function tidyCampaign(c: CampaignSettings): CampaignSettings {
  const clean = (list: string[]) => list.map((x) => x.trim()).filter(Boolean)
  return {
    ...c,
    name: c.name.trim(),
    locations: clean(c.locations),
    keywords: clean(c.keywords),
    negativeKeywords: clean(c.negativeKeywords),
    ad: {
      ...c.ad,
      finalUrl: c.ad.finalUrl.trim(),
      path1: c.ad.path1.trim(),
      path2: c.ad.path2.trim(),
      headlines: clean(c.ad.headlines),
      descriptions: clean(c.ad.descriptions),
    },
    assets: {
      phone: c.assets.phone.trim(),
      callouts: clean(c.assets.callouts),
      sitelinks: c.assets.sitelinks
        .map((s) => ({ text: s.text.trim(), url: s.url.trim() }))
        .filter((s) => s.text || s.url),
    },
  }
}
