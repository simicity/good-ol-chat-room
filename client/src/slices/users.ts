import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UsersData } from './../interfaces';

const usersSlice = createSlice({
  name: 'users',
  initialState: [] as UsersData[],
  reducers: {
    updateUsers: (_, action: PayloadAction<string>) => {
      const map = new Map(JSON.parse(action.payload));
      const convertedArray: UsersData[] = [];
      Array.from(map).forEach(([key, value]) => {
        convertedArray.push({
          chatroom: key,
          users: value
        } as UsersData);
      });
      return convertedArray;
    }
  },
});

export const { updateUsers } = usersSlice.actions;
export default usersSlice.reducer;