'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import React from 'react'
import { Autoplay, Pagination, Navigation, EffectFlip } from 'swiper/modules'
import Image from 'next/image'
// Import Swiper CSS - Next.js will code-split this automatically
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const HeroSlider = () => {
  const sliderData = [
    {
      _id: 1,
      thumbImage: '/images/banners/banner_1.png',
      name: 'Skins',
      slug: 'skins',
    },
    {
      _id: 2,
      thumbImage: '/images/banners/banner_2.png',
      name: 'Laptop Sleeves',
      slug: 'laptop-sleeves',
    },
    {
      _id: 3,
      thumbImage: '/images/banners/banner_3.png',
      name: 'Mobile Covers',
      slug: 'mobile-covers',
    },
  ]

  return (
    <div className='w-full bg-transparent xl:min-h-[70vh] h-[15rem] sm:h-[30rem] md:h-[40rem] lg:h-111'>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFlip]}
        className='w-full relative z-10 h-full rounded shadow-lg overflow-hidden'
      >
        {sliderData?.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className='relative h-full w-full'>
              <Image
                src={slide.thumbImage}
                alt={slide.name}
                fill
                priority={slide._id === 1} // Only first image is priority
                className='object-cover'
                sizes='100vw'
                quality={85}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSlider
