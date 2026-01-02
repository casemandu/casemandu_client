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
    { name: 'Achyut Chapagain', url: 'https://achyutchapagain.com.np' },
    { name: 'Prashant Kafle', url: 'https://prashantkafle.com.np' },
  ],
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
  openGraph: {
    title: {
      template: `%s | ${process.env.NEXT_PUBLIC_SEO_TITLE}`,
      default: process.env.NEXT_PUBLIC_SEO_TITLE,
    },
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SEO_IMAGE}`,
        width: 800,
        height: 600,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SEO_IMAGE}`, // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: process.env.NEXT_PUBLIC_SEO_TITLE,
      },
    ],
    site_name: `${process.env.NEXT_PUBLIC_SEO_TITLE}`,
    keywords: process.env.NEXT_PUBLIC_SEO_KEYWORDS,
    authors: [
      { name: 'Achyut Chapagain', url: 'https://achyutchapagain.com.np' },
      { name: 'Prashant Kafle', url: 'https://prashantkafle.com.np' },
    ],
    imageWidth: 1200,
    imageHeight: 630,
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${poppins.className} flex flex-col min-h-screen max-w-[1920px] mx-auto`}>
        <MainLayout>
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
