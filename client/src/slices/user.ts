import { UserData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: UserData = {
  username: undefined,
  isOnline: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isOnline = true;
    },
    disconnectUser: (state) => {
      state = initialState;
    },
  },
});

export const { connectUser, disconnectUser } = userSlice.actions;
export default userSlice.reducer;