import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const NotFoundPage = () => {
  return (
    <div className='flex flex-grow items-center justify-center bg-gray-50'>
      <div className='rounded-lg bg-white p-8 text-center shadow-xl'>
        <h1 className='mb-4 text-4xl font-bold'>404 Page Not Found</h1>
        <p className='text-gray-600'>
          Oops! The page you are looking for could not be found.
        </p>
        <Button asChild className='mt-4'>
          <a href='/'> Go back to Home </a>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
