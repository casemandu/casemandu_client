import { notFound } from 'next/navigation'
import toast from 'react-hot-toast'

const getOrderById = async (id) => {
  try {
    if (!id) {
      console.error('Order ID is missing')
      notFound()
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined')
      throw new Error('API URL is not configured')
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`
    console.log('Fetching order from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Order API response status:', response.status, response.statusText)

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = ''
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorData?.error || ''
        console.error('Order API error response:', errorData)
      } catch (e) {
        console.error('Could not parse error response')
      }
      
      if (response.status === 404) {
        console.error(`Order ${id} not found (404)`)
        notFound()
      }
      console.error(`Failed to fetch order ${id}: ${response.status} ${response.statusText}`, errorMessage)
      notFound()
    }

    const data = await response.json()
    console.log('Order API response data:', JSON.stringify(data, null, 2))

    // Check if the API returned an error message
    if (data?.success === false) {
      console.error('Order API returned success: false:', data?.message || data)
      notFound()
    }

    // Handle different response structures
    // If the API wraps the order in a data property, extract it
    if (data?.success && data?.data) {
      console.log('Order data extracted from data.data')
      return data.data
    }

    // If the API returns the order directly
    if (data?._id || data?.order_id) {
      console.log('Order data found directly in response')
      return data
    }

    // Check if there's an error message but no order data
    if (data?.message && !data?._id && !data?.order_id) {
      console.error('Order API returned error message:', data.message)
      notFound()
    }

    // If data exists but structure is unexpected, log and return it anyway
    if (data && typeof data === 'object') {
      console.warn('Unexpected order API response structure, returning as-is:', Object.keys(data))
      return data
    }

    // No data found in response
    console.error('Order data not found in response for order:', id, 'Response:', data)
    notFound()
  } catch (error) {
    console.error('Error fetching order:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    })
    // notFound() throws a special error that Next.js handles
    // Re-throw if it's already a notFound error, otherwise call notFound()
    if (error?.digest === 'NEXT_NOT_FOUND' || error?.message?.includes('NEXT_NOT_FOUND')) {
      throw error
    }
    notFound()
  }
}

const trackMyOrder = async (orderId, phoneNumber) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/track?id=${orderId}&ph=${phoneNumber}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )

    return response.json()
  } catch (error) {
    toast.dismiss()
    return toast.error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.response
    )
  }
}

export { getOrderById, trackMyOrder }
