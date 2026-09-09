import type { Metadata, Viewport } from 'next'
import { StoreHydrator } from '@/components/StoreHydrator'
import './globals.scss'

export const metadata: Metadata = {
  title: 'TRACE · Visual DSA Practice',
  description:
    'Watch the algorithm think. Stepped visual traces for the Blind 75, next to the code that produced them.',
}

export const viewport: Viewport = {
  themeColor: '#09090B',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts load as a stylesheet rather than through next/font, so the
            build never needs network access and works offline or in a sandbox.
            next/font is the better choice once you are only ever building on
            Vercel — it self-hosts the files and removes this request entirely.
            The stacks fall back to system fonts either way. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <StoreHydrator />
        {/* The one `main` landmark for every route, so no page needs its own.
            Unstyled on purpose - it must not introduce a box of its own. */}
        <main>{children}</main>
      </body>
    </html>
  )
}
