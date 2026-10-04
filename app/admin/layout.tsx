import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yönetim Paneli | Ankara Oto Kurtarma',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-muted">{children}</div>
}
