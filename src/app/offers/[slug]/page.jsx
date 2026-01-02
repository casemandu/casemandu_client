import OfferDetails from '@/components/pages/offers/OfferDetails'
import { getOfferBySlug } from '@/frontend/lib/offerAction'
import React from 'react'

export async function generateMetadata({ params }, parent) {
  const slug = params?.slug

  const offer = await getOfferBySlug(slug)

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${offer?.title} - ${offer?.category?.title}`,
    description: offer?.shortDescription,
    openGraph: {
      title: `${offer?.title} - ${offer?.category?.title}`,
      images: [offer?.image, ...previousImages],
    },
  }
}

const OfferDetailsPage = async ({ params }) => {
  const offer = await getOfferBySlug(params?.slug)
  return (
    <div className='font-[sans-serif] bg-white'>
      <OfferDetails offer={offer} />
    </div>
  )
}

export default OfferDetailsPage
