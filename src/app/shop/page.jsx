import ProductPageComponent from '@/components/pages/shop/ProductPageComponent'
import { fetchProducts, fetchCategories, fetchOptions } from '@/frontend/lib/api'
import React from 'react'

export const metadata = {
  title: 'Shop - All Products | Your Store Name',
  description: 'Browse our complete collection of premium products with advanced filtering and sorting options.',
}

const ShopPage = async ({ searchParams }) => {
  // Fetch options and categories
  const [options, categories] = await Promise.all([
    fetchOptions(),
    fetchCategories(),
  ])
  
  const optionParam = searchParams?.option || null
  const type = searchParams?.type || 'all'
  const pageParam = searchParams?.page || '1'
  const page = parseInt(pageParam, 10) || 1
  
  // Find option ID from option parameter (route) if option is provided
  let optionId = ''
  let pageTitle = 'All Products'
  if (optionParam && options?.length > 0) {
    const optionRoute = optionParam.startsWith('/') ? optionParam : `/${optionParam}`
    const option = options.find(opt => 
      opt.route?.toLowerCase() === optionRoute.toLowerCase()
    )
    if (option) {
      optionId = option._id || ''
      pageTitle = option.name || optionParam
    }
  }
  
  // Find category ID from type (slug) if type is not 'all'
  let categoryId = ''
  if (type !== 'all' && categories?.length > 0) {
    const category = categories.find(cat => 
      cat.slug?.toLowerCase() === type?.toLowerCase()
    )
    if (category) {
      categoryId = category._id || ''
      if (!optionId) {
        pageTitle = category.title || type
      } else {
        // If both are selected, combine titles
        pageTitle = `${optionParam} - ${category.title}`
      }
    }
  }

  // Fetch products based on filters
  let products
  try {
    products = await fetchProducts({
      page,
      limit: 30,
      categories: categoryId,
      options: optionId,
    })
    
    // Ensure products has the expected structure
    if (!products || !products.success) {
      products = { products: [], pages: 1, success: false }
    }
  } catch (error) {
    console.error('Error fetching products in shop page:', error)
    products = { products: [], pages: 1, success: false }
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <div className='py-8 max-sm:px-4 px-8'>
        {/* Hero Section */}
        <div className='mb-12'>
          <div className='space-y-4'>
            <h1 className='text-4xl flex items-center gap-4 text-gray-900 tracking-tight relative z-10'>
              {pageTitle}
              <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent w-48'></div>
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl'>
              Discover our curated collection of premium products, customize your own designs, or filter to find exactly what you need.
            </p>
          </div>
        </div>

        {/* Main Product Component */}
        <ProductPageComponent 
          products={products} 
          type={optionParam || type} 
          options={options} 
          categories={categories}
        />
      </div>
    </div>
  )
}

export default ShopPage
