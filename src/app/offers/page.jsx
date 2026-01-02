import ProductPageComponent from '@/components/pages/shop/ProductPageComponent'
import { fetchOffers, fetchOptions, fetchCategories } from '@/frontend/lib/api'

export const metadata = {
  title: 'Offers - Casemandu',
  description: 'Discover limited-time deals on Casemandu. Filter, search, and shop offer products effortlessly.',
}

const OffersPage = async ({ searchParams }) => {
  const [options, categories] = await Promise.all([
    fetchOptions(),
    fetchCategories(),
  ])

  const optionParam = searchParams?.option || null
  const type = searchParams?.type || 'all'
  const pageParam = searchParams?.page || '1'
  const searchQuery = searchParams?.search?.trim() || ''
  const page = parseInt(pageParam, 10) || 1

  let optionId = ''
  let pageTitle = 'All Offers'
  if (optionParam && options?.length > 0) {
    const optionRoute = optionParam.startsWith('/') ? optionParam : `/${optionParam}`
    const option = options.find(opt =>
      opt.route?.toLowerCase() === optionRoute.toLowerCase()
    )
    if (option) {
      optionId = option._id || ''
      pageTitle = option.name || 'Offers'
    }
  }

  let categoryId = ''
  if (type !== 'all' && categories?.length > 0) {
    const category = categories.find(cat =>
      cat.slug?.toLowerCase() === type?.toLowerCase()
    )
    if (category) {
      categoryId = category._id || ''
      if (!optionId) {
        pageTitle = category.title || 'Offers'
      } else {
        pageTitle = `${pageTitle} - ${category.title}`
      }
    }
  }

  let offers
  try {
    offers = await fetchOffers({
      page,
      limit: 30,
      categories: categoryId,
      options: optionId,
      search: searchQuery,
    })

    if (!offers || typeof offers !== 'object') {
      offers = { products: [], pages: 1, success: false }
    }
  } catch (error) {
    console.error('Error fetching offers:', error)
    offers = { products: [], pages: 1, success: false }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <div className='py-8 max-sm:px-4 px-8'>
        <div className='mb-12'>
          <div className='space-y-4'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl flex items-center gap-4 text-gray-900 tracking-tight relative z-10'>
              {pageTitle}
              <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent w-48'></div>
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl'>
              Browse limited-time deals and exclusive bundles tailored for you. Use filters to quickly discover offer products that match your style.
            </p>
          </div>
        </div>

        <ProductPageComponent
          products={offers}
          type={optionParam || type}
          options={options}
          categories={categories}
          resourceType='offers'
          basePath='/offers'
          itemType='offers'
          enableCustomizeLink={false}
          alwaysShowPagination
        />
      </div>
    </div>
  )
}

export default OffersPage
