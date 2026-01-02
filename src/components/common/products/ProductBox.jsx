'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const ProductBox = ({ product, type }) => {
  const pathname = usePathname()
  const isOfferPage = pathname?.includes('offer')
  const isShopPage = pathname?.includes('shop')

  const calculateRangeText = (product) => {
    if (product?.discount) {
      const discountPrice = (product?.price * product?.discount) / 100
      const finalPrice = product?.price - discountPrice
      return `Rs ${Number(finalPrice).toLocaleString('en')}`
    }
    return `Rs ${Number(product?.price).toLocaleString('en')}`
  }

  if (!product) return null

  return (
    <div className='overflow-hidden rounded-xl border group border-transparent hover:border-primary transition-all duration-300 cursor-pointer bg-white'>
      <Link href={`/${type}/${product?.slug}`} className='block'>
        <div className='mb-3 overflow-hidden relative'>
         
          {product?.discount ? (
            <span className='absolute top-0 right-0 bg-primary px-2 py-1 text-center text-sm max-sm:text-xs font-medium text-primary-foreground z-10 rounded-tr'>
             {Number(product?.discount).toFixed(2)}% OFF
            </span>
           ) : null}
          {product?.isNew && (
            <span className='absolute top-0 left-0 px-2 py-1 bg-primary text-center text-sm max-sm:text-xs text-white z-10 rounded-tl'>
              New
            </span>
          )}
          <div className='relative aspect-square overflow-hidden rounded-lg bg-white'>
            <Image
              src={product?.image}
              alt={product?.title}
              fill
              className='object-cover w-full transition-all h-full group-hover:scale-105 duration-300 transform rounded-lg'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              loading='lazy'
              unoptimized={product?.image?.includes('i.ibb.co') || product?.image?.includes('ibb.co')}
            />
          </div>
        </div>
      </Link>
      <div className='pb-4  flex justify-between flex-col px-4'>
        <div className='flex flex-col items-center'>
          <p className='mb-0.5 text-xs font-semibold text-primary group-hover:text-black uppercase'>
            {product?.category?.title}
          </p>
          <Link href={`/${type}/${product?.slug}`}>
            <h3 className='text-base text-gray-800 group-hover:text-primary transition-colors'>
              {product?.title}
            </h3>
          </Link>
          <div className='flex flex-shrink-0 mt-1'>
          {isShopPage ? (
            // On shop pages, just show price as-is (no discount calculation)
            <div className='text-right'>
              <p className='text-md font-medium text-gray-900 flex-shrink-0'>
                Rs. {product?.price}
              </p>
            </div>
          ) : product?.discount && isOfferPage ? (
            // On offer pages with discount, calculate and show discount
            <div className='text-right'>
              <p className='text-md font-medium text-gray-900 line-through'>
                Rs {Number(product?.price).toLocaleString('en')}
              </p>
              <p className='text-md font-medium text-gray-900 flex-shrink-0'>
                Rs.{calculateRangeText(product)}
              </p>
            </div>
          ) : (
            // Default: show price as-is
            <div className='text-right'>
              <p className='text-md font-medium text-gray-900 flex-shrink-0'>
                Rs. {product?.price}
              </p>
            </div>
          )}
        </div>

        </div>
          
      </div>
    </div>
  )
}

export default ProductBox
