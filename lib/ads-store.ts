import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  DEFAULT_CAMPAIGNS,
  coerceCampaigns,
  validateCampaigns,
  type CampaignSettings,
} from './ads-config'

/**
 * Kampanya ayarlarının kalıcı kaydı: proje kökünde data/ads-campaigns.json.
 * Veritabanı gerektirmez; dosya yoksa ya da bozuksa varsayılanlar kullanılır.
 * Not: Vercel gibi salt-okunur dosya sistemli ortamlarda kayıt kalıcı olmaz.
 */

const FILE = path.join(process.cwd(), 'data', 'ads-campaigns.json')

export async function readCampaigns(): Promise<CampaignSettings[]> {
  try {
    const list = coerceCampaigns(JSON.parse(await readFile(FILE, 'utf8')))
    if (list.length === 0 || Object.keys(validateCampaigns(list)).length) return DEFAULT_CAMPAIGNS
    return list
  } catch {
    return DEFAULT_CAMPAIGNS
  }
}

export async function writeCampaigns(campaigns: CampaignSettings[]) {
  await mkdir(path.dirname(FILE), { recursive: true })
  // Yarım yazılmış dosya kalmasın diye önce geçici dosyaya yaz
  const tmp = `${FILE}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify({ campaigns }, null, 2) + '\n', 'utf8')
  await rename(tmp, FILE)
}
