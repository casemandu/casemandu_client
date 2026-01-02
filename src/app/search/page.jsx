import ProductBox from '@/components/common/products/ProductBox'
import { getProducts } from '@/frontend/lib/productActions'
import React from 'react'

const SearchPage = async ({ params, searchParams }) => {
  const { products } = await getProducts({ keyword: searchParams?.q || '', pageSize: 30, pageNumber: 1 })
  return (
    <div className='py-5 px-4 sm:px-6 xl:px-20 2xl:px-16 flex-grow'>
      <h1 className='text-center font-medium text-3xl'>
        Search Results for "{searchParams?.q}"
      </h1>
      <div className='py-10 md:py-16'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5'>
          {products?.map((product) => (
            <ProductBox key={product._id} product={product} type={'products'} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
