import { notFound } from 'next/navigation'

const getBanners = async (keyword) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/banners`,
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
    console.error('Error fetching banners', error)
  }
}

export { getBanners }
