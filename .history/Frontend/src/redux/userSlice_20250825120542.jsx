import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      console.log('Setting user data:', action.payload);
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    }
  }
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
