'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Megaphone,
  Pause,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import {
  BIDDING,
  BIDDING_UNIT,
  CAMPAIGN_TYPES,
  CONVERSION_GOALS,
  DEVICES,
  LANGUAGES,
  LIMITS,
  LOCATION_OPTIONS,
  OBJECTIVES,
  TYPES_BY_OBJECTIVE,
  WEEKDAYS,
  newCampaign,
  validateCampaigns,
  type BiddingKey,
  type CampaignSettings,
  type CampaignTypeKey,
  type ObjectiveKey,
} from '@/lib/ads-config'
import { resetCampaigns, saveCampaigns } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

const inputClass =
  'h-10 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent-brand focus:ring-2 focus:ring-accent-brand/30 aria-invalid:border-destructive'

const keys = <T extends object>(o: T) => Object.keys(o) as (keyof T)[]
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export function CampaignEditor({ initialCampaigns }: { initialCampaigns: CampaignSettings[] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [selectedId, setSelectedId] = useState(initialCampaigns[0]?.id)
  const [saved, setSaved] = useState(() => JSON.stringify(initialCampaigns))
  const submitted = useRef('')
  const [state, action, pending] = useActionState(saveCampaigns, undefined)

  const payload = JSON.stringify(campaigns)
  const dirty = payload !== saved
  const errors = useMemo(() => validateCampaigns(campaigns), [campaigns])
  const valid = Object.keys(errors).length === 0

  // Kayıt başarılıysa gönderilen hali "kaydedilmiş" say
  useEffect(() => {
    if (state?.ok && submitted.current) setSaved(submitted.current)
  }, [state])

  const index = Math.max(0, campaigns.findIndex((c) => c.id === selectedId))
  const campaign = campaigns[index]
  const e = errors[index] ?? {}

  const update = (fn: (c: CampaignSettings) => CampaignSettings) =>
    setCampaigns((list) => list.map((c, i) => (i === index ? fn(c) : c)))

  const add = () => {
    const c = newCampaign()
    setCampaigns((list) => [...list, c])
    setSelectedId(c.id)
  }

  const remove = () => {
    if (campaigns.length === 1) return
    if (!confirm(`“${campaign.name || 'Adsız'}” kampanyası silinsin mi?`)) return
    const next = campaigns.filter((_, i) => i !== index)
    setCampaigns(next)
    setSelectedId(next[Math.max(0, index - 1)].id)
  }

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Site Analizine Dön
          </a>
          <form action={resetCampaigns}>
            <button
              type="submit"
              onClick={(ev) => {
                if (!confirm('Tüm kampanyalar varsayılan ayarlara dönsün mü?')) ev.preventDefault()
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Varsayılana Dön</span>
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent-brand/15 text-accent-brand-foreground">
            <Megaphone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Reklam Ayarları
            </h1>
            <p className="text-sm text-muted-foreground">
              Google Ads kampanyalarınızın hedef, teklif, hedefleme ve reklam ayarları
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[17rem_1fr]">
          {/* Kampanya listesi */}
          <nav aria-label="Kampanyalar" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {campaigns.map((c, i) => (
                <li key={c.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    aria-current={i === index ? 'true' : undefined}
                    className={cn(
                      'w-56 rounded-xl border bg-card p-3 text-left shadow-sm transition-colors lg:w-full',
                      i === index ? 'border-primary ring-2 ring-primary/15' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 shrink-0 rounded-full',
                          c.status === 'enabled' ? 'bg-emerald-600' : 'bg-muted-foreground/50',
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm font-semibold text-foreground">
                        {c.name || 'Adsız kampanya'}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{CAMPAIGN_TYPES[c.type].label}</span>
                      {errors[i] && <span className="font-semibold text-destructive">Eksik</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={add}
              disabled={campaigns.length >= LIMITS.campaignsMax}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-card disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden="true" />
              Yeni Kampanya
            </button>
          </nav>

          {/* Seçili kampanya */}
          {campaign && (
            <div key={campaign.id} className="flex min-w-0 flex-col gap-4">
              <Section title="Kampanya">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <Field label="Kampanya adı" error={e.name} className="flex-1">
                    <input
                      value={campaign.name}
                      maxLength={LIMITS.name}
                      onChange={(ev) => update((c) => ({ ...c, name: ev.target.value }))}
                      aria-invalid={!!e.name || undefined}
                      className={inputClass}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        update((c) => ({ ...c, status: c.status === 'enabled' ? 'paused' : 'enabled' }))
                      }
                      className={cn(
                        'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-colors',
                        campaign.status === 'enabled'
                          ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700'
                          : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {campaign.status === 'enabled' ? (
                        <Play className="size-4" aria-hidden="true" />
                      ) : (
                        <Pause className="size-4" aria-hidden="true" />
                      )}
                      {campaign.status === 'enabled' ? 'Etkin' : 'Duraklatıldı'}
                    </button>
                    <button
                      type="button"
                      onClick={remove}
                      disabled={campaigns.length === 1}
                      aria-label="Kampanyayı sil"
                      className="flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Section>

              <Section title="Kampanya hedefi" hint="Bu kampanyayla elde etmek istediğiniz sonuç">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {keys(OBJECTIVES).map((k) => (
                    <ChoiceCard
                      key={k}
                      name={`objective-${campaign.id}`}
                      checked={campaign.objective === k}
                      label={OBJECTIVES[k].label}
                      hint={OBJECTIVES[k].hint}
                      onChange={() =>
                        update((c) => {
                          const allowed = TYPES_BY_OBJECTIVE[k as ObjectiveKey]
                          return {
                            ...c,
                            objective: k as ObjectiveKey,
                            type: allowed.includes(c.type) ? c.type : allowed[0],
                          }
                        })
                      }
                    />
                  ))}
                </div>
              </Section>

              <Section title="Kampanya türü">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {keys(CAMPAIGN_TYPES).map((k) => {
                    const allowed = TYPES_BY_OBJECTIVE[campaign.objective].includes(k as CampaignTypeKey)
                    return (
                      <ChoiceCard
                        key={k}
                        name={`type-${campaign.id}`}
                        checked={campaign.type === k}
                        disabled={!allowed}
                        label={CAMPAIGN_TYPES[k].label}
                        hint={allowed ? CAMPAIGN_TYPES[k].hint : 'Seçili hedefle kullanılamaz'}
                        onChange={() => update((c) => ({ ...c, type: k as CampaignTypeKey }))}
                      />
                    )
                  })}
                </div>
                {e.type && <ErrorText>{e.type}</ErrorText>}
              </Section>

              <Section title="Dönüşüm hedefleri" hint="Kampanyanın başarı sayacağı işlemler">
                <CheckGroup
                  options={CONVERSION_GOALS}
                  value={campaign.conversionGoals}
                  onToggle={(k) => update((c) => ({ ...c, conversionGoals: toggle(c.conversionGoals, k) }))}
                />
                {e.conversionGoals && <ErrorText>{e.conversionGoals}</ErrorText>}
              </Section>

              <Section title="Teklif">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Neye odaklanmak istiyorsunuz?">
                    <select
                      value={campaign.bidding}
                      onChange={(ev) =>
                        update((c) => ({ ...c, bidding: ev.target.value as BiddingKey, bidTarget: null }))
                      }
                      className={inputClass}
                    >
                      {keys(BIDDING).map((k) => (
                        <option key={k} value={k}>
                          {BIDDING[k].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`${BIDDING[campaign.bidding].target} (isteğe bağlı)`} error={e.bidTarget}>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground">
                        {BIDDING_UNIT[campaign.bidding]}
                      </span>
                      <DecimalInput
                        key={campaign.bidding}
                        value={campaign.bidTarget}
                        onChange={(bidTarget) => update((c) => ({ ...c, bidTarget }))}
                        invalid={!!e.bidTarget}
                      />
                    </div>
                  </Field>
                </div>
              </Section>

              {campaign.type === 'search' && (
                <Section title="Ağlar">
                  <div className="flex flex-col gap-2.5">
                    <Check checked disabled label="Google Arama Ağı" />
                    <Check
                      checked={campaign.networks.searchPartners}
                      label="Google arama iş ortaklarını dahil et"
                      onChange={() =>
                        update((c) => ({
                          ...c,
                          networks: { ...c.networks, searchPartners: !c.networks.searchPartners },
                        }))
                      }
                    />
                    <Check
                      checked={campaign.networks.display}
                      label="Google Görüntülü Reklam Ağı’nı dahil et"
                      onChange={() =>
                        update((c) => ({ ...c, networks: { ...c.networks, display: !c.networks.display } }))
                      }
                    />
                  </div>
                </Section>
              )}

              <Section title="Konumlar ve diller">
                <Field label="Hedeflenecek konumlar" error={e.locations}>
                  <LocationInput
                    value={campaign.locations}
                    onChange={(locations) => update((c) => ({ ...c, locations }))}
                  />
                </Field>
                <fieldset className="mt-4">
                  <legend className="text-sm font-semibold text-foreground">Konum seçenekleri</legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {keys(LOCATION_OPTIONS).map((k) => (
                      <label key={k} className="flex items-start gap-2.5 text-sm text-foreground">
                        <input
                          type="radio"
                          name={`loc-${campaign.id}`}
                          checked={campaign.locationOption === k}
                          onChange={() => update((c) => ({ ...c, locationOption: k }))}
                          className="mt-0.5 size-4 accent-primary"
                        />
                        {LOCATION_OPTIONS[k]}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Diller</p>
                  <div className="mt-2">
                    <CheckGroup
                      options={LANGUAGES}
                      value={campaign.languages}
                      onToggle={(k) => update((c) => ({ ...c, languages: toggle(c.languages, k) }))}
                    />
                  </div>
                  {e.languages && <ErrorText>{e.languages}</ErrorText>}
                </div>
              </Section>

              <Section title="Reklam zaman planı ve cihazlar">
                <Check
                  checked={campaign.schedule.allDay}
                  label="Her gün, günün tamamında yayınla"
                  onChange={() =>
                    update((c) => ({ ...c, schedule: { ...c.schedule, allDay: !c.schedule.allDay } }))
                  }
                />
                {!campaign.schedule.allDay && (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex flex-wrap gap-1.5">
                      {WEEKDAYS.map((d, i) => {
                        const day = i + 1
                        const on = campaign.schedule.days.includes(day)
                        return (
                          <button
                            key={d}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              update((c) => ({
                                ...c,
                                schedule: { ...c.schedule, days: toggle(c.schedule.days, day).sort() },
                              }))
                            }
                            className={cn(
                              'h-10 w-12 rounded-xl border text-sm font-semibold transition-colors',
                              on
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {d}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        aria-label="Başlangıç saati"
                        value={campaign.schedule.from}
                        onChange={(ev) =>
                          update((c) => ({ ...c, schedule: { ...c.schedule, from: ev.target.value } }))
                        }
                        className={cn(inputClass, 'w-28')}
                      />
                      <span className="text-muted-foreground">–</span>
                      <input
                        type="time"
                        aria-label="Bitiş saati"
                        value={campaign.schedule.to === '24:00' ? '23:59' : campaign.schedule.to}
                        onChange={(ev) =>
                          update((c) => ({ ...c, schedule: { ...c.schedule, to: ev.target.value } }))
                        }
                        className={cn(inputClass, 'w-28')}
                      />
                    </div>
                  </div>
                )}
                {e.schedule && <ErrorText>{e.schedule}</ErrorText>}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Cihazlar</p>
                  <div className="mt-2">
                    <CheckGroup
                      options={DEVICES}
                      value={campaign.devices}
                      onToggle={(k) => update((c) => ({ ...c, devices: toggle(c.devices, k) }))}
                    />
                  </div>
                  {e.devices && <ErrorText>{e.devices}</ErrorText>}
                </div>
              </Section>

              {campaign.type === 'search' && (
                <Section
                  title="Anahtar kelimeler"
                  hint='Satır başına bir tane · geniş eşleme, "sıralı eşleme", [tam eşleme]'
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label={`Anahtar kelimeler (${campaign.keywords.filter((k) => k.trim()).length})`}
                      error={e.keywords}
                    >
                      <LinesInput
                        value={campaign.keywords}
                        onChange={(keywords) => update((c) => ({ ...c, keywords }))}
                        placeholder={'[ankara oto çekici]\n"çekici ankara"\nyol yardım'}
                        invalid={!!e.keywords}
                      />
                    </Field>
                    <Field
                      label={`Negatif anahtar kelimeler (${campaign.negativeKeywords.filter((k) => k.trim()).length})`}
                    >
                      <LinesInput
                        value={campaign.negativeKeywords}
                        onChange={(negativeKeywords) => update((c) => ({ ...c, negativeKeywords }))}
                        placeholder={'ücretsiz\niş ilanı'}
                      />
                    </Field>
                  </div>
                </Section>
              )}

              <Section title="Reklam" hint="Duyarlı arama reklamı">
                <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
                  <div className="flex min-w-0 flex-col gap-4">
                    <Field label="Nihai URL" error={e['ad.finalUrl']}>
                      <input
                        type="url"
                        value={campaign.ad.finalUrl}
                        onChange={(ev) => update((c) => ({ ...c, ad: { ...c.ad, finalUrl: ev.target.value } }))}
                        aria-invalid={!!e['ad.finalUrl'] || undefined}
                        className={inputClass}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Görünen yol 1" error={e['ad.path1']}>
                        <CountedInput
                          value={campaign.ad.path1}
                          max={LIMITS.path}
                          onChange={(path1) => update((c) => ({ ...c, ad: { ...c.ad, path1 } }))}
                        />
                      </Field>
                      <Field label="Görünen yol 2" error={e['ad.path2']}>
                        <CountedInput
                          value={campaign.ad.path2}
                          max={LIMITS.path}
                          onChange={(path2) => update((c) => ({ ...c, ad: { ...c.ad, path2 } }))}
                        />
                      </Field>
                    </div>
                    <TextList
                      label="Başlıklar"
                      itemLabel="Başlık"
                      items={campaign.ad.headlines}
                      max={LIMITS.headline}
                      maxItems={LIMITS.headlinesMax}
                      error={e['ad.headlines']}
                      itemErrors={(i) => e[`ad.headlines.${i}`]}
                      onChange={(headlines) => update((c) => ({ ...c, ad: { ...c.ad, headlines } }))}
                    />
                    <TextList
                      label="Açıklamalar"
                      itemLabel="Açıklama"
                      items={campaign.ad.descriptions}
                      max={LIMITS.description}
                      maxItems={LIMITS.descriptionsMax}
                      error={e['ad.descriptions']}
                      itemErrors={(i) => e[`ad.descriptions.${i}`]}
                      onChange={(descriptions) => update((c) => ({ ...c, ad: { ...c.ad, descriptions } }))}
                    />
                  </div>
                  <AdPreview campaign={campaign} />
                </div>
              </Section>

              <Section title="Öğeler" hint="Reklamın altında görünen ek bilgiler">
                <Field label="Arama öğesi (telefon)" error={e['assets.phone']}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                      type="tel"
                      value={campaign.assets.phone}
                      onChange={(ev) =>
                        update((c) => ({ ...c, assets: { ...c.assets, phone: ev.target.value } }))
                      }
                      aria-invalid={!!e['assets.phone'] || undefined}
                      className={cn(inputClass, 'pl-10')}
                    />
                  </div>
                </Field>
                <div className="mt-4">
                  <TextList
                    label="Açıklama metni öğeleri"
                    itemLabel="Açıklama metni"
                    items={campaign.assets.callouts}
                    max={LIMITS.callout}
                    maxItems={LIMITS.calloutsMax}
                    itemErrors={(i) => e[`assets.callouts.${i}`]}
                    onChange={(callouts) => update((c) => ({ ...c, assets: { ...c.assets, callouts } }))}
                    allowEmpty
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">
                    Site bağlantısı öğeleri ({campaign.assets.sitelinks.length}/{LIMITS.sitelinksMax})
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {campaign.assets.sitelinks.map((s, i) => (
                      <li key={i}>
                        <div className="flex gap-2">
                          <input
                            aria-label={`${i + 1}. bağlantı metni`}
                            placeholder="Bağlantı metni"
                            value={s.text}
                            maxLength={LIMITS.sitelinkText + 10}
                            onChange={(ev) =>
                              update((c) => ({
                                ...c,
                                assets: {
                                  ...c.assets,
                                  sitelinks: c.assets.sitelinks.map((x, j) =>
                                    j === i ? { ...x, text: ev.target.value } : x,
                                  ),
                                },
                              }))
                            }
                            className={cn(inputClass, 'w-2/5')}
                          />
                          <input
                            type="url"
                            aria-label={`${i + 1}. bağlantı adresi`}
                            placeholder="https://"
                            value={s.url}
                            onChange={(ev) =>
                              update((c) => ({
                                ...c,
                                assets: {
                                  ...c.assets,
                                  sitelinks: c.assets.sitelinks.map((x, j) =>
                                    j === i ? { ...x, url: ev.target.value } : x,
                                  ),
                                },
                              }))
                            }
                            className={inputClass}
                          />
                          <RemoveButton
                            label={`${i + 1}. bağlantıyı sil`}
                            onClick={() =>
                              update((c) => ({
                                ...c,
                                assets: { ...c.assets, sitelinks: c.assets.sitelinks.filter((_, j) => j !== i) },
                              }))
                            }
                          />
                        </div>
                        {e[`assets.sitelinks.${i}`] && <ErrorText>{e[`assets.sitelinks.${i}`]}</ErrorText>}
                      </li>
                    ))}
                  </ul>
                  <AddButton
                    disabled={campaign.assets.sitelinks.length >= LIMITS.sitelinksMax}
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        assets: {
                          ...c.assets,
                          sitelinks: [...c.assets.sitelinks, { text: '', url: c.ad.finalUrl }],
                        },
                      }))
                    }
                  >
                    Site bağlantısı ekle
                  </AddButton>
                </div>
              </Section>
            </div>
          )}
        </div>
      </main>

      {/* Kaydetme çubuğu */}
      <form
        action={(fd) => {
          submitted.current = payload
          return action(fd)
        }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur"
      >
        <input type="hidden" name="payload" value={payload} />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <p className="min-w-0 truncate text-sm" role="status">
            {state?.error && !dirty ? (
              <span className="inline-flex items-center gap-2 font-medium text-destructive">
                <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                {state.error}
              </span>
            ) : !valid ? (
              <span className="inline-flex items-center gap-2 font-medium text-destructive">
                <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                Eksik ya da hatalı alanları düzeltin
              </span>
            ) : dirty ? (
              <span className="text-muted-foreground">Kaydedilmemiş değişiklikler var</span>
            ) : state?.ok ? (
              <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                Kaydedildi
              </span>
            ) : (
              <span className="text-muted-foreground">Tüm değişiklikler kayıtlı</span>
            )}
          </p>
          <button
            type="submit"
            disabled={pending || !valid || !dirty}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-accent-brand px-5 text-sm font-bold text-accent-brand-foreground transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            {pending ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Yardımcı bileşenler ---------- */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-heading text-base font-bold text-foreground">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-destructive">{error}</span>}
    </label>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs font-medium text-destructive">{children}</p>
}

function ChoiceCard({
  name,
  checked,
  disabled,
  label,
  hint,
  onChange,
}: {
  name: string
  checked: boolean
  disabled?: boolean
  label: string
  hint: string
  onChange: () => void
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
        checked ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/40',
        disabled && 'cursor-not-allowed opacity-50 hover:border-border',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

function Check({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  label: string
  onChange?: () => void
}) {
  return (
    <label className={cn('flex items-center gap-2.5 text-sm text-foreground', disabled && 'opacity-70')}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="size-4 accent-primary"
      />
      {label}
    </label>
  )
}

function CheckGroup<K extends string>({
  options,
  value,
  onToggle,
}: {
  options: Record<K, string>
  value: K[]
  onToggle: (k: K) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(options) as K[]).map((k) => {
        const on = value.includes(k)
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(k)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              on
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {options[k]}
          </button>
        )
      })}
    </div>
  )
}

function CountedInput({
  value,
  max,
  onChange,
  invalid,
  placeholder,
  ariaLabel,
}: {
  value: string
  max: number
  onChange: (v: string) => void
  invalid?: boolean
  placeholder?: string
  ariaLabel?: string
}) {
  const over = value.length > max
  return (
    <div className="relative min-w-0 flex-1">
      <input
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(ev) => onChange(ev.target.value)}
        aria-invalid={over || invalid || undefined}
        className={cn(inputClass, 'pr-14')}
      />
      <span
        className={cn(
          'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs tabular-nums',
          over ? 'font-semibold text-destructive' : 'text-muted-foreground',
        )}
      >
        {value.length}/{max}
      </span>
    </div>
  )
}

function TextList({
  label,
  itemLabel,
  items,
  max,
  maxItems,
  error,
  itemErrors,
  onChange,
  allowEmpty,
}: {
  label: string
  itemLabel: string
  items: string[]
  max: number
  maxItems: number
  error?: string
  itemErrors: (i: number) => string | undefined
  onChange: (items: string[]) => void
  allowEmpty?: boolean
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">
        {label} ({items.filter((x) => x.trim()).length}/{maxItems})
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((v, i) => (
          <li key={i} className="flex gap-2">
            <CountedInput
              value={v}
              max={max}
              ariaLabel={`${itemLabel} ${i + 1}`}
              placeholder={`${itemLabel} ${i + 1}`}
              invalid={!!itemErrors(i)}
              onChange={(nv) => onChange(items.map((x, j) => (j === i ? nv : x)))}
            />
            <RemoveButton
              label={`${itemLabel} ${i + 1} sil`}
              disabled={!allowEmpty && items.length <= 1}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            />
          </li>
        ))}
      </ul>
      {error && <ErrorText>{error}</ErrorText>}
      <AddButton disabled={items.length >= maxItems} onClick={() => onChange([...items, ''])}>
        {itemLabel} ekle
      </AddButton>
    </div>
  )
}

/** "7,5" gibi ara değerler yazılabilsin diye metni kendi tutar */
function DecimalInput({
  value,
  onChange,
  invalid,
}: {
  value: number | null
  onChange: (v: number | null) => void
  invalid?: boolean
}) {
  const [text, setText] = useState(value === null ? '' : String(value).replace('.', ','))
  return (
    <input
      inputMode="decimal"
      placeholder="Belirlenmedi"
      value={text}
      onChange={(ev) => {
        setText(ev.target.value)
        const t = ev.target.value.trim().replace(',', '.')
        onChange(t === '' ? null : Number(t))
      }}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, 'pl-8 tabular-nums')}
    />
  )
}

function LinesInput({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  invalid?: boolean
}) {
  return (
    <textarea
      rows={8}
      value={value.join('\n')}
      placeholder={placeholder}
      onChange={(ev) => onChange(ev.target.value.split('\n'))}
      aria-invalid={invalid || undefined}
      spellCheck={false}
      className={cn(inputClass, 'h-auto py-2.5 font-mono text-[13px] leading-relaxed')}
    />
  )
}

function LocationInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('')
  const add = () => {
    const t = text.trim()
    if (t && !value.some((v) => v.toLocaleLowerCase('tr') === t.toLocaleLowerCase('tr'))) {
      onChange([...value, t])
    }
    setText('')
  }
  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((v) => (
            <li
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 py-1 pr-1 pl-3 text-sm text-foreground"
            >
              <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {v}
              <button
                type="button"
                aria-label={`${v} konumunu kaldır`}
                onClick={() => onChange(value.filter((x) => x !== v))}
                className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={text}
          placeholder="Şehir, ilçe veya bölge (ör. Çankaya, Ankara)"
          onChange={(ev) => setText(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              add()
            }
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="h-10 shrink-0 rounded-xl border border-border px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Ekle
        </button>
      </div>
    </div>
  )
}

function AddButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-muted disabled:opacity-40"
    >
      <Plus className="size-4" aria-hidden="true" />
      {children}
    </button>
  )
}

function RemoveButton({
  label,
  disabled,
  onClick,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  )
}

/** Google arama sonucunda reklamın kabaca nasıl görüneceği */
function AdPreview({ campaign }: { campaign: CampaignSettings }) {
  let host = ''
  try {
    host = new URL(campaign.ad.finalUrl).hostname.replace(/^www\./, '')
  } catch {
    host = 'alanadiniz.com'
  }
  const path = [campaign.ad.path1, campaign.ad.path2].filter(Boolean).join(' › ')
  const headlines = campaign.ad.headlines.filter((h) => h.trim()).slice(0, 3)
  const descriptions = campaign.ad.descriptions.filter((d) => d.trim()).slice(0, 2)
  const callouts = campaign.assets.callouts.filter((c) => c.trim())
  const sitelinks = campaign.assets.sitelinks.filter((s) => s.text.trim()).slice(0, 4)

  return (
    <div className="xl:sticky xl:top-24 xl:self-start">
      <p className="text-sm font-semibold text-foreground">Önizleme</p>
      <div className="mt-2 rounded-xl border border-border bg-white p-4 font-sans text-[#202124] shadow-sm">
        <p className="text-xs font-bold">Sponsorlu</p>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#f1f3f4] text-[11px] font-bold text-[#5f6368] uppercase">
            {host.charAt(0) || '?'}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm">{host}</span>
            <span className="block truncate text-xs text-[#4d5156]">
              https://{host}
              {path && ` › ${path}`}
            </span>
          </span>
        </div>
        <p className="mt-2 text-lg leading-snug text-[#1a0dab]">
          {headlines.length ? headlines.join(' | ') : 'Başlık 1 | Başlık 2 | Başlık 3'}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">
          {descriptions.length ? descriptions.join(' ') : 'Reklam açıklamanız burada görünür.'}
        </p>
        {callouts.length > 0 && (
          <p className="mt-1 text-sm text-[#4d5156]">{callouts.join(' · ')}</p>
        )}
        {sitelinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {sitelinks.map((s, i) => (
              <span key={i} className="text-sm text-[#1a0dab]">
                {s.text}
              </span>
            ))}
          </div>
        )}
        {campaign.assets.phone && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#1a0dab]">
            <Phone className="size-3.5" aria-hidden="true" />
            {campaign.assets.phone}
          </p>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Google, başlık ve açıklamaları farklı kombinasyonlarla gösterir.
      </p>
    </div>
  )
}
