'use client'
import { addToCart, setCartOpen } from '@/store/features/cart/cartSlice'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { BsPhone } from 'react-icons/bs'
import { Search, ShoppingBag, Zap, Check, ChevronDown, Truck, Shield, RotateCcw } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { fetchVideoUrls } from '@/frontend/lib/api'

const ProductDetails = ({ product, phones }) => {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  // Search inputs and debounced values for brand/model dropdowns
  const [brandSearchInput, setBrandSearchInput] = useState('')
  const [brandSearch, setBrandSearch] = useState('')
  const [modelSearchInput, setModelSearchInput] = useState('')
  const [modelSearch, setModelSearch] = useState('')

  const [allVariants, setAllVariants] = useState([])
  const [extraValue, setExtraValue] = useState('')
  const [productPrice, setProductPrice] = useState(product?.price || '')
  const [variantPrice, setVariantPrice] = useState(null)

  const dispatch = useDispatch()
  const router = useRouter()

  const [productOptions, setProductOptions] = useState({
    quantity: 1,
    variant: '',
    description: '',
  })

  const [videos, setVideos] = useState([])
  const [activeTab, setActiveTab] = useState('images') // 'images' or 'videos'
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [playerError, setPlayerError] = useState(null)

  useEffect(() => {
    const loadVideos = async () => {
      const videoData = await fetchVideoUrls()
      setVideos(videoData)
    }
    loadVideos()
  }, [])

  // Reset player ready state when video changes
  useEffect(() => {
    setIsPlayerReady(false)
    setPlayerError(null)
  }, [selectedVideoIndex, activeTab])

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null

    // Handle YouTube Shorts format: youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^#&?\/]+)/)
    if (shortsMatch) return shortsMatch[1]

    // Handle standard YouTube formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Helper function to normalize YouTube URL
  const normalizeYouTubeUrl = (url) => {
    if (!url) return null

    // Extract video ID first (this handles all YouTube URL formats including Shorts)
    const videoId = getYouTubeVideoId(url)

    if (videoId) {
      // Convert all YouTube URLs (including Shorts) to standard watch format
      // ReactPlayer handles watch URLs better than Shorts URLs
      return `https://www.youtube.com/watch?v=${videoId}`
    }

    // If it's already a full URL but we couldn't extract ID, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // Try to construct URL from partial URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const fullUrl = url.startsWith('//') ? `https:${url}` : `https://${url.replace(/^https?:\/\//, '')}`
      // Try extracting video ID again from the constructed URL
      const id = getYouTubeVideoId(fullUrl)
      if (id) {
        return `https://www.youtube.com/watch?v=${id}`
      }
      return fullUrl
    }

    return url
  }

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) return null
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Helper function to validate and get cart item data
  const getCartItemData = () => {
    if (product?.category?.isCase) {
      if (!selectedBrand || !selectedModel) {
        toast.error('Please select the phone brand and model')
        return null
      }

      if (!productOptions?.variant?.name) {
        toast.error('Please select a variant')
        return null
      }
    }

    if (product?.category?.extraField && !extraValue) {
      toast.error(`Please enter the ${product?.category?.extraField}`)
      return null
    }

    let v = ''
    if (product?.category?.isCase) {
      v = productOptions?.variant?.name
      if (product?.category?.extraField) {
        v = `${v} - ${extraValue}`
      } else if (selectedBrand && selectedModel) {
        v = `${v} - ${selectedBrand}, ${selectedModel}`
      }
    } else if (product?.category?.extraField) {
      v = extraValue
    }

    return {
      product: {
        _id: product?._id,
        name: product?.title,
        image: product?.image,
      },
      quantity: productOptions?.quantity,
      price: variantPrice !== null ? productPrice : product?.price,
      variant: v,
    }
  }

  const handleAddToCart = () => {
    const cartItem = getCartItemData()
    if (!cartItem) return
    dispatch(addToCart(cartItem))
    dispatch(setCartOpen(true))
  }

  const handleBuyNow = () => {
    const cartItem = getCartItemData()
    if (!cartItem) return
    dispatch(addToCart(cartItem))
    router.push('/checkout')
  }

  useEffect(() => {
    if (product?.category?.isCase) {
      setAllVariants(
        phones
          ?.find((phone) => phone.name === selectedBrand)
          ?.models?.find((model) => model.name === selectedModel)?.caseTypes ||
          []
      )
    }
  }, [product, selectedBrand, selectedModel, phones])

  useEffect(() => {
    setVariantPrice(null)
    setProductPrice(product?.price || '')
  }, [product])

  // Debounce brand search
  useEffect(() => {
    const handler = setTimeout(() => {
      setBrandSearch(brandSearchInput)
    }, 300)
    return () => clearTimeout(handler)
  }, [brandSearchInput])

  // Debounce model search
  useEffect(() => {
    const handler = setTimeout(() => {
      setModelSearch(modelSearchInput)
    }, 300)
    return () => clearTimeout(handler)
  }, [modelSearchInput])

  return (
    <div className='mt-6 lg:mt-10'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
        {/* Left Column - Product Image/Video with Tabs */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          {/* Tabs */}
          <div className='flex gap-2 mb-4 border-b border-gray-200'>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'images'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Image
            </button>
            {videos.length > 0 && (
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'videos'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Video
              </button>
            )}
          </div>

          {/* Images Tab Content */}
          {activeTab === 'images' && (
          <div className='relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100'>
            <Image
              className='object-contain p-4'
              src={product?.image}
              alt={product?.name || 'Product Image'}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 50vw'
            />
            {/* Discount Badge */}
            {product?.discount > 0 && (
              <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg'>
                -{product.discount}% OFF
              </div>
            )}
          </div>
          )}

          {/* Videos Tab Content */}
          {activeTab === 'videos' && videos.length > 0 && (
            <div className='space-y-4'>
              {/* Main Video Player */}
              <div className='relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-100'>
                {(() => {
                  const currentVideo = videos[selectedVideoIndex]
                  const videoUrl = currentVideo?.youtube_url || currentVideo

                  if (!videoUrl) {
                    return (
                      <div className='flex items-center justify-center h-full text-white'>
                        Invalid video URL
                      </div>
                    )
                  }

                  // Ensure videoUrl is a string and normalize it
                  const videoUrlString = typeof videoUrl === 'string' ? videoUrl : String(videoUrl)
                  const normalizedUrl = normalizeYouTubeUrl(videoUrlString)

                  if (!normalizedUrl) {
                    return (
                      <div className='flex items-center justify-center h-full text-white'>
                        Invalid video URL format
                      </div>
                    )
                  }

                  // Extract video ID for embed URL
                  const videoId = getYouTubeVideoId(normalizedUrl)
                  const embedUrl = videoId
                    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=1&playsinline=1&iv_load_policy=3&cc_load_policy=0`
                    : null

                  if (!embedUrl) {
                    return (
                      <div className='flex items-center justify-center h-full text-white'>
                        Invalid video URL format
                      </div>
                    )
                  }

                  return (
                    <div className='relative w-full h-full'>
                      <iframe
                        key={`video-${selectedVideoIndex}-${videoId}`}
                        src={embedUrl}
                        className='absolute top-0 left-0 w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
                        allowFullScreen
                        title='YouTube video player'
                        style={{
                          border: 'none',
                        }}
                        onLoad={() => {
                          setIsPlayerReady(true)
                          setPlayerError(null)
                        }}
                        onError={() => {
                          setPlayerError('Failed to load video')
                          setIsPlayerReady(false)
                        }}
                      />
                      {!isPlayerReady && !playerError && (
                        <div className='absolute inset-0 flex items-center justify-center text-white z-10 bg-gray-900'>
                          <div className='text-center'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
                            <p>Loading video...</p>
                          </div>
                        </div>
                      )}
                      {playerError && (
                        <div className='absolute inset-0 flex items-center justify-center text-white z-10 bg-gray-900/80'>
                          <div className='text-center'>
                            <p className='text-red-400 mb-2'>Error loading video</p>
                            <p className='text-sm text-gray-400'>{playerError}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Video Thumbnails Grid */}
              {videos.length > 1 && (
                <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                  {videos.map((video, index) => {
                    const videoUrl = video?.youtube_url || video
                    const thumbnail = getYouTubeThumbnail(videoUrl)
                    const isSelected = index === selectedVideoIndex

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVideoIndex(index)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${isSelected
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={`Video ${index + 1}`}
                            fill
                            className='object-cover'
                            sizes='(max-width: 640px) 33vw, 25vw'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                            <span className='text-gray-400 text-xs'>No thumbnail</span>
                          </div>
                        )}
                        {isSelected && (
                          <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                            <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center'>
                              <svg
                                className='w-6 h-6 text-gray-900 ml-1'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path d='M8 5v14l11-7z' />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className='space-y-6'>
          {/* Category Badge */}
          {product?.category?.title && (
            <span className='inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full'>
              {product.category.title}
            </span>
          )}

          {/* Title */}
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight'>
            {product?.title}
          </h1>

          {/* Price Section */}
          <div className='flex items-baseline gap-3 flex-wrap'>
            {variantPrice !== null ? (
              product?.discount && product.discount > 0 ? (
                <>
                  <span className='text-3xl font-bold text-gray-900'>
                    Rs {Number(productPrice).toLocaleString('en')}
                  </span>
                  <span className='text-xl text-gray-400 line-through'>
                    Rs {Number(variantPrice).toLocaleString('en')}
                  </span>
                  <span className='px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-md'>
                    Save Rs {Number(variantPrice - productPrice).toLocaleString('en')}
                  </span>
                </>
              ) : (
                <span className='text-3xl font-bold text-gray-900'>
                  Rs {Number(variantPrice).toLocaleString('en')}
                </span>
              )
            ) : (
              <span className='text-3xl font-bold text-gray-900'>
                Rs. {productPrice}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product?.description && (
            <p className='text-gray-600 leading-relaxed'>
              {product.description.length > 200 
                ? product.description.substring(0, 200) + '...' 
                : product.description}
            </p>
          )}

          {/* Features */}
          {product?.features && product?.features?.length > 0 && (
            <div className='bg-gray-50 rounded-xl p-4'>
              <h3 className='text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                <Check className='h-4 w-4 text-green-500' />
                Key Features
              </h3>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {product.features.map((feature, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm text-gray-600'>
                    <Check className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brand & Model Selection */}
          {!product?.productType?.extraField && product?.category?.isCase && (
            <div className='space-y-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200'>
              <h3 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
                Select Your Device
              </h3>
              
              {/* Brand Select */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Brand <span className='text-red-500'>*</span>
                </label>
                <Select
                  onValueChange={(selectedOption) => {
                    setSelectedBrand(selectedOption)
                    setSelectedModel('')
                    setBrandSearchInput('')
                    setBrandSearch('')
                    setModelSearchInput('')
                    setModelSearch('')
                  }}
                >
                  <SelectTrigger className='w-full h-12 bg-white border-gray-200 rounded-xl hover:border-gray-300 transition-colors'>
                    <SelectValue placeholder='Choose your phone brand...' />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    {Array.isArray(phones) && phones.length > 7 && (
                      <div className='sticky top-0 z-10 p-3 bg-white border-b border-gray-100'>
                        <div className='relative'>
                          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                          <input
                            type='text'
                            value={brandSearchInput}
                            onChange={(e) => setBrandSearchInput(e.target.value)}
                            placeholder='Search brand...'
                            className='w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all'
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    )}
                    <SelectGroup className='p-1'>
                      {phones
                        ?.filter((brand) =>
                          !brandSearch
                            ? true
                            : brand?.name?.toLowerCase().includes(brandSearch.toLowerCase())
                        )
                        .map((brand) => (
                          <SelectItem key={brand._id} value={brand.name} className='py-3'>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Model Select */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Model <span className='text-red-500'>*</span>
                </label>
                <Select
                  onValueChange={(selectedOption) => {
                    setSelectedModel(selectedOption)
                  }}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger className={`w-full h-12 bg-white border-gray-200 rounded-xl transition-colors ${!selectedBrand ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}>
                    <SelectValue placeholder={selectedBrand ? 'Choose your phone model...' : 'Select a brand first'} />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    {(() => {
                      const selectedPhone = phones?.find((phone) => phone.name === selectedBrand)
                      const models = selectedPhone?.models || []
                      const shouldShowSearch = models.length > 7
                      const filteredModels = models.filter((model) =>
                        !modelSearch
                          ? true
                          : model?.name?.toLowerCase().includes(modelSearch.toLowerCase())
                      )

                      return (
                        <>
                          {shouldShowSearch && (
                            <div className='sticky top-0 z-10 p-3 bg-white border-b border-gray-100'>
                              <div className='relative'>
                                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                                <input
                                  type='text'
                                  value={modelSearchInput}
                                  onChange={(e) => setModelSearchInput(e.target.value)}
                                  placeholder='Search model...'
                                  className='w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all'
                                  onKeyDown={(e) => e.stopPropagation()}
                                  onKeyUp={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                  onPointerDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          )}
                          <SelectGroup className='p-1'>
                            {filteredModels.map((model) => (
                              <SelectItem key={model._id} value={model.name} className='py-3'>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      )
                    })()}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Device Summary */}
              {selectedBrand && selectedModel && (
                <div className='flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <Check className='h-4 w-4 text-green-600 flex-shrink-0' />
                  <span className='text-sm text-green-700'>
                    Selected: <span className='font-semibold'>{selectedBrand} {selectedModel}</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Variant Selection */}
          {allVariants?.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold text-gray-900'>
                Choose Variant <span className='text-red-500'>*</span>
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {allVariants?.map((variant) => {
                  const isSelected = productOptions?.variant?.name === variant?.name
                  const variantPriceValue = Number(variant?.price || product?.category?.price || 0)
                  
                  return (
                    <label
                      key={variant._id}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type='radio'
                        name='variant'
                        value={variant?.name}
                        onChange={() => {
                          setProductOptions({
                            ...productOptions,
                            variant: variant,
                          })
                          setVariantPrice(variantPriceValue)
                          if (product?.discount && product.discount > 0) {
                            const discountAmount = (variantPriceValue * product.discount) / 100
                            setProductPrice(variantPriceValue - discountAmount)
                          } else {
                            setProductPrice(variantPriceValue)
                          }
                        }}
                        checked={isSelected}
                        className='sr-only'
                      />
                      {isSelected && (
                        <div className='absolute top-2 right-2'>
                          <Check className='h-4 w-4 text-primary' />
                        </div>
                      )}
                      <p className='font-semibold text-gray-900 text-sm'>{variant?.name}</p>
                      <p className='text-sm text-gray-500 mt-1'>
                        Rs {variantPriceValue.toLocaleString('en')}
                      </p>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Extra Field Input */}
          {product?.category?.extraField && (
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-gray-900'>
                {product?.category?.extraField}
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <div className='relative'>
                <BsPhone className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  id='productModel'
                  value={extraValue}
                  onChange={(e) => {
                    setExtraValue(e.target.value)
                    setProductOptions({
                      ...productOptions,
                      variant: extraValue,
                    })
                  }}
                  name='productModel'
                  className='w-full h-12 rounded-xl border border-gray-200 px-4 pl-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                  placeholder={product?.category?.placeholder || 'Enter value...'}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase()
                  }}
                />
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className='space-y-4 pt-4 border-t border-gray-200'>
            {/* Quantity Selector */}
            <div className='flex items-center gap-4'>
              <span className='text-sm font-semibold text-gray-900'>Quantity</span>
              <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white'>
                <button
                  onClick={() =>
                    productOptions.quantity > 1 &&
                    setProductOptions({
                      ...productOptions,
                      quantity: productOptions.quantity - 1,
                    })
                  }
                  className='w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50'
                  disabled={productOptions.quantity <= 1}
                >
                  <BiMinus className='h-4 w-4' />
                </button>
                <span className='w-14 h-12 flex items-center justify-center font-semibold text-gray-900 border-x border-gray-200'>
                  {productOptions.quantity}
                </span>
                <button
                  onClick={() =>
                    setProductOptions({
                      ...productOptions,
                      quantity: productOptions.quantity + 1,
                    })
                  }
                  className='w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600'
                >
                  <BiPlus className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleAddToCart}
                className='flex-1 h-14 rounded-xl text-base font-semibold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all'
              >
                Add to Cart
              </Button>
              <Button
                type='button'
                onClick={handleBuyNow}
                className='flex-1 h-14 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all'
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
        
        </div>
      </div>

      {/* Description Section */}
      <div className='mt-16 lg:mt-24'>
        <div className='border-b border-gray-200'>
          <h2 className='inline-block text-lg font-semibold text-gray-900 border-b-2 border-gray-900 pb-4 -mb-[1px]'>
            Product Description
          </h2>
        </div>

        <div className='mt-8 prose prose-gray max-w-none'>
          {product?.category?.isCase && productOptions?.variant?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: productOptions?.variant?.description,
              }}
            />
          ) : product?.category?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: product?.category?.description,
              }}
            />
          ) : (
            <pre className='font-sans break-words whitespace-pre-wrap text-gray-600 leading-relaxed'>
              {product?.description}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
