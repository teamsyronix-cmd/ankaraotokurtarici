import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ankara Oto Kurtarma | 7/24 Oto Çekici ve Yol Yardım',
  description:
    'Ankara’nın tüm ilçelerine 7/24 profesyonel oto çekici, oto kurtarma ve yol yardım hizmeti. Hızlı müdahale, güvenli araç taşıma. Hemen arayın: 0541 377 01 72',
  keywords: [
    'Ankara oto kurtarma',
    'oto çekici Ankara',
    'yol yardım Ankara',
    '7/24 çekici',
    'araç taşıma Ankara',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1f2a44',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`light ${inter.variable} ${manrope.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
