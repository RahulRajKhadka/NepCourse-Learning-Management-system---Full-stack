// userSlice.jsx
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      // Add null check here
      if (action.payload && action.payload.user) {
        state.user = action.payload.user
        state.isAuthenticated = true
      } else {
        state.user = null
        state.isAuthenticated = false
      }
      state.loading = false
    },
    clearUserData: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setUserData, clearUserData, setLoading } = userSlice.actions
export default userSlice.reducer