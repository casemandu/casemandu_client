import { getAllCategories } from '@/frontend/lib/categoriesAction'
import { getAllOffers } from '@/frontend/lib/offerAction'
import { getOnlyProducts } from '@/frontend/lib/productActions'

export default async function sitemap() {
  const products = await getOnlyProducts()

  const categories = await getAllCategories()
  const offers = await getAllOffers()

  const urls = [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/offers`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
    },
  ]

  for (const product of products) {
    if (!product.slug) continue

    urls.push({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'monthly',
    })
  }

  for (const category of categories) {
    if (!category.slug) continue

    urls.push({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?type=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'monthly',
    })
  }

  for (const offer of offers) {
    if (!offer.slug) continue

    urls.push({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/offers/${offer.slug}`,
      lastModified: offer.updatedAt,
      changeFrequency: 'monthly',
    })
  }

  return urls
}
