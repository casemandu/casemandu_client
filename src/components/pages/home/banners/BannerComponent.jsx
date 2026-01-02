import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BannerComponent = async () => {
  const banners = [
    {
      _id: '656358a2224e09e6af9c4d9f',
      image: '/images/categories/banner_1.png',
      link: '/shop/cases',
      display: 1,
      createdAt: '2023-11-26T14:39:30.205Z',
      updatedAt: '2023-12-11T05:43:47.590Z',
      __v: 0,
    },
    {
      _id: '656358ad224e09e6af9c4da2',
      image: '/images/categories/banner_2.png',
      link: '/shop/popsockets',
      display: 2,
      createdAt: '2023-11-26T14:39:41.751Z',
      updatedAt: '2023-11-27T12:03:00.323Z',
      __v: 0,
    },
    {
      _id: '656358b5224e09e6af9c4da5',
      image: 'https://i.ibb.co/7t7Pc3D/banner-3.png',
      link: '/shop',
      display: 3,
      createdAt: '2023-11-26T14:39:49.620Z',
      updatedAt: '2023-11-28T16:18:50.165Z',
      __v: 0,
    },
    {
      _id: '656358be224e09e6af9c4da8',
      image: '/images/categories/banner_4.png',
      link: '/shop/mousepads',
      display: 4,
      createdAt: '2023-11-26T14:39:58.966Z',
      updatedAt: '2023-11-27T12:03:59.446Z',
      __v: 0,
    },
    {
      _id: '656358c6224e09e6af9c4dab',
      image: '/images/categories/banner_5.png',
      link: '/shop/laptop-sleeves',
      display: 5,
      createdAt: '2023-11-26T14:40:06.925Z',
      updatedAt: '2023-11-27T12:04:28.467Z',
      __v: 0,
    },
  ]
  return (
    <div className='py-10 md:py-16 px-4 sm:px-6 xl:px-20 2xl:px-16 flex flex-col gap-3'>
      <div className='grid lg:grid-cols-2 gap-3'>
        <Link href={banners[0]?.link} className='overflow-hidden rounded'>
          {(banners[0]?.image.endsWith('.mp4') && (
            <video autoPlay muted loop src={banners[0]?.image} />
          )) || (
            <Image
              src={banners[0]?.image}
              alt={banners[0]?.link}
              width={1000}
              height={1000}
              className='object-cover w-full h-full rounded shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl'
            />
          )}
        </Link>
        <div className='grid grid-cols-2 gap-3'>
          <Link href={banners[1]?.link} className='overflow-hidden rounded'>
            <Image
              src={banners[1]?.image}
              alt={banners[1]?.link}
              width={1000}
              height={1000}
              className='object-cover w-full h-full rounded shadow-lg overflow-hidden  transition-all duration-300 hover:scale-105 hover:shadow-xl'
            />
          </Link>
          <Link href={banners[2]?.link} className='overflow-hidden rounded'>
            <Image
              src={banners[2]?.image}
              alt={banners[2]?.link}
              width={1000}
              height={1000}
              className='object-cover w-full h-full rounded shadow-lg overflow-hidden  transition-all duration-300 hover:scale-105 hover:shadow-xl'
            />
          </Link>
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-3'>
        <Link href={banners[3]?.link} className='overflow-hidden rounded'>
          <Image
            src={banners[3]?.image}
            alt={banners[3]?.link}
            width={1000}
            height={1000}
            className='object-cover w-full h-full rounded shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl'
          />
        </Link>
        <Link href={banners[4]?.link} className='overflow-hidden rounded'>
          <Image
            src={banners[4]?.image}
            alt={banners[4]?.link}
            width={1000}
            height={1000}
            className='object-cover w-full h-full rounded shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl'
          />
        </Link>
      </div>
    </div>
  )
}

export default BannerComponent
