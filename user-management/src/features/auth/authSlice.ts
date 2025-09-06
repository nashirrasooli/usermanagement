import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = { token: string | null };
const initialState: AuthState = {
  token: localStorage.getItem('token'),
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, logout } = slice.actions;
export default slice.reducer;
