import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'

const archivo = Archivo({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Szafometr',
  description: 'Aplikacja do zarządzania strojem w zależności od pogody',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={archivo.className}>{children}</body>
    </html>
  )
}