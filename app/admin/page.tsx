import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAnalyticsSnapshot } from '@/lib/analytics'
import { readCampaigns } from '@/lib/ads-store'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/admin/giris')

  const campaigns = await readCampaigns()
  const now = Date.now()
  return (
    <AnalyticsDashboard
      username={session.u}
      initialNow={now}
      initialSnapshot={getAnalyticsSnapshot(now)}
      campaigns={campaigns}
    />
  )
}
