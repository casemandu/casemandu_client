import { notFound } from 'next/navigation'

const getPhones = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/phones`,
      {
        method: 'GET',
        next: { revalidate: 3600 },
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
