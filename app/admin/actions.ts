'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  checkCredentials,
  createSession,
  deleteSession,
  getSession,
  isAuthConfigured,
} from '@/lib/auth'
import {
  DEFAULT_CAMPAIGNS,
  coerceCampaigns,
  tidyCampaign,
  validateCampaigns,
} from '@/lib/ads-config'
import { writeCampaigns } from '@/lib/ads-store'

export type LoginState = { error?: string } | undefined

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: 'Yönetim paneli henüz yapılandırılmamış.' }
  }

  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!checkCredentials(username, password)) {
    // Kaba kuvvet denemelerini yavaşlat
    await new Promise((r) => setTimeout(r, 800))
    return { error: 'Kullanıcı adı veya şifre hatalı.' }
  }

  await createSession(username)
  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/admin/giris')
}

export type CampaignsState =
  | { ok?: boolean; error?: string; savedAt?: number }
  | undefined

/** Form, kampanya listesini JSON olarak "payload" alanında gönderir */
export async function saveCampaigns(
  _prev: CampaignsState,
  formData: FormData,
): Promise<CampaignsState> {
  if (!(await getSession())) redirect('/admin/giris')

  let raw: unknown
  try {
    raw = JSON.parse(String(formData.get('payload') ?? ''))
  } catch {
    return { error: 'Gönderilen veri okunamadı.' }
  }
  const campaigns = coerceCampaigns({ campaigns: raw }).map(tidyCampaign)
  if (campaigns.length === 0) return { error: 'En az bir kampanya olmalı.' }

  const errors = validateCampaigns(campaigns)
  const firstBad = Object.keys(errors)[0]
  if (firstBad !== undefined) {
    return { error: `“${campaigns[Number(firstBad)].name || 'Adsız'}” kampanyasında hatalı alanlar var.` }
  }

  try {
    await writeCampaigns(campaigns)
  } catch {
    return { error: 'Ayarlar kaydedilemedi. Sunucu dosya yazma iznini kontrol edin.' }
  }
  revalidatePath('/admin')
  return { ok: true, savedAt: Date.now() }
}

export async function resetCampaigns() {
  if (!(await getSession())) redirect('/admin/giris')
  await writeCampaigns(DEFAULT_CAMPAIGNS)
  revalidatePath('/admin')
  redirect('/admin/reklam')
}
