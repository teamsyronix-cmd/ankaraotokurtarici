import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { readCampaigns } from '@/lib/ads-store'
import { CampaignEditor } from '@/components/admin/campaign-editor'

export const metadata: Metadata = {
  title: 'Reklam Ayarları | Ankara Oto Kurtarma',
}

export default async function AdsSettingsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/giris')

  return <CampaignEditor initialCampaigns={await readCampaigns()} />
}
