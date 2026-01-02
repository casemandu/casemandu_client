'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
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
import Image from 'next/image'
import Link from 'next/link'
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi'
import { BsCart, BsHandbag } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

const CartContainer = () => {
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state.cart)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='relative py-2 text-white hover:text-gray-200 transition-colors flex-shrink-0'>
          {cartItems.length > 0 && (
            <div className='absolute top-3 -right-3 z-10'>
              <span className='flex min-w-[20px] h-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg ring-2 ring-gray-900 px-1'>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 99
                  ? '99+'
                  : cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
          )}
          <LucideShoppingCart className='h-6 w-6 mt-4' />
        </button>
      </SheetTrigger>
      <SheetContent className='flex flex-col w-full sm:max-w-md bg-white'>
        <SheetHeader className='border-b border-gray-200 pb-4'>
          <SheetTitle className='text-2xl font-bold text-gray-900'>
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        {cartItems?.length !== 0 ? (
          <>
            <div className='flex-grow overflow-y-auto mt-6'>
              {cartItems?.map((item, index) => (
                <div
                  key={item.product?.name + index}
                  className='py-4 flex items-start gap-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2'
                >
                  <div className='relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden ring-1 ring-gray-200'>
                    <Image
                      src={item?.product?.image}
                      alt={item?.product?.name}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex flex-col flex-1 min-w-0'>
                    <div className='flex justify-between items-start gap-2'>
                      <div className='flex flex-col flex-1 min-w-0'>
                        <h5 className='text-base font-semibold text-gray-900 truncate'>
                          {item?.product?.name}
                        </h5>
                        {item.variant && (
                          <p className='text-sm text-gray-500 mt-0.5'>
                            {item.variant}
                          </p>
                        )}
                        <p className='text-base font-bold text-primary mt-2'>
                          Rs{' '}
                          {Number(item.price * item.quantity).toLocaleString(
                            'en'
                          )}
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
                        className='h-8 w-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 flex-shrink-0'
                      >
                        <BiTrash className='h-5 w-5' />
                      </button>
                    </div>
                    <div className='flex items-center gap-3 mt-3'>
                      <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
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
                          className='w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600'
                        >
                          <BiMinus className='h-4 w-4' />
                        </button>
                        <div className='w-12 h-10 flex items-center justify-center border-x border-gray-300 font-semibold text-gray-900 bg-gray-50'>
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
                          className='w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600'
                        >
                          <BiPlus className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='pt-4 border-t border-gray-200 mt-4 space-y-4 bg-gray-50/50 -mx-6 -mb-6 px-6 pb-6 rounded-t-xl'>
              <div className='flex justify-between items-center'>
                <p className='text-lg font-semibold text-gray-700'>Subtotal</p>
                <p className='text-lg font-bold text-primary'>
                  Rs{' '}
                  {Number(
                    cartItems?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )
                  ).toLocaleString('en')}
                </p>
              </div>
              <div className='flex justify-between items-center text-sm text-gray-500'>
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>

              <SheetClose asChild>
                <Link
                  href='/checkout'
                  className='w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-center font-semibold text-white transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]'
                >
                  <BsCart className='mr-2 h-5 w-5' />
                  Proceed to Checkout
                </Link>
              </SheetClose>
            </div>
          </>
        ) : (
          <div className='flex-grow flex flex-col items-center justify-center gap-4 py-12'>
            <div className='relative'>
              <LucideShoppingCart className='h-16 w-16 text-gray-300' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='h-12 w-12 rounded-full bg-gray-100'></div>
              </div>
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>
              Your cart is empty
            </h3>
            <p className='text-sm text-gray-500 text-center max-w-sm'>
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Link
                href='/shop'
                className='inline-flex items-center rounded-lg bg-primary px-6 py-3.5 text-center font-semibold text-white transition-all duration-200 ease-in-out hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]'
              >
                <BsHandbag className='mr-2 h-5 w-5' />
                Start Shopping
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartContainer
