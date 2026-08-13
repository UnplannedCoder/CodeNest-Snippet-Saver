import { configureStore } from '@reduxjs/toolkit'
import codeNestReducer from './redux/Slice'

export const store = configureStore({
  reducer: {
    codenest:codeNestReducer,
  },
})