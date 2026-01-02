import { notFound } from 'next/navigation'

const getHappyCustomers = async (keyword) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/happy-customers`,
      {
        method: 'GET',
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )
    if (response.status !== 200) {
      notFound()
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching happy customers', error)
    return []
  }
}

export { getHappyCustomers }
