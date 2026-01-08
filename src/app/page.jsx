import HeroSlider from "@/components/pages/home/hero-slider/HeroSlider";
import { getProducts } from "@/frontend/lib/productActions";
import { getHappyCustomers } from "@/frontend/lib/happyCustomerAction";
import { getAllCategories } from "@/frontend/lib/categoriesAction";
import HappyCustomers from "@/components/pages/home/happy-customers/HappyCustomers";
import CategoryBentoGrid from "@/components/pages/home/categories/CategoryBentoGrid";
import MostPopularSection from "@/components/pages/home/products/MostPopularSection";
import NewArrivalSection from "@/components/pages/home/products/NewArrivalSection";
import BestSellerSection from "@/components/pages/home/products/BestSellerSection";
import CustomizeSection from "@/components/pages/home/customize/CustomizeSection";
import OptionsShowcase from "@/components/pages/home/options/OptionsShowcase";
import { fetchOptions } from "@/frontend/lib/api";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://casemandu.com.np";
const siteName = process.env.NEXT_PUBLIC_SEO_TITLE || "Casemandu";
const siteDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION || 
  "Shop premium phone cases, pop sockets, laptop sleeves, mousepads, and more at Casemandu. Customize your devices with high-quality accessories. Fast delivery across Nepal.";

export const metadata = {
  title: {
    default: `${siteName} - Premium Phone Cases & Accessories in Nepal`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "phone cases",
    "mobile covers",
    "pop sockets",
    "laptop sleeves",
    "mousepads",
    "airpod cases",
    "phone accessories",
    "Nepal",
    "custom phone cases",
    "phone case Nepal",
    "mobile accessories Nepal",
    "casemandu",
  ],
  authors: [
    { name: "Sulav Timalsina" },
    { name: "Diya Shrestha" },
  ],
  creator: "Casemandu",
  publisher: "Casemandu",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: siteName,
    title: `${siteName} - Premium Phone Cases & Accessories in Nepal`,
    description: siteDescription,
    images: [
      {
        url: `${baseUrl}/images/logo/logo.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Premium Phone Cases & Accessories`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Premium Phone Cases & Accessories in Nepal`,
    description: siteDescription,
    images: [`${baseUrl}/images/logo/logo.png`],
    creator: "@casemandu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "E-commerce",
};

export default async function Home() {
  const { products } = await getProducts({ pageSize: 30, pageNumber: 1 });
  const happyCustomers = await getHappyCustomers();
  const categories = await getAllCategories();
  const options = await fetchOptions();

  // Structured Data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo/logo.png`,
    "description": siteDescription,
    "sameAs": [
      "https://www.instagram.com/case_mandu",
      "https://www.facebook.com/profile.php?id=100076330810311",
      "https://www.tiktok.com/@casemandu"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-9866335484",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Nepali"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": baseUrl,
    "description": siteDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
     <div className='mb-12 md:hidden'>
          <a
            href={`https://customize.casemandu.com.np/`}
            target='_blank'
            rel='noopener noreferrer'
            className='block group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-primary transition-all duration-300'
          >
            <div className='p-6 md:p-8'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                <div className='space-y-2'>
                  <h2 className='text-2xl md:text-3xl font-medium text-gray-900'>
                    Create Your Own Design
                  </h2>
                  <p className='text-gray-600 text-sm md:text-base'>
                    Customize products with your own images and designs
                  </p>
                </div>
                <div className='text-sm md:text-base text-primary font-medium group-hover:underline'>
                  Start Designing →
                </div>
              </div>
            </div>
          </a>
        </div>
      <HeroSlider />
      <CategoryBentoGrid categories={categories} />
      <OptionsShowcase options={options} />
      <NewArrivalSection products={products} />
      <MostPopularSection products={products} />
      <BestSellerSection products={products} />
      {/* <CustomizeSection /> */}
      <HappyCustomers customers={happyCustomers} />
    </>
  );
}
