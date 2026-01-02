import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
  reducerPath: 'orders',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    addOrder: builder.mutation({
      query: (body) => {
        const isFormData =
          typeof FormData !== 'undefined' && body instanceof FormData

        return {
          url: '/api/orders',
          method: 'POST',
          headers: isFormData
            ? undefined
            : {
                'Content-Type': 'application/json',
              },
          body: isFormData ? body : JSON.stringify(body),
        }
      },
    }),
  }),
})

export const { useAddOrderMutation } = orderApi
