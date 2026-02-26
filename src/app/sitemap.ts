import type { MetadataRoute } from 'next'

import { getAllCategories } from '@/frontend/lib/categoriesAction'
import { getAllOffers } from '@/frontend/lib/offerAction'
import { getOnlyProducts } from '@/frontend/lib/productActions'

type HasSlugAndUpdatedAt = {
  slug?: string | null
  updatedAt?: string | Date | null
}

// Ensure `/sitemap.xml` is generated at request-time (avoids build-time API failures
// causing the route to disappear / 404 in production).
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://casemandu.com.np'

  let products: HasSlugAndUpdatedAt[] = []
  let categories: HasSlugAndUpdatedAt[] = []
  let offers: HasSlugAndUpdatedAt[] = []

  try {
    products = (await getOnlyProducts()) as HasSlugAndUpdatedAt[]
  } catch {
    // best-effort; keep base URLs
  }
  try {
    categories = (await getAllCategories()) as HasSlugAndUpdatedAt[]
  } catch {
    // best-effort; keep base URLs
  }
  try {
    offers = (await getAllOffers()) as HasSlugAndUpdatedAt[]
  } catch {
    // best-effort; keep base URLs
  }

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
  ]

  for (const product of products) {
    if (!product?.slug) continue

    urls.push({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt ?? undefined,
      changeFrequency: 'monthly',
    })
  }

  for (const category of categories) {
    if (!category?.slug) continue

    urls.push({
      url: `${baseUrl}/shop?type=${category.slug}`,
      lastModified: category.updatedAt ?? undefined,
      changeFrequency: 'monthly',
    })
  }

  for (const offer of offers) {
    if (!offer?.slug) continue

    urls.push({
      url: `${baseUrl}/offers/${offer.slug}`,
      lastModified: offer.updatedAt ?? undefined,
      changeFrequency: 'monthly',
    })
  }

  return urls
}

