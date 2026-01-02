'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  selectedModel: z.string({
    required_error: 'Please select a model.',
  }),
})
import { addToCart } from '@/store/features/cart/cartSlice'
import { useDispatch } from 'react-redux'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { BsHandbag } from 'react-icons/bs'

const OfferDetails = ({ offer }) => {
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (values) => {
    dispatch(
      addToCart({
        product: {
          _id: offer?._id,
          image: offer?.image,
          name: offer?.title,
        },
        quantity: productOptions.quantity,
        price: offer?.price - (offer?.price * offer?.discount) / 100,
        variant: values.selectedModel,
      })
    )
  }

  const [productOptions, setProductOptions] = useState({
    quantity: 1,
    variant: '',
  })

  return (
    <>
      <div className='p-6 lg:max-w-7xl max-w-4xl mx-auto'>
        <div className='grid items-start grid-cols-1 lg:grid-cols-5 gap-12  p-6'>
          <div className='lg:col-span-3 w-full lg:sticky top-0 text-center'>
            <Image
              src={offer?.image}
              alt={offer?.title}
              width={800}
              height={800}
              className='object-cover'
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='lg:col-span-2'
            >
              <h2 className='text-2xl font-extrabold text-[#333]'>
                {offer?.title}
              </h2>
              <div className='flex flex-wrap gap-4 mt-6'>
                {offer?.discount ? (
                  <>
                    <p className='text-[#333] text-4xl font-bold'>
                      Rs{' '}
                      {Number(
                        offer?.price - (offer?.price * offer?.discount) / 100
                      ).toLocaleString('en')}
                    </p>
                    <p className='text-gray-400 text-xl'>
                      <strike>
                        Rs {Number(offer?.price).toLocaleString('en')}
                      </strike>{' '}
                    </p>
                  </>
                ) : (
                  <p className='text-[#333] text-4xl font-bold'>
                    Rs {Number(offer?.price).toLocaleString('en')}
                  </p>
                )}
              </div>
              <div className='flex space-x-2 mt-4'>
                <p className='text-[#333] text-base'>{offer?.description}</p>
              </div>
              <div className='flex space-x-2 mt-4'>
                <p className='text-[#333] text-base'>
                  - {offer?.category?.title}
                </p>
              </div>
              <div className='mt-10'>
                <FormField
                  control={form.control}
                  name='selectedModel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-lg font-bold text-gray-800'>
                        Select a Model
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a Model' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {offer?.models?.map((model, index) => (
                            <SelectItem key={model + '-' + index} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <Button variant='default' type='submit' className='mt-10'>
                Add To Cart
              </Button> */}
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
                    type='button'
                    variant='outline'
                  >
                    <BiMinus />
                  </Button>

                  <div className='border w-16 outline-none flex items-center justify-center'>
                    {productOptions.quantity}
                  </div>
                  <Button
                    onClick={() =>
                      setProductOptions({
                        ...productOptions,
                        quantity: productOptions.quantity + 1,
                      })
                    }
                    type='button'
                    variant='outline'
                  >
                    <BiPlus />
                  </Button>
                </div>
                <Button type='submit'>
                  <BsHandbag className='h-5 w-5 mr-3 shrink-0' />
                  Add to Cart
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className='mt-16 p-6'>
          <h3 className='text-lg font-bold text-[#333]'>Description</h3>
          <p className='mt-4 text-[#333] text-sm'>{offer?.description}</p>
        </div>
      </div>
    </>
  )
}

export default OfferDetails
