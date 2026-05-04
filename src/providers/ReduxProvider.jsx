import { persistor, store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {/* loading must show real UI: loading={null} omits children from SSR/HTML, so
          no-JS (crawlers, Brave block-scripts) sees a blank page and SEO suffers. */}
      <PersistGate persistor={persistor} loading={children}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
