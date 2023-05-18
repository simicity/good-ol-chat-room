import { UserData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: [] as UserData[],
  reducers: {
    addUser: (state, action: PayloadAction<UserData>) => {
      state.push(action.payload)
    },
    removeUser: (state, action: PayloadAction<UserData>) => {
      state.filter((user: UserData) => user.username !== action.payload.username);
    },
  },
});

export const { addUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;