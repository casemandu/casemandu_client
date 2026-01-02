'use client'
import React from 'react'
import Link from 'next/link'
import ProductBox from '@/components/common/products/ProductBox'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const BestSellerSection = ({ products }) => {
  const bestSellerProducts = products
    ?.sort((a, b) => (b?.saleCount || 0) - (a?.saleCount || 0))
    ?.slice(0, 8)

  if (!bestSellerProducts || bestSellerProducts.length === 0) {
    return null
  }

  return (
    <section className='py-12 md:py-16 max-sm:px-4 px-8 bg-gradient-to-br from-primary/5 via-white to-primary/5'>
      <div className='max-w-[1920px] mx-auto'>
        {/* Section Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4'>
          <div className='space-y-3'>
            <div className='relative inline-block'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight relative z-10'>
                Best Sellers
              </h2>
              <div className='absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0'></div>
            </div>
            <p className='text-gray-600 text-base md:text-lg max-w-2xl font-medium'>
              Shop our top-performing products that customers can't get enough of
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
          {bestSellerProducts.map((product) => (
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

export default BestSellerSection
