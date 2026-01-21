import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Send Magic Login Links | Split Lease',
  description: 'Internal tool for generating and sending secure magic login links',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
