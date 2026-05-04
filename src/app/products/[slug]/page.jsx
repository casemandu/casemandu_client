import ProductDetails from '@/components/pages/products/ProductDetails'
import { notFound } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getPhones } from '@/frontend/lib/phoneAction'
import { getProductBySlug, PRODUCT_NOT_FOUND } from '@/frontend/lib/productActions'
import { getVideoUrls } from '@/frontend/lib/videoAction'
import Link from 'next/link'

export async function generateMetadata({ params }, parent) {
  const slug = params?.slug
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://casemandu.com.np'

  const product = await getProductBySlug(slug)

  // Product deleted from DB — return noindex so the page component can call notFound()
  // Don't call notFound() here: metadata runs before HTTP status is set, causing Soft 404
  if (product === PRODUCT_NOT_FOUND || !product) {
    return {
      robots: { index: false, follow: false },
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const description = product?.shortDescription || product?.description || `Buy ${product?.title} at Casemandu. Premium quality ${product?.category?.title} with fast delivery across Nepal.`

  return {
    title: `${product.title} - ${product.category?.title} | Casemandu`,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${slug}`,
    },
    openGraph: {
      title: `${product.title} - ${product.category?.title} | Casemandu`,
      description,
      url: `${baseUrl}/products/${slug}`,
      siteName: 'Casemandu',
      type: 'website',
      images: [product.image, ...previousImages],
    },
  }
}



const SingleProductPage = async ({ params }) => {
  const product = await getProductBySlug(params?.slug)

  // Product deleted from DB — proper HTTP 404 (called from page, not metadata)
  if (product === PRODUCT_NOT_FOUND) notFound()

  // API temporarily down — show friendly message, not 404
  if (!product) {
    return (
      <div className='flex flex-grow items-center justify-center p-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Product temporarily unavailable</h1>
          <p className='text-gray-500 mb-4'>Please try again in a moment.</p>
          <Link href='/shop' className='text-primary underline'>Browse all products</Link>
        </div>
      </div>
    )
  }

  const [phones, videos] = await Promise.all([getPhones(), getVideoUrls()])
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://casemandu.com.np'

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.title,
    description: product?.shortDescription || product?.description || `${product?.title} - ${product?.category?.title}`,
    image: product?.image,
    brand: {
      '@type': 'Brand',
      name: 'Casemandu',
    },
    offers: {
      '@type': 'Offer',
      price: product?.price,
      priceCurrency: 'NPR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/products/${params?.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Casemandu',
      },
    },
    category: product?.category?.title,
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    <div className='p-4 sm:p-8'>
      <div className='py-4 sm:px-6 xl:px-20 2xl:px-16 flex-grow'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/shop?type=${product?.category?.slug}`}>
                  {product?.category?.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='#'>
                  {params?.slug?.replace(/-/g, ' ').toUpperCase()}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* ... */}
          </BreadcrumbList>
        </Breadcrumb>

        <ProductDetails product={product} phones={phones} videos={videos} />
      </div>
    </div>
    </>
  )
}

export default SingleProductPage
