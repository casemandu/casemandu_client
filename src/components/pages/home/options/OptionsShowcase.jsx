'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const OptionsShowcase = ({ options = [] }) => {
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  
  if (!options || options.length === 0) return null

  const displayOptions = options
    .filter((option) => option?.displayOnHome !== false)

  if (displayOptions.length === 0) return null

  const buildOptionHref = (route = '') => {
    const sanitized = route.replace('/', '').trim()
    return sanitized ? `/shop?option=${encodeURIComponent(sanitized)}` : '/shop'
  }

  const scrollToCard = useCallback((index, behavior = 'smooth') => {
    const container = containerRef.current
    const card = cardRefs.current[index]
    if (!container || !card) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const offset =
      cardRect.left -
      containerRect.left -
      containerRect.width / 2 +
      cardRect.width / 2

    container.scrollBy({
      left: offset,
      behavior,
    })
  }, [])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, displayOptions.length)
  }, [displayOptions.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const containerCenter = container.scrollLeft + container.clientWidth / 2
        let closestIndex = 0
        let smallestDistance = Infinity

        cardRefs.current.forEach((card, index) => {
          if (!card) return
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const distance = Math.abs(containerCenter - cardCenter)
          if (distance < smallestDistance) {
            smallestDistance = distance
            closestIndex = index
          }
        })

        setActiveIndex(closestIndex)
        ticking = false
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [displayOptions.length])

  useEffect(() => {
    if (displayOptions.length <= 1) return
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % displayOptions.length
      scrollToCard(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, displayOptions.length, scrollToCard])

  return (
    <section className='py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden'>
      <div className='max-w-[1920px] mx-auto'>
        {/* Section Header */}
        <div className='max-sm:px-4 px-8 mb-8 md:mb-12'>
          <div className='flex items-baseline gap-3 mb-3'>
            <span className='text-sm md:text-base font-semibold text-primary uppercase tracking-wider'>
              COOL AND AESTHETIC DESIGNS
            </span>
            <div className='flex-1 h-px bg-gradient-to-r from-primary to-transparent max-w-[100px]'></div>
          </div>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight'>
                Shop by Categories
              </h2>
              <p className='text-gray-600 text-base md:text-lg max-w-2xl mt-3 font-medium'>
                Pick an option to browse curated designs, combos, and ready-to-go inspirations.
              </p>
            </div>
            <p className='text-sm text-gray-500 md:text-right'>
              Scroll to explore →
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={containerRef}
          className='flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 snap-x snap-mandatory'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {displayOptions.map((option, index) => {
            const description = option?.shortDescription || option?.description || ''
            
            return (
              <Link
                key={option?._id || option?.route}
                href={buildOptionHref(option?.route || '')}
                className='flex-shrink-0 snap-center cursor-pointer'
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                onClick={(e) => {
                  // Ensure the link navigation works
                  e.stopPropagation()
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1 }}
                  className='group relative w-[260px] md:w-[340px] lg:w-[360px] h-[420px] md:h-[500px] rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer'
                >
                  {/* Image Container */}
                  <div className='absolute inset-0'>
                    {option?.image ? (
                      <>
                        <Image
                          src={option.image}
                          alt={option?.name || 'Option'}
                          fill
                          className='object-cover transition-transform duration-700 group-hover:scale-105'
                          sizes='(max-width: 768px) 320px, 420px'
                          loading='lazy'
                          unoptimized={option.image?.includes('i.ibb.co') || option.image?.includes('ibb.co')}
                        />
                        <div className='absolute inset-0 rounded-3xl bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent' />
                      </>
                    ) : (
                      <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-gray-100' />
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className='absolute inset-0 flex flex-col justify-between p-8'>
                    {/* Top Section - Number */}
                    <div className='flex justify-between items-start'>
                      <div className='text-white/40 font-bold text-6xl md:text-7xl leading-none'>
                        0{index + 1}
                      </div>
                      <div className='w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white transform group-hover:rotate-45 group-hover:border-white transition-all duration-500'>
                        <svg 
                          className='w-6 h-6' 
                          fill='none' 
                          viewBox='0 0 24 24' 
                          stroke='currentColor'
                        >
                          <path 
                            strokeLinecap='round' 
                            strokeLinejoin='round' 
                            strokeWidth={2} 
                            d='M7 17L17 7M17 7H7M17 7V17' 
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Section - Text */}
                    <div className='space-y-4 transform group-hover:translate-y-[-8px] transition-transform duration-500'>
                      <div className='space-y-2'>
                        <h3 className='text-2xl md:text-3xl font-semibold text-white leading-tight'>
                          {option?.name}
                        </h3>
                      </div>
                      
                      {description && (
                        <p className='text-white/80 text-base leading-relaxed line-clamp-3'>
                          {description}
                        </p>
                      )}

                      {/* Explore Text */}
                      <div className='pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0'>
                        <div className='inline-flex items-baseline gap-2'>
                          <span className='text-white font-semibold text-lg'>
                            Explore Collection
                          </span>
                          <span className='text-white text-2xl transform group-hover:translate-x-2 transition-transform duration-500'>
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className='absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500' />
                </motion.div>
              </Link>
            )
          })}

          {/* End Spacer for better scroll experience */}
          <div className='flex-shrink-0 w-4 md:w-8' />
        </div>

        {/* Scroll Indicator Dots */}
        <div className='flex justify-center gap-2 mt-8 px-4'>
          {displayOptions.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to option ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className='text-center mt-8 px-4'>
          <Link href='/shop'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='inline-block'
            >
              <span className='text-gray-900 font-semibold text-lg border-b-2 border-gray-900 pb-1 hover:border-primary hover:text-primary transition-all duration-300'>
                View All Options
              </span>
            </motion.div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default OptionsShowcase