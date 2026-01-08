// Client-safe version of orderAction functions
// This file doesn't import server-only functions like notFound()

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
    // Return error object instead of using toast (which requires client context)
    return {
      error: true,
      message: error?.message || 'Failed to track order',
    }
  }
}

export { trackMyOrder }
