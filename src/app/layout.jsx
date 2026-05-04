import { Poppins } from 'next/font/google'
import './globals.css'
import './globals.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import MainLayout from '@/components/layouts/MainLayout'
import NextTopLoader from 'nextjs-toploader'
import GoogleAnalytics from './GoogleAnalytics'
import Whatsapp from '@/components/common/Whatsapp/Whatsapp'
import ScrollToTop from '@/components/common/ScrollToTop/index.jsx'
import { getAllPromocodes } from '@/frontend/lib/promocodeAction'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_SEO_TITLE}`,
    default: process.env.NEXT_PUBLIC_SEO_TITLE,
  },
  description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION,
  keywords: [process.env.NEXT_PUBLIC_SEO_KEYWORDS],
  authors: [
    { name: "Nischal Neupane", url: 'https://nischal-neupane.com.np' },
    { name: 'Saurav Karki', url: 'https://saurav-karki.com.np' },
  ],
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
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
    title: {
      template: `%s | ${process.env.NEXT_PUBLIC_SEO_TITLE}`,
      default: process.env.NEXT_PUBLIC_SEO_TITLE,
    },
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION,
    images: [
      {
        url: `/images/logo/logo.png`,
        width: 1200,
        height: 630,
        alt: process.env.NEXT_PUBLIC_SEO_TITLE,
      },
    ],
    siteName: `${process.env.NEXT_PUBLIC_SEO_TITLE}`,
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default async function RootLayout({ children }) {
  const promocodes = await getAllPromocodes()

  return (
    <html lang='en'>
      <body className={`${poppins.className} flex flex-col min-h-screen max-w-[1920px] mx-auto`}>
        <MainLayout promocodes={promocodes}>
          <NextTopLoader showSpinner={false} color='#FF0000' />
          {children}
          <Whatsapp/>
          <ScrollToTop/>
        </MainLayout>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
      </body>
    </html>
  )
}
