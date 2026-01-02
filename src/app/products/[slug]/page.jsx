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

  const product = await getProductBySlug(slug)

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${product?.title} - ${product?.category.title}`,
    description: product?.shortDescription,
    openGraph: {
      title: `${product?.title} - ${product?.category.title}`,
      images: [product?.image, ...previousImages],
    },
  }
}



const SingleProductPage = async ({ params }) => {
  const product = await getProductBySlug(params?.slug)
  const phones = await getPhones()
  return (
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
  )
}

export default SingleProductPage
