'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Instagram } from 'lucide-react'

const HappyCustomers = ({ customers = [] }) => {
  if (!customers || customers.length === 0) {
    return null
  }

  // Duplicate for seamless infinite scroll
  const duplicatedCustomers = [...customers, ...customers]

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-container {
          animation: scroll 40s linear infinite;
        }

        @media (max-width: 640px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        }
      `}</style>

      <div className='py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50'>
        <div className='max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-12'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4'>
              <Instagram className='w-4 h-4' />
              Social Proof
            </div>
            <h2 className='text-3xl font-medium text-gray-900 sm:text-4xl xl:text-5xl mb-4 flex items-center gap-4'>
              Happy Customers
              <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent w-48'></div>
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl '>
              Join <span className='font-bold text-primary'>500+ satisfied customers</span> who
              love our products
            </p>
          </div>

          {/* Scrolling Container */}
          <div className='relative'>
            {/* Gradient Overlays */}
            <div className='absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent z-10 pointer-events-none' />
            <div className='absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent z-10 pointer-events-none' />

            {/* Infinite Scroll Content */}
            <div className='flex overflow-hidden'>
              <div className='scroll-container flex gap-2 sm:gap-2'>
                {duplicatedCustomers.map((customer, index) => (
                  <Link
                    href={customer?.link}
                    key={`${customer._id}-${index}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-shrink-0 group relative w-48 sm:w-56 md:w-64 lg:w-72'
                  >
                    <div className='relative aspect-[9/16] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-100'>
                      <Image
                        src={customer?.image}
                        alt={`Happy customer ${index + 1}`}
                        fill
                        className='object-cover transition-transform duration-500'
                        sizes='(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px'
                        priority={index < 5}
                        loading={index < 5 ? 'eager' : 'lazy'}
                        unoptimized={customer?.image?.includes('i.ibb.co') || customer?.image?.includes('ibb.co')}
                      />

                      

                      {/* Instagram Badge */}
                      <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full transition-opacity duration-300'>
                        <Instagram className='w-4 h-4 text-pink-600' />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

           
          </div>

          {/* CTA Button */}
          <div className='text-center mt-12'>
            <Link
              href='https://instagram.com/case_mandu'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl text-md'
            >
              <Instagram className='w-5 h-5' />
              Follow us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HappyCustomers