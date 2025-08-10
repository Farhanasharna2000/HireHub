import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import userReducer from './features/user/userSlice'
import uiReducer from './features/uiState/uiSlice'
import { jobsApi } from './jobs/jobsApi'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    ui: uiReducer,
     [jobsApi.reducerPath]: jobsApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobsApi.middleware), 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch