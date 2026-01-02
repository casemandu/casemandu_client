const getAllCategories = async (keyword) => {
  try {
    // Validate API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      return []
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    let response
    try {
      response = await fetch(apiUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      // Handle CORS errors gracefully
      if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
        console.warn('CORS error or network issue fetching categories. This may be due to API CORS configuration.', {
          url: apiUrl,
          error: fetchError.message
        })
        return []
      }
      
      if (fetchError.name === 'AbortError') {
        console.error('Categories request timed out after 10 seconds', { url: apiUrl })
      } else {
        console.error('Network error fetching categories:', fetchError, { url: apiUrl })
      }
      return []
    }
    
    if (!response.ok) {
      // Handle 503 Service Unavailable (common with Render free tier - service is sleeping)
      if (response.status === 503) {
        console.warn('API service is temporarily unavailable (503). Retrying...', { url: apiUrl })
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        try {
          const retryResponse = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            return Array.isArray(retryData?.data) ? retryData.data : []
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      console.error(`Categories request failed with status ${response.status}`, {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText
      })
      return []
    }
    
    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError)
      return []
    }
    
    return Array.isArray(data?.data) ? data.data : []
  } catch (error) {
    console.error("Error fetching categories", error)
    return []
  }
}

export { getAllCategories }
