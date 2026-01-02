'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CategoryBentoGrid = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null

  const displayCategories = categories.filter(cat => cat?.displayOnHead !== false).slice(0, 6)

  const getGridClass = (index) => {
    const layouts = [
      'col-span-1 row-span-1', 
      'col-span-1 row-span-1', 
      'col-span-2 row-span-2 max-sm:col-span-1 max-sm:row-span-1', 
      'col-span-2 row-span-2 max-sm:col-span-1 max-sm:row-span-1', 
      'col-span-1 row-span-1', 
      'col-span-1 row-span-1', 
    ]
    return layouts[index % layouts.length] || 'col-span-1 row-span-1'
  }

  return (
    <section className='py-12 md:py-16 max-sm:px-4 px-8'>
      <div className=''>
        {/* Section Header */}
        <div className='mb-8 md:mb-12'>
          <div className='flex items-baseline gap-3 mb-3'>
            <span className='text-sm md:text-base font-semibold text-primary uppercase tracking-wider'>
              MULTIPLE PRODUCTS, MULTIPLE VARIANTS
            </span>
            <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent'></div>
          </div>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight'>
            Explore Our Collections
          </h2>
          <p className='text-gray-600 text-base md:text-lg max-w-2xl mt-3 font-medium'>
            Discover products organized by category, each with unique designs and styles
          </p>
        </div>

        {/* Bento Grid */}
        <div className='grid grid-cols-4 gap-2 auto-rows-[200px] md:auto-rows-[300px] max-sm:grid-cols-2'>
          {displayCategories.map((category, index) => {
            const gridClass = getGridClass(index)
            const isWide = gridClass.includes('col-span-2')

            return (
              <div
                key={category._id || category.slug}
                className={`${gridClass} max-sm:grid-cols-2 group relative rounded-xl cursor-pointer border  transition-all duration-300`}
              >
                <Link
                  href={`/shop?type=${category.slug}`}
                  className='block h-full w-full relative rounded-xl'
                >
                  {/* Image Container */}
                  <div className='relative w-full h-full rounded-xl'>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className='object-cover transition-transform duration-700 rounded-xl'
                        sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                        unoptimized={category.image?.includes('i.ibb.co') || category.image?.includes('ibb.co')}
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5' />
                    )}

                    {/* Simple Black Overlay - Only on Hover */}
                    <div className='absolute inset-0 bg-black/40 rounded-xl opacity-0 max-md:opacity-100 60 group-hover:opacity-100 transition-opacity duration-300 z-10' />

                    {/* Content - Hidden by default, shown on hover */}
                    <div className='absolute inset-0 flex flex-col justify-end p-4 md:p-6 rounded-xl z-20 opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-300'>
                      <motion.div
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                        className='space-y-2'
                      >
                        <h3 className='text-2xl font-medium text-white leading-tight'>
                          {category.title}
                        </h3>
                        
                        <Link href={`/shop?type=${category.slug}`} className='flex items-center gap-2 text-white/90 transition-colors pt-1'>
                            <span className='text-sm'>
                              Shop Now
                            </span>
                            <ArrowRight className='w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform ' />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

       
      </div>
    </section>
  )
}

export default CategoryBentoGrid

