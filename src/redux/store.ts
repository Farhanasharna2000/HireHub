import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import userReducer from './features/user/userSlice'
import uiReducer from './features/uiState/uiSlice'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch