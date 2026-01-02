'use client'
import { getOnlyProducts } from '@/frontend/lib/productActions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GrSearch } from 'react-icons/gr'
import { ImSpinner2 } from 'react-icons/im'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true)
        try {
          const products = await getOnlyProducts({ keyword: searchQuery, pageSize: 5, pageNumber: 1 })
          setSearchResults(products || [])
          setShowDropdown(true)
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowDropdown(false)
      setSearchQuery('')
    }
  }

  const handleProductClick = () => {
    setShowDropdown(false)
    setSearchQuery('')
  }

  return (
    <div className='relative w-full max-w-md' ref={searchRef}>
      <form onSubmit={handleSearch} className='relative'>
        <div className='relative flex items-center'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (e.target.value.trim().length > 0) {
                setShowDropdown(true)
              }
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowDropdown(true)
              }
            }}
            placeholder='Search products...'
            className='w-full px-4 py-2.5 pl-10 pr-10 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-gray-400'
          />
          <GrSearch className='absolute left-3 h-5 w-5 text-gray-400 pointer-events-none' />
          {isLoading && (
            <div className='absolute right-3'>
              <ImSpinner2 className='h-5 w-5 animate-spin text-primary' />
            </div>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto backdrop-blur-sm'
        >
          {isLoading ? (
            <div className='p-6 text-center'>
              <ImSpinner2 className='h-6 w-6 animate-spin mx-auto text-primary' />
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className='p-2'>
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug || product._id}`}
                    onClick={handleProductClick}
                    className='flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20'
                  >
                    <div className='relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden ring-1 ring-gray-200 group-hover:ring-primary/30 transition-all'>
                      <Image
                        src={product.image}
                        alt={product.title || product.name || 'Product'}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors'>
                        {product.title || product.name}
                      </h4>
                      {product.category?.title && (
                        <p className='text-xs text-gray-500 mt-0.5'>
                          {product.category.title}
                        </p>
                      )}
                      <p className='text-sm font-bold text-primary mt-1'>
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
                <div className='border-t border-gray-200 bg-gray-50/50 p-3'>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={handleProductClick}
                    className='block w-full text-center py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-all duration-200'
                  >
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              )}
            </>
          ) : searchQuery.trim().length > 0 ? (
            <div className='p-6 text-center'>
              <p className='text-sm text-gray-600 mb-3'>No products found</p>
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                onClick={handleProductClick}
                className='inline-block text-sm font-semibold text-primary hover:underline transition-colors'
              >
                Search for "{searchQuery}"
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Search
