'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const CustomizeSection = () => {
  return (
    <section className='py-12 md:py-16 max-sm:px-4 px-8 bg-gradient-to-br from-primary/5 via-white to-primary/5 relative overflow-hidden rounded-2xl'>
     

      <div className='max-w-[1920px] mx-auto relative z-10'>
        <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          {/* Left Side - Content */}
          <div className='space-y-6 md:space-y-8 order-2 lg:order-1'>
            <div className='space-y-4'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight'>
                Create Your Own
                <br />
                <span className='text-primary'>Custom Design</span>
              </h2>
              <p className='text-gray-600 text-base md:text-lg max-w-xl font-medium leading-relaxed'>
                Personalize your phone case with your own images.
              </p>

             <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent'></div>

            </div>

            {/* Features */}
            <div className='grid sm:grid-cols-2 gap-4 pt-4'>
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Upload Your Design</h3>
                  <p className='text-sm text-gray-600'>Add your own images or artwork</p>
                </div>
              </div>
              
              <div className='flex items-start gap-3'>
                <div className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0'></div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>Premium Quality</h3>
                  <p className='text-sm text-gray-600'>High-quality printing & materials</p>
                </div>
              </div>
              
            </div>

          

            {/* CTA Button */}
              <Link href='https://customize.casemandu.com.np/' target='_blank' rel='noopener noreferrer' className='w-full rounded-2xl'>
                <Button
                  size='lg'
                  className='group bg-primary hover:bg-primary/90 text-white px-8 py-6 mt-8 text-base font-semibold  transition-all duration-300 rounded-xl'
                >
                  Customize Now
                </Button>
              </Link>
          </div>

          {/* Right Side - Image */}
          <div className='relative order-1 lg:order-2'>
            <div className='relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-gray-100'>
              <Image
                src='https://i.ibb.co/fYJNm6qJ/assets-task-01k4dg53fsem691jh01ye68cr3-1757094915-img-1.webp'
                alt='Customize Your Phone Case'
                fill
                className='object-cover rounded-2xl transition-opacity duration-500'
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
                unoptimized
                loading='eager'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomizeSection
