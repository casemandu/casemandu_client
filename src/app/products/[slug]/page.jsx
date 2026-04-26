import ProductDetails from '@/components/pages/products/ProductDetails'
import ProductPageComponent from '@/components/pages/shop/ProductPageComponent'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getPhones } from '@/frontend/lib/phoneAction'
import { getProductBySlug } from '@/frontend/lib/productActions'
import Link from 'next/link'

export async function generateMetadata({ params }, parent) {
  const slug = params?.slug
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://casemandu.com.np'

  const product = await getProductBySlug(slug)

  const previousImages = (await parent).openGraph?.images || []
  const description = product?.shortDescription || product?.description || `Buy ${product?.title} at Casemandu. Premium quality ${product?.category?.title} with fast delivery across Nepal.`

  return {
    title: `${product?.title} - ${product?.category?.title} | Casemandu`,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${slug}`,
    },
    openGraph: {
      title: `${product?.title} - ${product?.category?.title} | Casemandu`,
      description,
      url: `${baseUrl}/products/${slug}`,
      siteName: 'Casemandu',
      type: 'website',
      images: [product?.image, ...previousImages],
    },
  }
}



const SingleProductPage = async ({ params }) => {
  const product = await getProductBySlug(params?.slug)
  const phones = await getPhones()
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

        <ProductDetails product={product} phones={phones} />
      </div>
    </div>
    </>
  )
}

export default SingleProductPage
