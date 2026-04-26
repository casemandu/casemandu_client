'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import banner1 from '../../../../../public/images/banners/banner1.png'
import banner2 from '../../../../../public/images/banners/BANNER2.png'
import banner3 from '../../../../../public/images/banners/BANNER3.png'
import banner4 from '../../../../../public/images/banners/BANNER4.png'

import { EffectFlip } from 'swiper/modules'

import { Autoplay, Pagination, Navigation } from 'swiper/modules'

const HeroSlider = () => {
  const sliderData = [
    {
      _id: 1,
      thumbImage: banner1,
      name: 'Skins',
      slug: 'skins',
    },
    {
      _id: 2,
      thumbImage: banner2,
      name: 'Laptop Sleeves',
      slug: 'laptop-sleeves',
    },
    {
      _id: 3,
      thumbImage: banner3,
      name: 'Mobile Covers',
      slug: 'mobile-covers',
    },
    {
      _id: 4,
      thumbImage: banner4,
      name: 'Airpods Cases',
      slug: 'airpods-cases',
    }
    
  ]

  return (
    <div className='w-full bg-transparent h-[13rem] sm:h-[22rem] md:h-[28rem] lg:h-[34rem] xl:h-[38rem]'>
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
                className='object-cover object-top'
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
