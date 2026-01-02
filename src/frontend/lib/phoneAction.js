import { notFound } from 'next/navigation'

const getPhones = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/phones`,
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
    console.error('Error fetching phones', error)
  }
}

export { getPhones }
