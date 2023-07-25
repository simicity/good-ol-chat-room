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
    connectUser: (state) => {
      state.isConnected = true;
    },
    setUserData: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    disconnectUser: (state) => {
      state.isConnected = false;
    },
  },
});

export const { connectUser, setUserData, disconnectUser } = userSlice.actions;
export default userSlice.reducer;