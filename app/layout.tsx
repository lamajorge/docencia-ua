import type { Metadata } from 'next'
import '../styles/globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DERE-A0004 · Introducción a la Economía',
  description: 'Material de clases — Universidad Autónoma de Chile',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav className="site-nav">
          <Link href="/" className="brand">Economía · UA</Link>
          <Link href="/clases">Clases</Link>
          <Link href="/manuales">Manuales</Link>
          <Link href="/buscar">Buscar</Link>
          <div className="spacer" />
          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>DERE-A0004 · Derecho</span>
        </nav>
        {children}
      </body>
    </html>
  )
}
