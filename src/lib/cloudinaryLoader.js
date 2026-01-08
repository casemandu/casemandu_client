/**
 * Cloudinary loader for Next.js Image component
 * This uses Cloudinary's transformation API to get optimized images directly
 * instead of letting Next.js fetch and process them, which is much faster.
 * 
 * For non-Cloudinary images, returns them as-is (they won't be optimized by Next.js
 * when using a custom loader, but this is necessary to use Cloudinary transformations).
 */
export default function cloudinaryLoader({ src, width, quality = 75 }) {
  // If it's not a Cloudinary URL, return as-is
  // Note: With a custom loader, Next.js won't optimize these images,
  // but this is necessary to use Cloudinary's fast transformations
  if (!src.includes('res.cloudinary.com')) {
    return src
  }

  try {
    // Parse the Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    // Or: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
    const url = new URL(src)
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    // Find the index of 'upload' to get the transformation part
    const uploadIndex = pathParts.indexOf('upload')
    
    if (uploadIndex === -1) {
      // If it's not a standard Cloudinary URL, return as-is
      return src
    }

    // Get everything before 'upload' (cloud_name and resource_type)
    const beforeUpload = pathParts.slice(0, uploadIndex)
    
    // Get everything after 'upload'
    const afterUpload = pathParts.slice(uploadIndex + 1)
    
    // Check if transformations already exist (first part after upload contains commas or transformation params)
    if (afterUpload.length > 0) {
      const firstPart = afterUpload[0]
      // If it already has transformations (contains comma-separated params like 'f_auto,w_500')
      if (firstPart.includes(',')) {
        // Replace existing transformations with our new ones
        const restOfPath = afterUpload.slice(1).join('/')
        const transformations = [
          'f_auto', // Auto format (webp, avif, etc.)
          `w_${width}`, // Width
          'c_limit', // Limit dimensions (maintain aspect ratio)
          `q_${quality}`, // Quality
        ]
        const transformedPath = `upload/${transformations.join(',')}/${restOfPath}`
        return `${url.protocol}//${url.hostname}/${beforeUpload.join('/')}/${transformedPath}`
      }
    }

    // No existing transformations, add our own
    // Format: upload/{transformations}/{version}/{public_id}.{format}
    const restOfPath = afterUpload.join('/')
    
    // Build transformation parameters
    const transformations = [
      'f_auto', // Auto format (webp, avif, etc.)
      `w_${width}`, // Width
      'c_limit', // Limit dimensions (maintain aspect ratio)
      `q_${quality}`, // Quality
    ]

    // Reconstruct the URL with transformations
    const transformedPath = `upload/${transformations.join(',')}/${restOfPath}`
    
    return `${url.protocol}//${url.hostname}/${beforeUpload.join('/')}/${transformedPath}`
  } catch (error) {
    // If URL parsing fails, return original src
    console.warn('Cloudinary loader error:', error)
    return src
  }
}
