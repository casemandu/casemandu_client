import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='mx-auto py-20 px-4 sm:px-6 xl:px-20 2xl:px-16 bg-slate-100/60 w-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-3 justify-center'>
        <div className='flex flex-col'>
          <Link className='text-3xl ' href={'/'}>
            <Image
              src='/images/logo/logo.png'
              alt='Casemandu Logo'
              className='w-auto h-16 object-contain cursor-pointer'
              width={150}
              height={50}
            />
          </Link>
          <p className='mt-3'>
            © 2024 Casemandu. <br /> All Rights Reserved
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='font-medium uppercase '>About Us</h1>
          <div className='flex flex-col mt-3 gap-2'>
            <a
              target='_blank'
              className='w-fit text-sm'
              href={'https://www.instagram.com/case_mandu'}
            >
              About Us
            </a>
            <a
              target='_blank'
              className='text-sm w-fit'
              href={'https://www.instagram.com/case_mandu'}
            >
              Contact
            </a>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='font-medium uppercase '>USEFUL LINKS</h1>
          <div className='flex flex-col mt-3 gap-2'>
            <Link href={'/order/track'} className='w-fit text-sm'>
              Track Orders
            </Link>
            <a
              target='_blank'
              className='text-sm w-fit'
              href={'https://www.instagram.com/case_mandu'}
            >
              Support Policy
            </a>
            <a
              target='_blank'
              className='text-sm w-fit'
              href={'https://www.instagram.com/case_mandu'}
            >
              FAQs
            </a>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='font-medium uppercase '>FOLLOW US</h1>
          <div className='flex flex-col mt-3 gap-2'>
            <a
              target='_blank'
              className='w-fit text-sm'
              href={'https://www.instagram.com/case_mandu'}
            >
              Instagram
            </a>
            <a
              target='_blank'
              className='text-sm w-fit'
              href={'https://www.facebook.com/profile.php?id=100076330810311'}
            >
              Facebook
            </a>
            <a
              target='_blank'
              className='text-sm w-fit'
              href={'https://www.tiktok.com/@casemandu'}
            >
              Tiktok
            </a>
          </div>
        </div>
         <div className='flex flex-col gap-2'>
          <h1 className='font-medium uppercase '>Owners</h1>
          <div className='flex flex-col mt-3 gap-2'>
            <p
            >
              Sulav Timalsina
            </p>
            <p
            >
              Diya Shrestha
            </p>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
