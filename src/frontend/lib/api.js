import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  console.error('NEXT_PUBLIC_API_URL is not defined')
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL || '',
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Retry helper for 503 errors with exponential backoff
// Render free tier can take 30-60 seconds to wake up, so we retry multiple times
const fetchWithRetry = async (url, config = {}, retries = 5, attempt = 1) => {
  try {
    // Add cache-busting headers to prevent stale 304 responses
    const requestConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
    
    const response = await api.get(url, requestConfig)
    
    // Handle 304 Not Modified - it's actually a successful response
    // 304 means the resource hasn't changed, so we can use the cached data
    if (response.status === 304) {
      // For 304, axios might not populate response.data, so we return a safe structure
      // The browser/axios should have the cached data, but if not, return empty
      return response.data || { success: true, data: { totalProducts: [] } }
    }
    
    return response.data
  } catch (error) {
    // Retry on 503 errors (Render free tier can take 30-60 seconds to wake up)
    if (error.response?.status === 503 && retries > 0) {
      // Exponential backoff with longer delays: 3s, 6s, 12s, 15s, 15s (max 15s per retry)
      // Total wait time can be up to ~51 seconds
      const delay = Math.min(3000 * Math.pow(2, attempt - 1), 15000)
      console.log(`503 Service Unavailable (attempt ${attempt}/${retries + attempt - 1}), retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(url, config, retries - 1, attempt + 1)
    }
    
    // Handle 304 as success (shouldn't happen in catch, but just in case)
    if (error.response?.status === 304) {
      return { success: true, data: { totalProducts: [] } }
    }
    
    throw error
  }
}

// Fetch products with filters
export const fetchProducts = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      search = '',
      categories = '',
      options = '',
      sort = '',
    } = params

    const queryParams = new URLSearchParams()
    queryParams.append('page', page)
    queryParams.append('limit', limit)
    queryParams.append('activation', 'active')
    
    // Only append non-empty values
    // Options should be comma-separated IDs: "id1,id2,id3" (e.g., "68cef0c8c8c57a9cbf682124,68cef0d6c8c57a9cbf682126")
    if (search && search.trim()) queryParams.append('search', search.trim())
    if (categories && categories.trim()) queryParams.append('categories', categories.trim())
    if (options && options.trim()) queryParams.append('options', options.trim())
    if (sort && sort.trim()) queryParams.append('sort', sort.trim())

    const url = `/api/products?${queryParams.toString()}`
    const data = await fetchWithRetry(url)

    // Handle response with success:true and message (like "No product found")
    if (data?.success === true) {
      // Structure: { data: { totalProducts, pagination } }
      if (data?.data?.totalProducts !== undefined) {
        return {
          products: Array.isArray(data.data.totalProducts) ? data.data.totalProducts : [],
          pages: data.data.pagination?.totalPages || 1,
          success: true,
          page: data.data.pagination?.currentPage || data.data.pagination?.page || page,
          limit: data.data.pagination?.limit || data.data.pagination?.perPage || limit,
          total:
            data.data.pagination?.totalProducts ??
            data.data.pagination?.totalItems ??
            data.data.pagination?.totalDocs ??
            data.data.pagination?.total ??
            data.data.totalCount ??
            Array.isArray(data.data.totalProducts) ? data.data.totalProducts.length : 0,
        }
      }

      // Structure: { data: [], pagination: {} }
      if (Array.isArray(data?.data) && data?.pagination) {
        return {
          products: data.data,
          pages: data.pagination?.totalPages || data.pagination?.pages || 1,
          success: true,
          page: data.pagination?.currentPage || data.pagination?.page || page,
          limit: data.pagination?.limit || data.pagination?.perPage || limit,
          total:
            data.pagination?.totalProducts ??
            data.pagination?.productsFound ??
            data.pagination?.totalItems ??
            data.pagination?.totalDocs ??
            data.pagination?.total ??
            data.total ??
            data.data.length,
        }
      }
      
      // Structure: { products: [] }
      if (Array.isArray(data?.products)) {
        return {
          products: data.products,
          pages: data.pages || 1,
          success: true,
          page: data.page || page,
          limit: data.limit || limit,
          total: data.total || data.count || data.products.length || 0,
        }
      }
      
      // If success:true but no products structure, return empty (valid empty result)
      return {
        products: [],
        pages: 1,
        success: true,
        page,
        limit,
        total: 0,
      }
    }

    // Handle legacy structure with products array
    if (Array.isArray(data?.products)) {
      return {
        products: data.products,
        pages: data.pages || 1,
        success: true,
        page: data.page || page,
        limit: data.limit || limit,
        total: data.total || data.count || data.products.length || 0,
      }
    }

    // If data exists but structure is unexpected, still return success with empty array
    if (data && typeof data === 'object') {
      console.warn('Unexpected API response structure:', data)
      return {
        products: [],
        pages: 1,
        success: true, // Still success, just no products
        page,
        limit,
        total: 0,
      }
    }
    
    return {
      products: [],
      pages: 1,
      success: false,
      page,
      limit,
      total: 0,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    
    // Provide more detailed error information
    if (error.response) {
      const status = error.response.status
      console.error('API Error Response:', {
        status: status,
        statusText: error.response.statusText,
        data: error.response.data
      })
      
      // Special handling for 503 - service might be waking up
      if (status === 503) {
        return {
          products: [],
          pages: 1,
          success: false,
          error: 'Service is temporarily unavailable. The server is waking up. Please try again in a moment.'
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request)
    }
    
    return {
      products: [],
      pages: 1,
      success: false,
      error: error.message || 'Failed to fetch products'
    }
  }
}

// Fetch offers with filters (mirrors products endpoint structure)
export const fetchOffers = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      search = '',
      categories = '',
      options = '',
      sort = '',
    } = params

    const queryParams = new URLSearchParams()
    queryParams.append('page', page)
    queryParams.append('limit', limit)

    if (search && search.trim()) queryParams.append('search', search.trim())
    if (categories && categories.trim()) queryParams.append('categories', categories.trim())
    if (options && options.trim()) queryParams.append('options', options.trim())
    if (sort && sort.trim()) queryParams.append('sort', sort.trim())

    const url = `/api/offers?${queryParams.toString()}`
    const data = await fetchWithRetry(url)

    const normalizeResponse = (payload) => {
      if (!payload) {
        return { products: [], pages: 1, success: false }
      }

      // Structure: { data: { totalOffers: [], pagination } }
      if (payload?.data?.totalOffers !== undefined) {
        return {
          products: Array.isArray(payload.data.totalOffers) ? payload.data.totalOffers : [],
          pages: payload.data.pagination?.totalPages || payload.totalPages || 1,
          success: true,
          page: payload.data.pagination?.currentPage || payload.data.pagination?.page || payload.page || 1,
          limit: payload.data.pagination?.limit || payload.data.pagination?.perPage || payload.limit || 30,
          total:
            payload.data.pagination?.totalItems ??
            payload.data.pagination?.totalDocs ??
            payload.data.pagination?.total ??
            payload.total ??
            Array.isArray(payload.data.totalOffers) ? payload.data.totalOffers.length : 0,
        }
      }

      // Structure: { success: true, page, totalPages, data: [] }
      if (Array.isArray(payload?.data)) {
        return {
          products: payload.data,
          pages: payload.totalPages || payload.pages || 1,
          success: true,
          page: payload.page || 1,
          limit: payload.limit || 30,
          total: payload.total ?? payload.count ?? payload.data.length ?? 0,
        }
      }

      // Structure: { offers: [] }
      if (Array.isArray(payload?.offers)) {
        return {
          products: payload.offers,
          pages: payload.pages || payload.totalPages || 1,
          success: true,
          page: payload.page || 1,
          limit: payload.limit || 30,
          total: payload.total ?? payload.count ?? payload.offers.length ?? 0,
        }
      }

      return {
        products: [],
        pages: 1,
        success: true,
        page: payload?.page || 1,
        limit: payload?.limit || 30,
        total: payload?.total ?? 0,
      }
    }

    if (data?.success === true) {
      const normalized = normalizeResponse(data)
      return normalized.success ? normalized : { ...normalized, success: true }
    }

    const fallback = normalizeResponse(data)
    if (fallback.success) {
      return fallback
    }

    if (data && typeof data === 'object') {
      console.warn('Unexpected offers API response structure:', data)
      return {
        products: Array.isArray(data?.data) ? data.data : [],
        pages: data?.totalPages || data?.pages || 1,
        success: true,
      }
    }

    return {
      products: [],
      pages: 1,
      success: false,
    }
  } catch (error) {
    console.error('Error fetching offers:', error)

    if (error.response) {
      const status = error.response.status
      if (status === 503) {
        return {
          products: [],
          pages: 1,
          success: false,
          error: 'Offers service is temporarily unavailable. Please try again shortly.',
        }
      }
    }

    return {
      products: [],
      pages: 1,
      success: false,
      error: error.message || 'Failed to fetch offers',
    }
  }
}

// Fetch categories
export const fetchCategories = async () => {
  try {
    const data = await fetchWithRetry('/api/categories')
    return Array.isArray(data?.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Fetch options
export const fetchOptions = async () => {
  try {
    const data = await fetchWithRetry('/api/options')
    return Array.isArray(data?.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching options:', error)
    return []
  }
}

export const fetchVideoUrls = async () => {
  try {
    const data = await fetchWithRetry('/api/youtube')
    // Handle different response structures
    if (data?.success && Array.isArray(data?.data)) {
      return data.data
    }
    if (Array.isArray(data?.data)) {
      return data.data
    }
    if (Array.isArray(data)) {
      return data
    }
    // If single video object
    if (data?.data?.youtube_url) {
      return [data.data]
    }
    return []
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}

