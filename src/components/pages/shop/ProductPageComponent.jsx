'use client'
import ProductBox from '@/components/common/products/ProductBox'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { fetchProducts, fetchOffers } from '@/frontend/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Grid3x3,
  LayoutGrid
} from 'lucide-react'

const ProductPageComponent = ({
  products: initialProducts,
  type,
  options = [],
  categories = [],
  resourceType = 'products',
  basePath = '/shop',
  itemType = 'products',
  enableCustomizeLink = true,
  enableSearch = false,
  alwaysShowPagination = false,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingPath = basePath || '/shop'
  const isOfferListing = resourceType === 'offers'
  const resultsAnchorRef = useRef(null)

  // Helpers to read URL params
  const getOptionFromUrl = () => {
    const optionParam = searchParams?.get('option')
    if (!optionParam) return []
    // Support comma-separated values for multiple options
    const optionRoutes = optionParam.split(',').map(r => r.trim()).filter(Boolean)
    const optionIds = optionRoutes
      .map(route => {
        const option = options.find(opt =>
          opt.route?.replace('/', '')?.toLowerCase() === route?.toLowerCase()
        )
        return option?._id
      })
      .filter(Boolean)
    return optionIds
  }

  const getSearchFromUrl = () => {
    if (!enableSearch) return ''
    return searchParams?.get('search') || ''
  }

  const getCategoryFromUrl = () => {
    const categoryParam = searchParams?.get('type')
    if (!categoryParam || categoryParam === 'all') return []
    // Product categories only allow single selection (take first one)
    const categorySlug = categoryParam.split(',')[0].trim()
    const category = categories.find(cat =>
      cat.slug?.toLowerCase() === categorySlug?.toLowerCase()
    )
    return category?._id ? [category._id] : []
  }

  const getPageFromUrl = () => {
    const pageParam = searchParams?.get('page')
    if (!pageParam) return 1
    const parsed = parseInt(pageParam, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  }

  // State
  const [products, setProducts] = useState(initialProducts?.products || [])
  const [totalPages, setTotalPages] = useState(initialProducts?.pages || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [gridCols, setGridCols] = useState(4)
  const [pageSize, setPageSize] = useState(() => initialProducts?.limit || 30)
  const [totalResults, setTotalResults] = useState(() => {
    if (typeof initialProducts?.total === 'number') return initialProducts.total
    return Array.isArray(initialProducts?.products) ? initialProducts.products.length : 0
  })
  
  // Filter states - initialized from URL (now arrays for multi-select)
  const [selectedOption, setSelectedOption] = useState(() => getOptionFromUrl())
  const [selectedCategory, setSelectedCategory] = useState(() => getCategoryFromUrl())
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl())
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => getSearchFromUrl())
  const [searchInput, setSearchInput] = useState(() => getSearchFromUrl())

  // Format options and categories
  const formattedOptions = useMemo(() => {
    return options.map(opt => ({
      id: opt._id,
      name: opt.name,
      route: opt.route?.replace('/', '') || ''
    }))
  }, [options])

  const formattedCategories = useMemo(() => {
    return categories.map(cat => ({
      id: cat._id,
      title: cat.title,
      slug: cat.slug
    }))
  }, [categories])

  // Get price range from products
  const productPriceRange = useMemo(() => {
    if (products.length === 0) return [0, 10000]
    const prices = products.map(p => p.price || 0).filter(p => p > 0)
    if (prices.length === 0) return [0, 10000]
    return [Math.min(...prices), Math.max(...prices)]
  }, [products])

  // Shallow array equality check to avoid unnecessary state updates
  const areArraysEqual = useCallback((a = [], b = []) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false
    const aSorted = [...a].sort()
    const bSorted = [...b].sort()
    return aSorted.every((val, idx) => val === bSorted[idx])
  }, [])

  // Update price range when products change
  useEffect(() => {
    if (productPriceRange[1] > 0) {
      setPriceRange(productPriceRange)
    }
  }, [productPriceRange])

  // Map sortBy to API sort parameter
  const getSortValue = (sort) => {
    const sortMap = {
      'featured': '',
      'newest': 'newest',
      'price-low': 'price-asc',
      'price-high': 'price-desc',
      'popular': 'popular',
    }
    return sortMap[sort] || ''
  }

  // Update URL when filters change
  const updateURL = useCallback((updates) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (updates.option !== undefined) {
      if (Array.isArray(updates.option) && updates.option.length > 0) {
        const optionRoutes = updates.option
          .map(id => {
            const option = formattedOptions.find(opt => opt.id === id)
            return option?.route
          })
          .filter(Boolean)
        if (optionRoutes.length > 0) {
          params.set('option', optionRoutes.join(','))
        } else {
          params.delete('option')
        }
      } else {
        params.delete('option')
      }
    }

    if (updates.category !== undefined) {
      if (Array.isArray(updates.category) && updates.category.length > 0) {
        // Product categories only allow single selection (take first one)
        const category = formattedCategories.find(cat => cat.id === updates.category[0])
        if (category) {
          params.set('type', category.slug)
        } else {
          params.delete('type')
        }
      } else {
        params.delete('type')
      }
    }

    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set('page', updates.page.toString())
      } else {
        params.delete('page')
      }
    }

    if (updates.search !== undefined && enableSearch) {
      if (updates.search) {
        params.set('search', updates.search)
      } else {
        params.delete('search')
      }
    }

    const newUrl = params.toString() ? `${listingPath}?${params.toString()}` : listingPath
    router.push(newUrl, { scroll: false })
  }, [router, searchParams, formattedOptions, formattedCategories, listingPath, enableSearch])

  const scrollToResultsTop = useCallback(() => {
    if (typeof window === 'undefined') return

    if (resultsAnchorRef.current) {
      const HEADER_OFFSET = 80
      const elementTop =
        resultsAnchorRef.current.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET
      window.scrollTo({ top: Math.max(elementTop, 0), behavior: 'smooth' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load products function (can be called manually for retry)
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        page: currentPage,
        limit: 30,
        // Product categories: single selection (take first one)
        categories: Array.isArray(selectedCategory) && selectedCategory.length > 0 
          ? selectedCategory[0] 
          : '',
        // Design categories: multiple selections allowed
        // Options should be comma-separated IDs: "id1,id2,id3"
        options: Array.isArray(selectedOption) && selectedOption.length > 0 
          ? selectedOption.join(',') 
          : '',
        sort: getSortValue(sortBy),
        search: enableSearch ? searchQuery : '',
      }

      const result = resourceType === 'offers'
        ? await fetchOffers(params)
        : await fetchProducts(params)
      
      if (result.success) {
        setProducts(Array.isArray(result.products) ? result.products : [])
        setTotalPages(result.pages || 1)
        if (typeof result.limit === 'number' && result.limit > 0) {
          setPageSize(result.limit)
        }
        if (typeof result.total === 'number') {
          setTotalResults(result.total)
        } else if (Array.isArray(result.products)) {
          setTotalResults(result.products.length)
        }
        // Clear error if we successfully loaded (even if empty)
        setError(null)
      } else {
        const errorMsg = result.error || 'Failed to load products'
        setError(errorMsg)
        // Keep previous products if available, don't clear them on error
      }
    } catch (err) {
      console.error('Error loading products:', err)
      const errorMsg = err.message || 'Failed to load products. Please try again.'
      setError(errorMsg)
      // Keep previous products if available, don't clear them on error
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, selectedOption, selectedCategory, sortBy, searchQuery, enableSearch, resourceType])

  // Refs for managing state
  const isInitialMount = useRef(true)
  const prevFilters = useRef({ selectedOption, selectedCategory, sortBy, currentPage, searchQuery })
  const prevUrlRef = useRef(searchParams?.toString() || '')
  
  // Load products when filters or page change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevFilters.current = { selectedOption, selectedCategory, sortBy, currentPage, searchQuery }
      return
    }
    
    // Check if filters changed (not page) - compare arrays properly
    const optionsChanged = Array.isArray(prevFilters.current.selectedOption) && Array.isArray(selectedOption)
      ? prevFilters.current.selectedOption.length !== selectedOption.length ||
        prevFilters.current.selectedOption.some(id => !selectedOption.includes(id)) ||
        selectedOption.some(id => !prevFilters.current.selectedOption.includes(id))
      : prevFilters.current.selectedOption !== selectedOption
    
    const categoriesChanged = Array.isArray(prevFilters.current.selectedCategory) && Array.isArray(selectedCategory)
      ? prevFilters.current.selectedCategory.length !== selectedCategory.length ||
        prevFilters.current.selectedCategory.some(id => !selectedCategory.includes(id)) ||
        selectedCategory.some(id => !prevFilters.current.selectedCategory.includes(id))
      : prevFilters.current.selectedCategory !== selectedCategory
    
    const filtersChanged = 
      optionsChanged ||
      categoriesChanged ||
      prevFilters.current.sortBy !== sortBy ||
      prevFilters.current.searchQuery !== searchQuery
    
    // If filters changed, reset to page 1
    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1)
      prevFilters.current = { selectedOption, selectedCategory, sortBy, searchQuery, currentPage: 1 }
      return
    }
    
    prevFilters.current = { selectedOption, selectedCategory, sortBy, searchQuery, currentPage }
    loadProducts()
  }, [selectedOption, selectedCategory, sortBy, searchQuery, currentPage, loadProducts])

  // Sync URL params with state (only when URL actually changes)
  useEffect(() => {
    const currentUrl = searchParams?.toString() || ''
    
    // Only sync if URL actually changed
    if (currentUrl === prevUrlRef.current) {
      return
    }
    
    prevUrlRef.current = currentUrl
    
    const optionParam = searchParams?.get('option')
    const categoryParam = searchParams?.get('type')
    const pageParam = searchParams?.get('page')

    // Update option from URL (support comma-separated)
    if (optionParam) {
      const optionRoutes = optionParam.split(',').map(r => r.trim()).filter(Boolean)
      const optionIds = optionRoutes
        .map(route => {
          const option = formattedOptions.find(opt => 
            opt.route?.toLowerCase() === route?.toLowerCase()
          )
          return option?.id
        })
        .filter(Boolean)
      if (!areArraysEqual(selectedOption, optionIds)) {
        setSelectedOption(optionIds)
      }
    } else {
      // Clear option if not in URL
      if (selectedOption.length > 0) {
        setSelectedOption([])
      }
    }

    // Update category from URL (single selection only - take first one)
    if (categoryParam && categoryParam !== 'all') {
      const categorySlug = categoryParam.split(',')[0].trim()
      const category = formattedCategories.find(cat => 
        cat.slug?.toLowerCase() === categorySlug?.toLowerCase()
      )
      if (category) {
        if (!areArraysEqual(selectedCategory, [category.id])) {
          setSelectedCategory([category.id])
        }
      } else {
        if (selectedCategory.length > 0) {
          setSelectedCategory([])
        }
      }
    } else {
      // Clear category if not in URL
      if (selectedCategory.length > 0) {
        setSelectedCategory([])
      }
    }

    // Update page from URL
    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (!isNaN(page) && page > 0) {
        if (currentPage !== page) {
          setCurrentPage(page)
        }
      } else {
        if (currentPage !== 1) {
          setCurrentPage(1)
        }
      }
    } else {
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }

    if (enableSearch) {
      const urlSearchValue = searchParams?.get('search') || ''
      if (searchQuery !== urlSearchValue) {
        setSearchQuery(urlSearchValue)
      }
      if (searchInput !== urlSearchValue) {
        setSearchInput(urlSearchValue)
      }
    }
  }, [
    searchParams,
    formattedOptions,
    formattedCategories,
    enableSearch,
    areArraysEqual,
    selectedOption,
    selectedCategory,
    currentPage,
    searchQuery,
    searchInput
  ])

  // Handle option change (toggle in array)
  const handleOptionChange = (optionId) => {
    setSelectedOption(prev => {
      const isSelected = prev.includes(optionId)
      const newOptions = isSelected 
        ? prev.filter(id => id !== optionId) // Remove if already selected
        : [...prev, optionId] // Add if not selected
      updateURL({ option: newOptions, page: 1 })
      return newOptions
    })
    setCurrentPage(1)
    setShowSidebar(false)
    scrollToResultsTop()
  }

  // Handle category change (single selection only - toggle)
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(prev => {
      const isSelected = prev.includes(categoryId)
      // Product categories only allow 1 selection - toggle (select or deselect)
      const newCategories = isSelected 
        ? [] // Deselect if already selected
        : [categoryId] // Select only this one (replace any previous selection)
      updateURL({ category: newCategories, page: 1 })
      return newCategories
    })
    setCurrentPage(1)
    setShowSidebar(false)
    scrollToResultsTop()
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    updateURL({ page })
    setShowSidebar(false)
    scrollToResultsTop()
  }

  const handleSearchSubmit = () => {
    if (!enableSearch) return
    const trimmed = searchInput.trim()
    setSearchQuery(trimmed)
    updateURL({ search: trimmed, page: 1 })
    setCurrentPage(1)
    setShowSidebar(false)
    scrollToResultsTop()
  }

  const handleSearchClear = () => {
    if (!enableSearch) return
    setSearchInput('')
    setSearchQuery('')
    updateURL({ search: '', page: 1 })
    setCurrentPage(1)
    setShowSidebar(false)
    scrollToResultsTop()
  }

  // Clear all filters
  const clearFilters = () => {
    // Clear error first
    setError(null)
    // Reset all filter states
    setSelectedOption([])
    setSelectedCategory([])
    setPriceRange(productPriceRange)
    setSortBy('featured')
    setShowDiscountOnly(false)
    setShowNewOnly(false)
    setShowInStockOnly(false)
    setCurrentPage(1)
    if (enableSearch) {
      setSearchQuery('')
      setSearchInput('')
    }
    scrollToResultsTop()
    // Update URL - this will trigger the useEffect to load products
    router.push(listingPath, { scroll: false })
  }

  // Client-side filtering for price, discount, new, in stock
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Price filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Discount filter
    if (showDiscountOnly) {
      filtered = filtered.filter(product => product.discount && product.discount > 0)
    }

    // New items filter
    if (showNewOnly) {
      filtered = filtered.filter(product => product.new || product.isNew)
    }

    // In stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock !== false)
    }

    return filtered
  }, [products, priceRange, showDiscountOnly, showNewOnly, showInStockOnly])

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      (Array.isArray(selectedOption) ? selectedOption.length : 0) +
      (Array.isArray(selectedCategory) && selectedCategory.length > 0 ? 1 : 0) + // Product categories: count as 1
      (priceRange[0] !== productPriceRange[0] || priceRange[1] !== productPriceRange[1] ? 1 : 0) +
      (showDiscountOnly ? 1 : 0) +
      (showNewOnly ? 1 : 0) +
      (showInStockOnly ? 1 : 0) +
      (enableSearch && searchQuery ? 1 : 0)
    )
  }, [selectedOption, selectedCategory, priceRange, productPriceRange, showDiscountOnly, showNewOnly, showInStockOnly, enableSearch, searchQuery])

  // Customize link
  const shouldShowCustomizeSection = enableCustomizeLink && !isOfferListing

  const customizeLink = useMemo(() => {
    if (!shouldShowCustomizeSection) return ''
    if (type === 'all') return '/'
    if (type === 'cases') return '/c/phonecases'
    if (type === 'laptop-sleeves') return '/c/laptopsleeves'
    if (type === 'popsockets') return '/c/popsockets'
    if (type === 'airpods') return '/c/airpods'
    if (type === 'mousepads') return '/c/mousepads'
    return ''
  }, [type, shouldShowCustomizeSection])

  const itemLabel = useMemo(() => {
    if (!itemType) return 'Items'
    return itemType.charAt(0).toUpperCase() + itemType.slice(1)
  }, [itemType])

  const itemLabelLower = itemLabel.toLowerCase()

  const derivedTotalPages = useMemo(() => {
    if (totalPages && totalPages > 0) return totalPages
    if (pageSize > 0 && totalResults > 0) {
      return Math.ceil(totalResults / pageSize)
    }
    return 1
  }, [totalPages, pageSize, totalResults])

  useEffect(() => {
    const maxPage = Math.max(derivedTotalPages, 1)
    if (!isLoading && currentPage > maxPage) {
      setCurrentPage(maxPage)
      updateURL({ page: maxPage })
    }
  }, [currentPage, derivedTotalPages, isLoading, updateURL])

  // Prevent body scroll when mobile filter sidebar is open
  useEffect(() => {
    if (!showSidebar || typeof window === 'undefined') return

    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY || window.pageYOffset || html.scrollTop

    const originalBodyOverflow = body.style.overflow
    const originalBodyPosition = body.style.position
    const originalBodyTop = body.style.top
    const originalBodyWidth = body.style.width
    const originalHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = originalBodyOverflow
      body.style.position = originalBodyPosition
      body.style.top = originalBodyTop
      body.style.width = originalBodyWidth
      html.style.overflow = originalHtmlOverflow

      window.scrollTo({
        top: scrollY,
        behavior: 'auto',
      })
    }
  }, [showSidebar])

  return (
    <div className='max-w-[1920px] mx-auto'>
      {/* Error Banner */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2 flex-1'>
              <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={loadProducts}
                disabled={isLoading}
                className='px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
              <button
                onClick={() => setError(null)}
                className='text-red-500 hover:text-red-700 p-1'
                aria-label='Dismiss error'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Section */}
      {/* {customizeLink && ( */}
        <div className='mb-12'>
          <a
            href={`https://customize.casemandu.com.np${customizeLink}`}
            target='_blank'
            rel='noopener noreferrer'
            className='block group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-primary transition-all duration-300'
          >
            <div className='p-6 md:p-8'>
              <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                <div className='space-y-2'>
                  <h2 className='text-2xl md:text-3xl font-medium text-gray-900'>
                    Create Your Own Design
                  </h2>
                  <p className='text-gray-600 text-sm md:text-base'>
                    Customize products with your own images and designs
                  </p>
                </div>
                <div className='text-sm md:text-base text-primary font-medium group-hover:underline'>
                  Start Designing →
                </div>
              </div>
            </div>
          </a>
        </div>
      {/* )} */}

      <div className='flex gap-8' id='products-total'>
        {/* Sidebar Filters */}
        <aside className={`hidden lg:block w-56 flex-shrink-0`}>
          <div className='sticky top-4 space-y-6'>
            {/* Filter Header */}
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className='text-sm text-primary hover:underline'
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search (Desktop Sidebar Only) */}
          
             {formattedCategories.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-gray-900 mb-3'>Product Categories</h4>
                <div className='space-y-2'>
                  {formattedCategories.map((category) => (
                    <label
                      key={category.id}
                      className='flex items-center gap-2 cursor-pointer group'
                    >
                      <input
                        type='checkbox'
                        name='category'
                        checked={Array.isArray(selectedCategory) && selectedCategory.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className='w-4 h-4 border-gray-300 text-primary focus:ring-primary rounded'
                      />
                      <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                        {category.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {formattedOptions.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-gray-900 mb-3'>Designs Categories</h4>
                <div className='space-y-2'>
                  {formattedOptions.map((option) => (
                    <label
                      key={option.id}
                      className='flex items-center gap-2 cursor-pointer group'
                    >
                      <input
                        type='checkbox'
                        name='option'
                        checked={Array.isArray(selectedOption) && selectedOption.includes(option.id)}
                        onChange={() => handleOptionChange(option.id)}
                        className='w-4 h-4 border-gray-300 text-primary focus:ring-primary rounded'
                      />
                      <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-1 min-w-0'>
          <div
            ref={resultsAnchorRef}
            id='products-total-anchor'
            className='-mt-20 pt-20'
            aria-hidden='true'
          />
          {/* Top Bar */}
          <div className='mb-6 flex flex-row gap-4 items-start sm:items-center justify-between'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className='lg:hidden px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50'
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            <div className='flex items-center gap-3'>
              {/* Grid View Toggle */}
              <div className='hidden md:flex items-center gap-1 border border-gray-300 rounded-md p-1'>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded transition-all ${
                    gridCols === 3
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <LayoutGrid className='w-4 h-4' />                  
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded transition-all ${
                    gridCols === 4
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3x3 className='w-4 h-4' />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className='relative group'>
                <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50'>
                  <ArrowUpDown className='w-4 h-4' />
                  Sort
                </button>
                <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'newest', label: 'Newest First' },
                    { value: 'popular', label: 'Most Popular' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm ${
                        sortBy === option.value
                          ? 'bg-gray-50 text-primary font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {(typeof totalResults === 'number' && totalResults >= 0) && (
            <p className='text-sm text-gray-500 mb-4' id='products-total'>
              {totalResults === 0
                ? `No ${itemLabelLower} to display`
                : `Showing ${
                    Math.min((currentPage - 1) * pageSize + 1, Math.max(totalResults, 1))
                  }-${
                    Math.min(currentPage * pageSize, totalResults || currentPage * pageSize)
                  } of ${totalResults} ${itemLabelLower}`}
            </p>
          )}

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <div className='mb-6 flex flex-wrap gap-2'>
              {Array.isArray(selectedOption) && selectedOption.map(optionId => {
                const option = formattedOptions.find(o => o.id === optionId)
                return (
                  <button
                    key={optionId}
                    onClick={() => handleOptionChange(optionId)}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                  >
                    {option?.name || 'Option'}
                    <X className='w-3.5 h-3.5' />
                  </button>
                )
              })}
              {Array.isArray(selectedCategory) && selectedCategory.map(categoryId => {
                const category = formattedCategories.find(c => c.id === categoryId)
                return (
                  <button
                    key={categoryId}
                    onClick={() => handleCategoryChange(categoryId)}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                  >
                    {category?.title || 'Category'}
                    <X className='w-3.5 h-3.5' />
                  </button>
                )
              })}
              {(priceRange[0] !== productPriceRange[0] ||
                priceRange[1] !== productPriceRange[1]) && (
                <button
                  onClick={() => setPriceRange(productPriceRange)}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                >
                  Rs {priceRange[0]} - Rs {priceRange[1]}
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
              {showDiscountOnly && (
                <button
                  onClick={() => setShowDiscountOnly(false)}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                >
                  On Sale
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
              {showNewOnly && (
                <button
                  onClick={() => setShowNewOnly(false)}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                >
                  New Arrivals
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
              {showInStockOnly && (
                <button
                  onClick={() => setShowInStockOnly(false)}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                >
                  In Stock
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
              {enableSearch && searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors'
                >
                  Search: {searchQuery}
                  <X className='w-3.5 h-3.5' />
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className='text-center py-20'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              <p className='mt-4 text-gray-600'>Loading {itemLabelLower}...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='text-center py-20'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No {itemLabelLower} found
              </h3>
              <p className='text-gray-600 mb-6'>
                {products.length === 0 
                  ? `No ${itemLabelLower} available in this category. Try selecting a different category.`
                  : 'Try adjusting your filters to see more results'}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className='px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors'
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  gridCols === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductBox key={product?._id} product={product} type={itemType} />
                ))}
              </div>

              {/* Pagination */}
              {(alwaysShowPagination || derivedTotalPages > 1) && (
                <div className='mt-12 flex items-center justify-center gap-2'>
                  {(() => {
                    const safeTotalPages = Math.max(derivedTotalPages, 1)
                    const goToPage = (page) => handlePageChange(Math.max(1, Math.min(safeTotalPages, page)))
                    const pageButtons = Array.from({ length: Math.min(5, safeTotalPages) }, (_, i) => {
                      let pageNum
                      if (safeTotalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= safeTotalPages - 2) {
                        pageNum = safeTotalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      pageNum = Math.max(1, Math.min(safeTotalPages, pageNum))
                      return (
                        <button
                          key={`page-${pageNum}-${safeTotalPages}`}
                          onClick={() => goToPage(pageNum)}
                          disabled={isLoading}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })
                    return (
                      <>
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1 || isLoading}
                          className='p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                          <ChevronLeft className='w-5 h-5' />
                        </button>
                        <div className='flex items-center gap-1'>
                          {pageButtons}
                        </div>
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === safeTotalPages || isLoading}
                          className='p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                          <ChevronRight className='w-5 h-5' />
                        </button>
                      </>
                    )
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <div
              className='fixed inset-0 bg-black/50 z-40 lg:hidden'
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className='fixed left-0 top-0 bottom-0 w-[420px] bg-white z-50 lg:hidden shadow-2xl flex flex-col h-screen'
            >
              <div className='flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0'>
                <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className='p-2 hover:bg-gray-100 rounded-md'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              
              <div className='flex-1 overflow-y-auto p-6 space-y-6 touch-pan-y overscroll-contain'>
                {enableSearch && (
                  <div>
                    <h4 className='text-sm font-semibold text-gray-900 mb-3'>Search</h4>
                    <div className='space-y-3'>
                      <input
                        type='text'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchSubmit()
                          }
                        }}
                        placeholder={`Search ${itemType}`}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={handleSearchSubmit}
                          className='flex-1 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors'
                        >
                          Apply
                        </button>
                        {searchQuery && (
                          <button
                            onClick={handleSearchClear}
                            className='px-4 py-2 border border-gray-200 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formattedCategories.length > 0 && (
                  <div>
                    <h4 className='text-sm font-semibold text-gray-900 mb-3'>Product Categories</h4>
                    <div className='space-y-2'>
                      {formattedCategories.map((category) => (
                        <label
                          key={category.id}
                          className='flex items-center gap-2 cursor-pointer group'
                        >
                          <input
                            type='checkbox'
                            name='category-mobile'
                            checked={Array.isArray(selectedCategory) && selectedCategory.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className='w-4 h-4 border-gray-300 text-primary focus:ring-primary rounded'
                          />
                          <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                            {category.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {formattedOptions.length > 0 && (
                  <div>
                    <h4 className='text-sm font-semibold text-gray-900 mb-3'>Designs Categories</h4>
                    <div className='space-y-2'>
                      {formattedOptions.map((option) => (
                        <label
                          key={option.id}
                          className='flex items-center gap-2 cursor-pointer group'
                        >
                          <input
                            type='checkbox'
                            name='option-mobile'
                            checked={Array.isArray(selectedOption) && selectedOption.includes(option.id)}
                            onChange={() => handleOptionChange(option.id)}
                            className='w-4 h-4 border-gray-300 text-primary focus:ring-primary rounded'
                          />
                          <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                            {option.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className='w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors'
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductPageComponent
