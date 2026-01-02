import ProductPageComponent from '@/components/pages/shop/ProductPageComponent'
import { getProductsByCategory } from '@/frontend/lib/productActions'
import { getAllCategories } from '@/frontend/lib/categoriesAction'

export async function generateMetadata({ params }, parent) {
  return {
    title: `${params?.slug?.replace(/-/g, ' ').toUpperCase()}`,
    openGraph: {
      title: `${params?.slug?.replace(/-/g, ' ').toUpperCase()}`,
    },
  }
}

const CategoryShopPage = async ({ params }) => {
  const categories = await getAllCategories()
  // Find category ID from slug (case-insensitive comparison)
  const category = categories?.find(cat => 
    cat.slug?.toLowerCase() === params?.slug?.toLowerCase()
  )
  const categoryId = category?._id || ''
  const products = await getProductsByCategory(categoryId, 30, 1)
  return (
    <div className='py-5 px-4 sm:px-8 flex-grow'>
      <h1 className='text-center font-medium text-3xl mb-8'>
        {params?.slug?.replace(/-/g, ' ').toUpperCase()}
      </h1>

      <ProductPageComponent products={products} type={params?.slug} categories={categories} />
    </div>
  )
}

export default CategoryShopPage
