'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  addToCart,
  removeFromCart,
  subCartQuantity,
} from '@/store/features/cart/cartSlice'
import { LucideShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi'
import { BsCart, BsHandbag } from 'react-icons/bs'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

const Cart = () => {
  const dispatch = useDispatch()

  const { cartItems } = useSelector((state) => state.cart)

  return (
    <Sheet>
      <SheetTrigger>
        <div className='relative py-2'>
          <div className='t-0 absolute left-3'>
            <p className='flex h-2 w-2 items-center justify-center rounded-full bg-priimary p-3 text-xs text-white'>
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
          </div>

          <LucideShoppingCart className='h-6 w-6 mt-4' />
        </div>
      </SheetTrigger>
      <SheetContent className='flex flex-col '>
        <SheetHeader>
          <SheetTitle>Cart Items</SheetTitle>
        </SheetHeader>
        {cartItems?.length !== 0 ? (
          <>
            <div className='flex-grow overflow-auto'>
              {cartItems?.map((item, index) => (
                <div
                  key={item.product?.name + index}
                  className='py-4 flex items-center justify-between border-b'
                >
                  <div className='flex items-center gap-3 w-full'>
                    <img
                      src={item?.product?.image}
                      alt={item?.product?.name}
                      className='object-cover rounded-md aspect-square w-16 h-16 sm:w-20 sm:h-20'
                      width={100}
                      height={100}
                    />

                    <div className='flex flex-col w-full'>
                      <div className='flex justify-between items-start'>
                        <div className='flex flex-col'>
                          <h5 className='text-base'>{item?.product?.name}</h5>
                          <p className='text-black/65 text-sm mt-1'>
                            {item.variant}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to remove this item?'
                              )
                            )
                              dispatch(
                                removeFromCart({
                                  product: {
                                    _id: item?.product?._id,
                                    name: item?.product?.name,
                                    image: item?.product?.image,
                                  },
                                  variant: item?.variant,
                                })
                              )
                          }}
                          className='h-10 w-10 flex items-center justify-center text-black hover:text-black/90'
                        >
                          <BiTrash />
                        </button>
                      </div>
                      <div className='flex justify-between'>
                        <div className='flex mt-2 h-10'>
                          <button
                            onClick={() =>
                              dispatch(
                                subCartQuantity({
                                  product: {
                                    _id: item?.product?._id,
                                    name: item?.product?.name,
                                    image: item?.product?.image,
                                  },
                                  quantity: 1,
                                  variant: item?.variant,
                                })
                              )
                            }
                            className='bg-white border border-e-0 w-12 flex items-center justify-center rounded-s-md hover:bg-gray-100'
                          >
                            <BiMinus />
                          </button>

                          <div className='border w-16 outline-none flex items-center justify-center'>
                            {item.quantity}
                          </div>
                          <button
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  product: {
                                    _id: item?.product?._id,
                                    name: item?.product?.name,
                                    image: item?.product?.image,
                                  },
                                  quantity: 1,
                                  variant: item?.variant,
                                })
                              )
                            }
                            className='bg-white border border-s-0 w-12 flex items-center justify-center rounded-e-md hover:bg-gray-100'
                          >
                            <BiPlus />
                          </button>
                        </div>
                        <p className='self-end'>
                          Rs{' '}
                          {Number(item.price * item.quantity).toLocaleString(
                            'en'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}{' '}
            </div>
            <div className='pt-4 border-t'>
              <div className='flex justify-between'>
                <p className='font-semibold'>Subtotal</p>
                <p>
                  Rs{' '}
                  {Number(
                    cartItems?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )
                  ).toLocaleString('en')}
                </p>
              </div>
              <div className='flex justify-between mb-4'>
                <p className='font-semibold'>Shipping</p>
                <p>Cost will appear on checkout</p>
              </div>

              <SheetClose asChild>
                <Link
                  href='/checkout'
                  className='sm:mt-0 w-full inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center font-medium text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <BsCart className='me-2 h-5 w-5' />
                  Checkout
                </Link>
              </SheetClose>
            </div>
          </>
        ) : (
          <div className='flex-grow flex flex-col items-center justify-center gap-3'>
            <h1 className='text-xl'>No items in cart</h1>
            <SheetClose asChild>
              <Link
                href='/shop'
                type='button'
                className='inline-flex w-auto rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center font-medium text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800'
              >
                <BsHandbag className='h-5 w-5 me-2' />
                Shop Now
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart
