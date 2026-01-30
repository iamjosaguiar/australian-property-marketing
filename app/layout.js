import './globals.css'
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/schema'

export const metadata = {
  title: 'Australian Property Marketing | Marketing Measured in Listings',
  description: 'We measure listings. Not likes. Real estate marketing for agencies doing $2M+ in annual GCI.',
  keywords: 'real estate marketing Australia, real estate marketing agency, property marketing Australia, real estate agent marketing, real estate lead generation',
  openGraph: {
    title: 'Australian Property Marketing',
    description: 'Marketing Measured in Listings. Not Likes.',
    url: 'https://australianpropertymarketing.com.au',
    siteName: 'Australian Property Marketing',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body>{children}</body>
    </html>
  )
}
