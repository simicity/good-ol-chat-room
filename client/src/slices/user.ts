import { UserData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: UserData = {
  userID: undefined,
  username: undefined,
  isConnected: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isConnected = true;
    },
    disconnectUser: () => {
      return initialState;
    },
  },
});

export const { connectUser, disconnectUser } = userSlice.actions;
export default userSlice.reducer;