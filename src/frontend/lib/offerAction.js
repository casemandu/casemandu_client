import { notFound } from 'next/navigation'

const getAllOffers = async (keyword) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/offers`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )
    if (response.status !== 200) {
      notFound()
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching offers', error)
  }
}

const getOfferBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/offers/${slug}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )
    if (response.status !== 200) {
      notFound()
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching offer', error)
  }
}

export { getAllOffers, getOfferBySlug }
