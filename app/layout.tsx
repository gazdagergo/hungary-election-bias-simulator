import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "lejtapalya.hu | A magyar választási rendszer torzításai",
  description:
    "Interaktív szimulátor a magyar választási rendszer torzításairól. Hogyan lesznek a közvéleménykutatási adatokból parlamenti mandátumok? Hol lejt a pálya?",
  metadataBase: new URL('https://lejtapalya.hu'),
  openGraph: {
    title: "lejtapalya.hu | A magyar választási rendszer torzításai",
    description: "Interaktív szimulátor: hogyan lesznek a közvéleménykutatási adatokból mandátumok? Hol lejt a pálya a magyar választási rendszerben?",
    url: 'https://lejtapalya.hu',
    siteName: 'lejtapalya.hu',
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "lejtapalya.hu | A magyar választási rendszer torzításai",
    description: "Interaktív szimulátor: hogyan lesznek a közvéleménykutatási adatokból mandátumok?",
  },
  keywords: ['választás', 'Magyarország', 'parlament', 'mandátum', 'torzítás', 'Fidesz', 'Tisza', 'közvéleménykutatás', 'szimulátor'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu" className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
