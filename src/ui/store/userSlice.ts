import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nickName: null,
  token: null,
  id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.nickName = action.payload.nickName,
        state.token = action.payload.token,
        state.id = action.payload.id;
    },
    removeUser(state) {
      state.nickName = null;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;