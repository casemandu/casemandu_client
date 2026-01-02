'use client'
import React from 'react'
import Link from 'next/link'
import ProductBox from '@/components/common/products/ProductBox'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const NewArrivalSection = ({ products }) => {
  // Ensure products is an array and filter for new products
  const newArrivalProducts = Array.isArray(products)
    ? products
        .filter((product) => product?.new || product?.isNew)
        .slice(0, 8)
    : []

  if (!newArrivalProducts || newArrivalProducts.length === 0) {
    return null
  }

  return (
    <section className='py-12 md:py-16 max-sm:px-4 px-8 bg-white relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'></div>
      
      <div className='max-w-[1920px] mx-auto relative z-10'>
        {/* Section Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4'>
          <div className='space-y-3'>
            <div className='inline-block'>
              <span className='inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm md:text-base font-bold rounded-full mb-3'>
                NEW
              </span>
            </div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight'>
              New Arrivals
            </h2>
            <p className='text-gray-600 text-base md:text-lg max-w-2xl font-medium'>
              Be the first to explore our latest collection of fresh, innovative
              products
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
          {newArrivalProducts.map((product) => (
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

export default NewArrivalSection
