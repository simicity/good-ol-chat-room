import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: [] as string[],
  reducers: {
    addUser: (state, action: PayloadAction<string>) => {
      state.push(action.payload)
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.filter(user => user !== action.payload);
    },
  },
});

export const { addUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;