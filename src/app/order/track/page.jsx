'use client'
import { trackMyOrder } from '@/frontend/lib/orderActionClient'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { BsCart2, BsPhone } from 'react-icons/bs'
import { GrDeliver } from 'react-icons/gr'
import { ImSpinner2 } from 'react-icons/im'

const OrderTractPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    orderId: searchParams.get('orderId') || '',
    phoneNumber: searchParams.get('phone') || '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.orderId || !formData.phoneNumber) {
      return toast.error('Please fill all the fields')
    }
    setIsLoading(true)
    try {
      const data = await trackMyOrder(formData.orderId, formData.phoneNumber)

      if (data.error || data.message) {
        throw new Error(data.message || 'Failed to track order')
      }

      if (data._id) {
        router.push(`/order/${data._id}`)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error(error && error.message ? error.message : error)
    }
  }

  return (
    <div className='flex-grow 2xl:mx-auto 2xl:container py-16 px-4 sm:px-6 xl:px-20 2xl:px-0 w-full'>
      <div className='flex flex-col jusitfy-center items-center space-y-10'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl'>
            Track Your Order
          </h2>
          <p className='mt-4 text-medium text-gray-500'>
            Enter your order number and phone number to track your order
          </p>
        </div>
        <form onSubmit={handleSubmit} className='w-full sm:max-w-xl'>
          <h2 className='mt-5 text-base text-gray-900'>
            Order ID<span className='ms-1 text-red-500'>*</span>
          </h2>
          <div className='relative mt-3'>
            <input
              type='text'
              id='orderId'
              name='orderId'
              value={formData.orderId}
              onChange={(e) =>
                setFormData({ ...formData, orderId: e.target.value })
              }
              className='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-black focus:ring-black'
              placeholder='Eg: 1002'
            />
            <div className='pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3'>
              <BsCart2 className='h-4 w-4 text-gray-400' />
            </div>
          </div>
          <h2 className='mt-5 text-base text-gray-900'>
            Phone Number <span className='ms-1 text-red-500'>*</span>
          </h2>
          <div className='relative mt-3'>
            <input
              type='tel'
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-black focus:ring-black'
              placeholder='Eg: 98XXXXXXXX'
            />
            <div className='pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3'>
              <BsPhone className='h-4 w-4 text-gray-400' />
            </div>
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='mt-5 w-full inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center font-medium text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <ImSpinner2 className='mr-3 h-5 w-5 animate-spin' />
            ) : (
              <GrDeliver className='me-2 h-5 w-5' />
            )}
            Track Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderTractPage
