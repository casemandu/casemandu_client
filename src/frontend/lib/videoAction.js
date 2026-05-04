const getVideoUrls = async () => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) return []

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []

    const data = await res.json()

    if (data?.success && Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data)) return data
    if (data?.data?.youtube_url) return [data.data]
    return []
  } catch {
    return []
  }
}

export { getVideoUrls }
