import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUserData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUserData, clearUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;