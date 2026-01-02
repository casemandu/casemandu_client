import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart(state, action) {
      let existingItem = {}
      if (!action.payload.product._id) {
        existingItem = state.cartItems.find(
          (item) =>
            item.variant === action.payload.variant &&
            item.product.image === action.payload.product.image
        )
      } else {
        existingItem = state.cartItems.find(
          (item) =>
            item.product._id === action.payload.product._id &&
            item.variant === action.payload.variant
        )
      }
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
        toast.dismiss()
        toast.success(
          `${action.payload.product.name} increased by ${action.payload.quantity} in cart`
        )
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: action.payload.quantity,
        })
        toast.success(`${action.payload.product.name} added to cart`)
      }
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter((item) => {
        if (!action.payload.product._id) {
          return (
            item.variant !== action.payload.variant ||
            item.product.image !== action.payload.product.image
          )
        } else {
          return (
            item.product._id !== action.payload.product._id ||
            item.variant !== action.payload.variant
          )
        }
      })

      toast.dismiss()
      toast.success(`${action.payload.product.name} removed from cart`)
    },
    subCartQuantity(state, action) {
      const existingItem = state.cartItems.find((item) => {
        if (!action.payload.product._id) {
          return (
            item.variant === action.payload.variant &&
            item.product.image === action.payload.product.image &&
            item.quantity > 1
          )
        } else {
          return (
            item.product._id === action.payload.product._id &&
            item.variant === action.payload.variant &&
            item.quantity > 1
          )
        }
      })

      if (existingItem) {
        existingItem.quantity -= action.payload.quantity
        toast.dismiss()
        toast.error(
          `${action.payload.product.name} decreased by ${action.payload.quantity} in cart`
        )
      }
    },
    addCartQuantity(state, action) {
      const existingItem = state.cartItems.find((item) => {
        if (!action.payload.product._id) {
          return (
            item.variant === action.payload.variant &&
            item.product.image === action.payload.product.image
          )
        } else {
          return (
            item.product._id === action.payload.product._id &&
            item.variant === action.payload.variant
          )
        }
      })
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
        toast.dismiss()
        toast.success(
          `${action.payload.product.name} increased by ${action.payload.quantity} in cart`
        )
      }
    },
    clearCart(state) {
      state.cartItems = []
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  subCartQuantity,
  addCartQuantity,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
