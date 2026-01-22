'use client'
import { getOnlyProducts } from '@/frontend/lib/productActions'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { GrSearch } from 'react-icons/gr'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'

const SearchSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollPositionRef = useRef(0)
  const router = useRouter()

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth

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

      // Stop Lenis smooth scroll (add lenis class if not present, then add stopped)
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
  }, [isOpen])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true)
        try {
          const products = await getOnlyProducts({ keyword: searchQuery, pageSize: 20, pageNumber: 1 })
          setSearchResults(products || [])
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  const handleProductClick = () => {
    setSearchQuery('')
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className='relative py-2 text-white hover:text-gray-200 transition-colors'>
          <GrSearch className='h-6 w-6 mt-4' />
        </button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='flex flex-col w-full sm:max-w-md bg-white p-0 overflow-hidden h-[calc(var(--vh,1vh)*100)] sm:h-full'
      >
        <div className='flex flex-col h-full'>
          <SheetHeader className='border-b border-gray-200 px-6 pt-6 pb-4 flex-shrink-0'>
            <SheetTitle className='text-2xl font-bold text-gray-900'>
              Search Products
            </SheetTitle>
          </SheetHeader>

          {/* Search Input */}
          <div className='px-6 pt-6 flex-shrink-0'>
            <form onSubmit={handleSearch} className='relative'>
              <div className='relative flex items-center'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search products...'
                  className='w-full px-4 py-3 pl-11 pr-11 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-gray-400'
                  autoFocus
                />
                <GrSearch className='absolute left-3 h-5 w-5 text-gray-400 pointer-events-none' />
                {isLoading && (
                  <div className='absolute right-3'>
                    <ImSpinner2 className='h-5 w-5 animate-spin text-primary' />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Search Results - Scrollable Area */}
          <div className='flex-1 overflow-y-auto overflow-x-hidden mt-6 px-6 pb-6 min-h-0 max-h-full overscroll-contain touch-pan-y' style={{ WebkitOverflowScrolling: 'touch' }}>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <ImSpinner2 className='h-8 w-8 animate-spin text-primary mb-4' />
              <p className='text-sm text-gray-500'>Searching...</p>
            </div>
          ) : searchQuery.trim().length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <GrSearch className='h-16 w-16 text-gray-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Start searching
              </h3>
              <p className='text-sm text-gray-500 text-center max-w-sm'>
                Enter a product name or keyword to find what you're looking for.
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className='space-y-2'>
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug || product._id}`}
                    onClick={handleProductClick}
                    className='flex items-center gap-4 p-4 rounded-lg hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 group'
                  >
                    <div className='relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden ring-1 ring-gray-200 group-hover:ring-primary/30 transition-all'>
                      <Image
                        src={product.image}
                        alt={product.title || product.name || 'Product'}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-base font-semibold text-gray-900 truncate group-hover:text-primary transition-colors'>
                        {product.title || product.name}
                      </h4>
                      {product.category?.title && (
                        <p className='text-sm text-gray-500 mt-1'>
                          {product.category.title}
                        </p>
                      )}
                      <p className='text-base font-bold text-primary mt-2'>
                        {product.discount
                          ? `Rs ${Number(
                              product.price -
                                (product.price * product.discount) / 100
                            ).toLocaleString('en')}`
                          : `Rs ${Number(product.price).toLocaleString('en')}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {searchQuery.trim() && (
                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <SheetClose asChild>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={handleProductClick}
                      className='block w-full text-center py-3 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 border border-primary/20 hover:border-primary/40'
                    >
                      View all results for "{searchQuery}"
                    </Link>
                  </SheetClose>
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='relative mb-4'>
                <GrSearch className='h-16 w-16 text-gray-300' />
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='h-12 w-12 rounded-full bg-gray-100'></div>
                </div>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No products found
              </h3>
              <p className='text-sm text-gray-500 text-center max-w-sm mb-4'>
                We couldn't find any products matching "{searchQuery}".
              </p>
              
            </div>
          )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SearchSidebar

