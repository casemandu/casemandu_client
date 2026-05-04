'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import { EffectFlip } from 'swiper/modules'

import { Autoplay, Pagination, Navigation } from 'swiper/modules'

const HeroSlider = () => {
  const sliderData = [
    {
      _id: 1,
      thumbImage:"images/banners/BAN1.png",
      name: 'Skins',
      slug: 'skins',
    },
    {
      _id: 2,
      thumbImage:"images/banners/BAN2.png",
      name: 'Laptop Sleeves',
      slug: 'laptop-sleeves',
    },
    {
      _id: 3,
      thumbImage:"images/banners/B3.png",
      name: 'Mobile Covers',
      slug: 'mobile-covers',
    },
    {
      _id: 4,
      thumbImage:"images/banners/BAN4.png",
      name: 'Airpods Cases',
      slug: 'airpods-cases',
    }
    
  ]

  return (
    <div className='w-full aspect-video'>
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
        className='w-full h-full relative z-10 rounded shadow-lg overflow-hidden'
      >
        {sliderData?.map((slide) => (
          <SwiperSlide key={slide._id} className='h-full'>
            <div className='relative h-full w-full'>
              <Image
                src={slide.thumbImage}
                alt={`${slide.name} banner`}
                fill
                sizes='100vw'
                quality={90}
                className='object-cover object-center'
                priority={slide._id === 1}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSlider
