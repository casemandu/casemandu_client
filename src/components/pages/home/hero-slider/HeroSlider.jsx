'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import React, { useRef, useState } from 'react'

import { EffectFlip } from 'swiper/modules'

import { Autoplay, Pagination, Navigation } from 'swiper/modules'

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
            <div
              className='h-full w-full bg-cover bg-center bg-no-repeat'
              style={{
                backgroundImage: `url(${slide.thumbImage})`,
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default HeroSlider
