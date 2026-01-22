import { toast } from 'sonner'

const uploadImageToIMGBB = async (image) => {
  try {
    const formData = new FormData()

    formData.append('image', image)
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()

    return data
  } catch (error) {
    toast.error(
      error.response && error.response.data.error.message
        ? error.response.data.error.message
        : 'Failed to upload image'
    )
    throw error
  }
}

export default uploadImageToIMGBB
