import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import cartSlice from './features/cart/cartSlice'
import storage from 'redux-persist/lib/storage'
import { setupListeners } from '@reduxjs/toolkit/query'
import { orderApi } from './features/order/orderSlice'

const persistConfig = {
  key: 'casemandu',
  storage,
  whitelist: ['cart'],
}

const rootReducer = combineReducers({
  cart: cartSlice,
  [orderApi.reducerPath]: orderApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(orderApi.middleware),
})

// Only setup listeners if not in SSR (Next.js)
// This prevents automatic refetching on focus/reconnect which can cause 503 errors
// when the service is sleeping on Render free tier
if (typeof window !== 'undefined') {
  setupListeners(store.dispatch)
}

export const persistor = persistStore(store)
