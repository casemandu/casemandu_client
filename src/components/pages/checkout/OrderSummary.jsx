'use client'
import { addToCart, subCartQuantity } from '@/store/features/cart/cartSlice'
import Image from 'next/image'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'

const OrderSummary = () => {
  const dispatch = useDispatch()

  const { cartItems } = useSelector((state) => state.cart)

  return (
    <div className='mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6'>
      {cartItems.map((item) => (
        <div
          key={item?.product?.name + item?.variant}
          className='flex rounded-lg bg-white '
        >
          <Image
            className='m-2 rounded-md border object-cover h-24 w-24 aspect-square'
            src={item?.product?.image}
            height={100}
            width={100}
            alt={item?.product?.name}
          />

          <div className='flex items-center justify-between flex-1'>
            <div className='flex w-full flex-col px-4 py-4'>
              <span className='font-semibold'>{item?.product?.name}</span>
              <span className='text-sm float-right text-gray-400'>
                {item.variant}
              </span>
              <p className='text-md'>
                Rs {Number(item.price).toLocaleString('en')} x {item.quantity}
              </p>
            </div>
            <p className='text-md font-semibold text-nowrap'>
              Rs {Number(item.price * item.quantity).toLocaleString('en')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderSummary
