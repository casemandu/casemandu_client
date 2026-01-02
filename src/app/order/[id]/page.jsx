import OrderDetailsSection from '@/components/pages/orders/OrderDetailsSection'
import { getOrderById } from '@/frontend/lib/orderAction'
import React from 'react'

export const metadata = {
  title: 'Track Order',
}

const SingleOrderPage = async ({ params }) => {
  const order = await getOrderById(params.id)
  return (
    <section className='2xl:mx-auto 2xl:container py-16 px-4 sm:px-6 xl:px-20 2xl:px-0 w-full flex-grow'>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-center items-center '>
          <h1 className='text-3xl xl:text-4xl font-semibold xl:leading-9 text-gray-800'>
            Thank you for your order
          </h1>
        </div>
        <div className='mt-5'>
          <OrderDetailsSection order={order} />
        </div>
      </div>
    </section>
  )
}

export default SingleOrderPage
