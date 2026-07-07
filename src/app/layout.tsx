import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AdPilot AI — AI-Powered Performance Marketing Manager',
  description:
    'Replace your junior PPC team with AI. Generate complete campaign blueprints in minutes — Google Ads, Meta, LinkedIn, YouTube & more.',
  keywords: 'AI marketing, PPC automation, Google Ads AI, campaign generator, performance marketing',
  authors: [{ name: 'AdPilot AI' }],
  openGraph: {
    title: 'AdPilot AI — AI Performance Marketing Manager',
    description: 'Generate complete ad campaigns in minutes with AI.',
    type: 'website',
    url: 'https://adpilot.ai',
    siteName: 'AdPilot AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdPilot AI',
    description: 'AI-powered campaign generation for modern marketers.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}
