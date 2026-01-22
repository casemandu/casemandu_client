'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  addToCart,
  removeFromCart,
  subCartQuantity,
  setCartOpen,
} from '@/store/features/cart/cartSlice'
import { LucideShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi'
import { BsCart, BsHandbag } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'

const CartContainer = () => {
  const dispatch = useDispatch()
  const { cartItems, isCartOpen } = useSelector((state) => state.cart)
  const scrollPositionRef = useRef(0)

  // Lock body scroll when cart is open (matching SearchSidebar pattern)
  useEffect(() => {
    if (isCartOpen) {
      // Store current scroll position
      scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Lock body and html scroll
      const body = document.body
      const html = document.documentElement
      
      // Store original values
      const originalBodyOverflow = body.style.overflow
      const originalBodyPosition = body.style.position
      const originalBodyTop = body.style.top
      const originalBodyLeft = body.style.left
      const originalBodyRight = body.style.right
      const originalBodyWidth = body.style.width
      const originalBodyPaddingRight = body.style.paddingRight
      const originalHtmlOverflow = html.style.overflow

      // Lock scroll
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollPositionRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      html.style.overflow = 'hidden'
      
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`
      }

      // Stop Lenis smooth scroll
      if (!html.classList.contains('lenis')) {
        html.classList.add('lenis')
      }
      html.classList.add('lenis-stopped')
      
      // Prevent Lenis from scrolling
      html.setAttribute('data-lenis-prevent', 'true')
      body.setAttribute('data-lenis-prevent', 'true')

      // Cleanup function
      return () => {
        const scrollY = scrollPositionRef.current
        
        // Restore original styles
        body.style.overflow = originalBodyOverflow
        body.style.position = originalBodyPosition
        body.style.top = originalBodyTop
        body.style.left = originalBodyLeft
        body.style.right = originalBodyRight
        body.style.width = originalBodyWidth
        body.style.paddingRight = originalBodyPaddingRight
        html.style.overflow = originalHtmlOverflow
        
        // Remove Lenis stop class
        html.classList.remove('lenis-stopped')
        
        // Remove Lenis prevent attributes
        html.removeAttribute('data-lenis-prevent')
        body.removeAttribute('data-lenis-prevent')
        
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollY,
            behavior: 'auto'
          })
        })
      }
    }
  }, [isCartOpen])

  const [itemToRemove, setItemToRemove] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Disable pointer events on Sheet overlay when modal is open
  useEffect(() => {
    if (itemToRemove && mounted) {
      // Find and disable pointer events on Sheet overlay
      const sheetOverlay = document.querySelector('[data-radix-dialog-overlay]')
      if (sheetOverlay) {
        sheetOverlay.style.pointerEvents = 'none'
      }

      return () => {
        // Re-enable pointer events when modal closes
        if (sheetOverlay) {
          sheetOverlay.style.pointerEvents = 'auto'
        }
      }
    }
  }, [itemToRemove, mounted])

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const handleRemoveClick = (item, e) => {
    // Prevent any event from bubbling up
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setItemToRemove(item)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(
        removeFromCart({
          product: {
            _id: itemToRemove?.product?._id,
            name: itemToRemove?.product?.name,
            image: itemToRemove?.product?.image,
          },
          variant: itemToRemove?.variant,
        })
      )
      setItemToRemove(null)
    }
  }

  const handleCancelRemove = () => {
    setItemToRemove(null)
  }

  return (
    <>
      {/* Remove Confirmation Modal - Rendered in Portal */}
      {itemToRemove && mounted && createPortal(
        <div
          className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50'
          onClick={handleCancelRemove}
          style={{
            pointerEvents: 'auto',
            zIndex: 9999
          }}
        >
          <div
            className='flex items-start gap-4 min-w-[320px] max-w-[90vw] bg-white p-5 rounded-2xl shadow-2xl border border-gray-200 relative'
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              pointerEvents: 'auto',
              zIndex: 10000,
              position: 'relative'
            }}
          >
            {/* Product Image */}
            <div className='relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100'>
              <Image
                src={itemToRemove?.product?.image}
                alt={itemToRemove?.product?.name}
                fill
                className='object-cover'
              />
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
                <BiTrash className='h-5 w-5 text-red-500 flex-shrink-0' />
                <span className='text-base font-semibold text-gray-900'>Remove item?</span>
              </div>
              <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                {itemToRemove?.product?.name}
                {itemToRemove?.variant && (
                  <span className='text-gray-500'> - {itemToRemove.variant}</span>
                )}
              </p>

              {/* Actions */}
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelRemove()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className='px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all cursor-pointer'
                  style={{ pointerEvents: 'auto' }}
                >
                  Keep
                </button>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleConfirmRemove()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className='px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all shadow-sm cursor-pointer'
                  style={{ pointerEvents: 'auto' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <Sheet
        open={isCartOpen}
        onOpenChange={(open) => {
          if (!itemToRemove) {
            dispatch(setCartOpen(open))
          }
        }}
      >
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
      <SheetContent
        side='right'
        className='flex flex-col w-full sm:max-w-md bg-white p-0 overflow-hidden h-[calc(var(--vh,1vh)*100)] sm:h-full'
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='border-b border-gray-200 px-6 pt-6 pb-4 flex-shrink-0'>
            <SheetTitle className='text-xl font-bold text-gray-900'>
              Shopping Cart
              {cartItems.length > 0 && (
                <span className='ml-2 text-sm font-normal text-gray-500'>
                  ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
              )}
            </SheetTitle>
          </div>

          {cartItems?.length !== 0 ? (
            <>
              {/* Scrollable Cart Items */}
              <div 
                className='flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 min-h-0 max-h-full overscroll-contain touch-pan-y'
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className='space-y-4'>
                  {cartItems?.map((item, index) => (
                    <div
                      key={item.product?.name + index}
                      className='flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Product Image */}
                      <div className='relative flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200'>
                        <Image
                          src={item?.product?.image}
                          alt={item?.product?.name}
                          fill
                          className='object-cover'
                        />
                      </div>

                      {/* Product Details */}
                      <div className='flex flex-col flex-1 min-w-0'>
                        <div className='flex justify-between items-start gap-2'>
                          <div className='flex-1 min-w-0'>
                            <h5 className='text-sm font-semibold text-gray-900 line-clamp-2'>
                              {item?.product?.name}
                            </h5>
                            {item.variant && (
                              <p className='text-xs text-gray-500 mt-1 truncate'>
                                {item.variant}
                              </p>
                            )}
                          </div>
                          <button
                            onPointerDown={(e) => {
                              e.stopPropagation()
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              handleRemoveClick(item, e)
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                            }}
                            className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0'
                          >
                            <BiTrash className='h-4 w-4' />
                          </button>
                        </div>

                        {/* Price & Quantity */}
                        <div className='flex items-center justify-between mt-auto pt-2'>
                          <div className='flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden'>
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
                              className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600'
                            >
                              <BiMinus className='h-3 w-3' />
                            </button>
                            <span className='w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-200'>
                              {item.quantity}
                            </span>
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
                              className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600'
                            >
                              <BiPlus className='h-3 w-3' />
                            </button>
                          </div>
                          <p className='text-sm font-bold text-gray-900'>
                            Rs {Number(item.price * item.quantity).toLocaleString('en')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with Checkout - Fixed at bottom */}
              <div className='border-t border-gray-200 px-6 py-6 bg-white flex-shrink-0'>
                <div className='space-y-3 mb-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='text-lg font-bold text-gray-900'>
                      Rs {Number(subtotal).toLocaleString('en')}
                    </span>
                  </div>
                 
                </div>

                <SheetClose asChild>
                  <Link
                    href='/checkout'
                    className='w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary/90 active:scale-[0.98]'
                  >
                    Proceed to Checkout
                  </Link>
                </SheetClose>

               
              </div>
            </>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center gap-4 p-6'>
              <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center'>
                <LucideShoppingCart className='h-10 w-10 text-gray-400' />
              </div>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Your cart is empty
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Add items to get started
                </p>
              </div>
              <SheetClose asChild>
                <Link
                  href='/shop'
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'
                >
                  Start Shopping
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}

export default CartContainer
