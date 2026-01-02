'use client'
import { addToCart } from '@/store/features/cart/cartSlice'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { BsHandbag, BsPhone } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
// import Select from 'react-select'
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
const ProductDetails = ({ product, phones }) => {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const [allVariants, setAllVariants] = useState([])
  const [extraValue, setExtraValue] = useState('')
  // Initial price should be from product.price (string, could be range or single value)
  const [productPrice, setProductPrice] = useState(product?.price || '')
  const [variantPrice, setVariantPrice] = useState(null) // Store variant price separately

  const dispatch = useDispatch()


  useEffect(() => {
    if (product?.category?.isCase) {
      setAllVariants(
        phones
          ?.find((phone) => phone.name === selectedBrand)
          ?.models?.find((model) => model.name === selectedModel)?.caseTypes ||
          []
      )
    }
  }, [product, selectedBrand, selectedModel])

  // Reset variant price when product changes
  useEffect(() => {
    setVariantPrice(null)
    setProductPrice(product?.price || '')
  }, [product])

  const [productOptions, setProductOptions] = useState({
    quantity: 1,
    variant: '',
    description: '',
  })
  return (
    <div className='lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16'>
      <div className='lg:col-span-3 lg:row-end-1'>
        <div className='lg:flex lg:items-start'>
          <div className='lg:order-2 lg:ml-5'>
            <div className='max-w-xl overflow-hidden rounded-lg'>
              <Image
                className='object-cover'
                src={product?.image}
                alt={product?.name}
                height={500}
                width={500}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='lg:col-span-2 lg:row-span-2 lg:row-end-2'>
        <h1 className='sm: text-2xl font-bold text-gray-900 sm:text-3xl'>
          {product?.title}
        </h1>
        <div className='flex gap-4 mt-5 items-center border-t border-b py-4'>
          {variantPrice !== null ? (
            // Show variant price (with or without discount)
            product?.discount && product.discount > 0 ? (
              <div className='flex flex-col gap-1'>
                <p className='font-bold text-gray-400 text-lg line-through'>
                  Rs {Number(variantPrice).toLocaleString('en')}
                </p>
                <p className='font-bold text-gray-900 text-2xl'>
                  Rs {Number(productPrice).toLocaleString('en')}
                </p>
                <span className='text-sm text-primary font-medium'>
                  {Number(product?.discount || 0).toFixed(0)}% OFF
                </span>
              </div>
            ) : (
              <p className='font-bold text-gray-900 text-2xl'>
                Rs {Number(variantPrice).toLocaleString('en')}
              </p>
            )
          ) : (
            // Show initial product price (string, could be range or single value)
            <p className='font-bold text-gray-900 text-2xl'>
              Rs. {productPrice}
            </p>
          )}
        </div>

        {product?.features && Array.isArray(product.features) && product.features.length > 0 && (
          <div className='mt-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>Features</h2>
            <ul className='space-y-2'>
              {product.features.map((feature, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <svg
                    className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  <span className='text-sm text-gray-700'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <pre
          style={{ fontFamily: 'inherit' }}
          className='mt-5 text-sm break-words whitespace-pre-wrap'
        >
          {product?.description}
        </pre>

        {!product?.productType?.extraField && product?.category?.isCase && (
          <div className='mt-5'>
            <h2 className='mt-5 text-base text-gray-900'>
              Select Brand <span className='ms-1 text-red-500'>*</span>
            </h2>
            <Select
              onValueChange={(selectedOption) => {
                setSelectedBrand(selectedOption)
                setSelectedModel('')
              }}
            >
              <SelectTrigger className='mt-3'>
                <SelectValue placeholder='Select Brand...' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {phones?.map((brand) => (
                    <SelectItem key={brand._id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <h2 className='mt-5 text-base text-gray-900'>
              Select Model <span className='ms-1 text-red-500'>*</span>
            </h2>
            <Select
              onValueChange={(selectedOption) => {
                setSelectedModel(selectedOption)
              }}
            >
              <SelectTrigger className='mt-3'>
                <SelectValue placeholder='Select Brand...' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {phones
                    ?.find((phone) => phone.name === selectedBrand)
                    ?.models?.map((model) => (
                      <SelectItem key={model._id} value={model.name}>
                        {model.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {allVariants?.length !== 0 && (
          <>
            <h2 className='mt-8 text-base text-gray-900'>
              Choose Variant
              <span className='ms-1 text-red-500'>*</span>
            </h2>
            <div className='mt-3 flex select-none flex-wrap items-center gap-1'>
              {allVariants?.map((variant, index) => {
                return (
                  <label key={variant._id}>
                    <input
                      type='radio'
                      name='variant'
                      value={variant?.name}
                      onChange={() => {
                        setProductOptions({
                          ...productOptions,
                          variant: variant,
                        })
                        // Use ONLY variant price (not product.price + variant.price)
                        const variantPriceValue = Number(variant?.price || product?.category?.price || 0)
                        setVariantPrice(variantPriceValue)
                        
                        // Apply discount to variant price only
                        if (product?.discount && product.discount > 0) {
                          const discountAmount = (variantPriceValue * product.discount) / 100
                          setProductPrice(variantPriceValue - discountAmount)
                        } else {
                          setProductPrice(variantPriceValue)
                        }
                      }}
                      checked={productOptions?.variant?.name === variant?.name}
                      className='peer sr-only'
                    />
                    <p className='peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold'>
                      {variant?.name}
                    </p>
                    <span className='mt-1 block text-center text-xs'>
                      Rs {(() => {
                        // Show only variant price in the variant selector
                        const variantPriceValue = Number(variant?.price || product?.category?.price || 0)
                        return variantPriceValue.toLocaleString('en')
                      })()}
                    </span>
                  </label>
                )
              })}
            </div>
          </>
        )}

        {product?.category?.extraField && (
          <div className='mt-5'>
            <h2 className='text-base text-gray-900'>
              {product?.category?.extraField}
              <span className='ms-1 text-red-500'>*</span>
            </h2>
            <div className='relative mt-3'>
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
                className='w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-black focus:ring-black'
                placeholder={product?.category?.placeholder}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase()
                }}
              />
              <div className='pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3'>
                <BsPhone className='h-4 w-4 text-gray-400' />
              </div>
            </div>
          </div>
        )}

        <div className='mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0'>
          <div className='flex'>
            <Button
              onClick={() =>
                // check if the quantity is greater than 1 before decrementing
                productOptions.quantity > 1 &&
                setProductOptions({
                  ...productOptions,
                  quantity: productOptions.quantity - 1,
                })
              }
              variant='outline'
            >
              <BiMinus />
            </Button>

            <div className='border w-16 outline-none flex items-center justify-center'>
              {productOptions.quantity}
            </div>
            <Button
              variant='outline'
              onClick={() =>
                setProductOptions({
                  ...productOptions,
                  quantity: productOptions.quantity + 1,
                })
              }
            >
              <BiPlus />
            </Button>
          </div>
          {/* <Button className='w-full sm:w-auto'>Buy Now</Button> */}
          <Button
            type='button'
            onClick={() => {
              if (product?.category?.isCase) {
                if (!selectedBrand || !selectedModel) {
                  toast.dismiss()
                  return toast.error('Please select the phone brand and model')
                }

                if (!productOptions?.variant?.name) {
                  toast.dismiss()
                  return toast.error('Please select a variant')
                }
              }

              if (product?.category?.extraField && !extraValue) {
                toast.dismiss()
                return toast.error(
                  `Please enter the ${product?.category?.extraField}`
                )
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

              dispatch(
                addToCart({
                  product: {
                    _id: product?._id,
                    name: product?.title,
                    image: product?.image,
                  },
                  quantity: productOptions?.quantity,
                  price: variantPrice !== null ? productPrice : product?.price,
                  variant: v,
                })
              )
            }}
          >
            <BsHandbag className='h-5 w-5 mr-3 shrink-0' />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className='lg:col-span-3'>
        <div className='border-b border-gray-300'>
          <nav className='flex gap-4'>
            <button className='border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800'>
              Description
            </button>
          </nav>
        </div>

        <div className='mt-8 flow-root sm:mt-12' id='product_description'>
          <h1>{product?.title}</h1>
          <div>
            <span>Product</span> {product?.category?.title || 'Uncategorized'}
          </div>

          {product?.category?.isCase ? (
            <div
              // set the description of the selected case type
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
            <pre
              style={{ fontFamily: 'inherit' }}
              className='break-words whitespace-pre-wrap'
            >
              {product?.description}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
