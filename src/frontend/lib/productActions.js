import { notFound } from 'next/navigation'

const buildProductsQuery = (params = {}) => {
  const {
    page = 1,
    limit = 15,
    search = '',
    categories = '',
    options = '',
    status = '',
    sort = '',
    activation = 'active',
  } = params

  const queryParams = new URLSearchParams()
  queryParams.append('page', page)
  queryParams.append('limit', limit)
  queryParams.append('search', search)
  queryParams.append('categories', categories || '')
  // Options should be comma-separated IDs: "id1,id2,id3" (e.g., "68cef0c8c8c57a9cbf682124,68cef0d6c8c57a9cbf682126")
  queryParams.append('options', options || '')
  queryParams.append('status', status || '')
  queryParams.append('sort', sort || '')
  queryParams.append('activation', activation)

  return queryParams.toString()
}

const emptyProductsResponse = {
  products: [],
  pages: 0,
  pagination: null,
  success: true,
}

const errorProductsResponse = {
  products: [],
  pages: 0,
  pagination: null,
  success: false,
}

const getProducts = async (filters = {}) => {
  try {
    // Validate API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return errorProductsResponse
    }

    const {
      keyword = '',
      pageSize = 15,
      pageNumber = 1,
      categoryId = '',
      options = '',
      status = '',
      sort = '',
    } = filters

    const queryString = buildProductsQuery({
      page: pageNumber,
      limit: pageSize,
      search: keyword,
      categories: categoryId,
      options,
      status,
      sort,
      activation: 'active',
    })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryString}`
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    let response
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Products request timed out after 10 seconds', { url: apiUrl })
      } else {
        console.error('Network error fetching products:', fetchError, { url: apiUrl })
      }
      return errorProductsResponse
    }
    
    if (!response.ok) {
      // Handle 503 Service Unavailable (common with Render free tier - service is sleeping)
      if (response.status === 503) {
        console.warn('API service is temporarily unavailable (503). This often happens with Render free tier when the service is waking up. Retrying...', {
          url: apiUrl,
          status: response.status,
          statusText: response.statusText
        })
        // Retry once after a delay (Render services typically wake up in 30-60 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
        
        try {
          const retryResponse = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            if (retryData?.success && retryData?.data) {
              return {
                products: retryData.data.totalProducts || [],
                pages: retryData.data.pagination?.totalPages || 1,
                pagination: retryData.data.pagination,
                success: true,
              }
            }
            if (Array.isArray(retryData?.products)) {
              return {
                products: retryData.products,
                pages: retryData.pages || 1,
                pagination: retryData.pagination || null,
                success: true,
              }
            }
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      console.error(`Products request failed with status ${response.status}`, {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText
      })
      return errorProductsResponse
    }
    
    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError)
      return errorProductsResponse
    }
    
    if (data?.success && data?.data) {
      return {
        products: data.data.totalProducts || [],
        pages: data.data.pagination?.totalPages || 1,
        pagination: data.data.pagination,
        success: true,
      }
    }

    if (Array.isArray(data?.products)) {
      return {
        products: data.products,
        pages: data.pages || 1,
        pagination: data.pagination || null,
        success: true,
      }
    }

    return errorProductsResponse
  } catch (error) {
    console.error('Error fetching products', error)
    return errorProductsResponse
  }
}

const getProductsByCategory = async (categoryId, pageSize = 15, pageNumber = 1, additionalFilters = {}) => {
  try {
    // Validate API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return errorProductsResponse
    }

    const {
      search = '',
      options = '',
      status = '',
      sort = '',
    } = additionalFilters

    const queryString = buildProductsQuery({
      page: pageNumber,
      limit: pageSize,
      search,
      categories: categoryId || '',
      options,
      status,
      sort,
      activation: 'active',
    })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryString}`
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    let response
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Products by category request timed out after 10 seconds', { url: apiUrl })
      } else {
        console.error('Network error fetching products by category:', fetchError, { url: apiUrl })
      }
      return errorProductsResponse
    }
    
    if (!response.ok) {
      // Handle 503 Service Unavailable (common with Render free tier - service is sleeping)
      if (response.status === 503) {
        console.warn('API service is temporarily unavailable (503). Retrying...', { url: apiUrl })
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        try {
          const retryResponse = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            if (retryData?.success && retryData?.data) {
              return {
                products: retryData.data.totalProducts || [],
                pages: retryData.data.pagination?.totalPages || 1,
                pagination: retryData.data.pagination,
                success: true,
              }
            }
            if (Array.isArray(retryData?.products)) {
              return {
                products: retryData.products,
                pages: retryData.pages || 1,
                pagination: retryData.pagination || null,
                success: true,
              }
            }
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      console.error(`Products by category request failed with status ${response.status}`, {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText
      })
      return errorProductsResponse
    }
    
    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError)
      return errorProductsResponse
    }
    
    // Handle new API response structure
    if (data?.success && data?.data) {
      return {
        products: data.data.totalProducts || [],
        pages: data.data.pagination?.totalPages || 1,
        pagination: data.data.pagination,
        success: true,
      }
    }
    
    // Fallback for old structure
    if (Array.isArray(data?.products)) {
      return {
        products: data.products,
        pages: data.pages || 1,
        pagination: data.pagination || null,
        success: true,
      }
    }

    return errorProductsResponse
  } catch (error) {
    console.error('Error fetching products', error)
    return errorProductsResponse
  }
}

const getProductsByOption = async (optionId, pageSize = 15, pageNumber = 1, additionalFilters = {}) => {
  try {
    // Validate API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return errorProductsResponse
    }

    const {
      search = '',
      status = '',
      sort = '',
    } = additionalFilters

    const queryString = buildProductsQuery({
      page: pageNumber,
      limit: pageSize,
      search,
      categories: '',
      options: optionId || '',
      status,
      sort,
      activation: 'active',
    })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryString}`
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    let response
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Products by option request timed out after 10 seconds', { url: apiUrl })
      } else {
        console.error('Network error fetching products by option:', fetchError, { url: apiUrl })
      }
      return errorProductsResponse
    }
    
    if (!response.ok) {
      // Handle 503 Service Unavailable (common with Render free tier - service is sleeping)
      if (response.status === 503) {
        console.warn('API service is temporarily unavailable (503). Retrying...', { url: apiUrl })
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        try {
          const retryResponse = await fetch(apiUrl, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            if (retryData?.success && retryData?.data) {
              return {
                products: retryData.data.totalProducts || [],
                pages: retryData.data.pagination?.totalPages || 1,
                pagination: retryData.data.pagination,
                success: true,
              }
            }
            if (Array.isArray(retryData?.products)) {
              return {
                products: retryData.products,
                pages: retryData.pages || 1,
                pagination: retryData.pagination || null,
                success: true,
              }
            }
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      console.error(`Products by option request failed with status ${response.status}`, {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText
      })
      return errorProductsResponse
    }
    
    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError)
      return errorProductsResponse
    }
    
    // Handle new API response structure
    if (data?.success && data?.data) {
      return {
        products: data.data.totalProducts || [],
        pages: data.data.pagination?.totalPages || 1,
        pagination: data.data.pagination,
        success: true,
      }
    }
    
    // Fallback for old structure
    if (Array.isArray(data?.products)) {
      return {
        products: data.products,
        pages: data.pages || 1,
        pagination: data.pagination || null,
        success: true,
      }
    }

    return errorProductsResponse
  } catch (error) {
    console.error('Error fetching products by option', error)
    return errorProductsResponse
  }
}

const getProductBySlug = async (slug) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,
    { method: 'GET', cache: 'no-store' }
  )

  if (response.status !== 200) {
    notFound()
  }

  const data = await response.json()
  return data
}

const getOnlyProducts = async (filters = {}) => {
  try {
    const {
      keyword = '',
      pageSize = 15,
      pageNumber = 1,
      categoryId = '',
      options = '',
      status = '',
      sort = '',
    } = filters

    const queryString = buildProductsQuery({
      page: pageNumber,
      limit: pageSize,
      search: keyword,
      categories: categoryId,
      options,
      status,
      sort,
      activation: 'active',
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryString}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )
    if (!response.ok) {
      console.error(`Only products request failed with status ${response.status}`)
      return []
    }
    const data = await response.json()

    // Handle new API response structure
    if (data?.data?.totalProducts) {
      return data.data.totalProducts
    }
    if (data?.products) {
      return data.products
    }

    return []
  } catch (error) {
    console.error('Error fetching products', error)
  }
}

export { getProducts, getProductsByCategory, getProductsByOption, getProductBySlug, getOnlyProducts }
