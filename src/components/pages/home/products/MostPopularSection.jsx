'use client'
import React from 'react'
import Link from 'next/link'
import ProductBox from '@/components/common/products/ProductBox'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const MostPopularSection = ({ products }) => {
  const mostPopularProducts = products
    ?.sort((a, b) => (b?.totalViews || 0) - (a?.totalViews || 0))
    ?.slice(0, 8)

  if (!mostPopularProducts || mostPopularProducts.length === 0) {
    return null
  }

  return (
    <section className='py-12 md:py-16 max-sm:px-4 px-8  bg-gradient-to-b from-white via-gray-50/50 to-white'>
      <div className='max-w-[1920px] mx-auto'>
        {/* Section Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4'>
          <div className='space-y-3'>
            <div className='flex items-baseline gap-3'>
              <span className='text-sm md:text-base font-semibold text-primary uppercase tracking-wider'>
                Trending Now
              </span>
              <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent'></div>
            </div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight'>
              Most Popular
            </h2>
            <p className='text-gray-600 text-base md:text-lg max-w-2xl font-medium'>
              Discover our best-loved products, handpicked by our community of
              satisfied customers
            </p>
          </div>
          <Link href='/shop'>
            <Button
              variant='outline'
              size='lg'
              className='group hover:bg-primary hover:text-white transition-all duration-300 border-2 shadow-sm'
            >
              View All Products
              <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 md:gap-8'>
          {mostPopularProducts.map((product) => (
            <ProductBox
              key={product?._id}
              product={product}
              type='products'
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MostPopularSection
