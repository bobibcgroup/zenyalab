import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zenya Lab - Longevity, Coming Soon | Experience the Science of Living Younger, Longer',
  description: 'Experience the science of living younger, longer. Zenya Lab offers advanced human optimization and longevity solutions through precision biohacking and evidence-based interventions.',
  keywords: 'longevity, biohacking, human optimization, precision health, biological age, anti-aging, healthspan, lifespan optimization, longevity science',
  authors: [{ name: 'Zenya Lab' }],
  creator: 'Zenya Lab',
  publisher: 'Zenya Lab',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Zenya Lab - Longevity, Coming Soon',
    description: 'Experience the science of living younger, longer. Advanced human optimization and longevity solutions.',
    url: 'https://zenyalab.com',
    siteName: 'Zenya Lab',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Zenya Lab - Longevity, Coming Soon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenya Lab - Longevity, Coming Soon',
    description: 'Experience the science of living younger, longer.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://zenyalab.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} style={{ overflow: 'hidden', height: '100%' }}>
      <body style={{ overflow: 'hidden', height: '100%' }}>{children}</body>
    </html>
  )
}

