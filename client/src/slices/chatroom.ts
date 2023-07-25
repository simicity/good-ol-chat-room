import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const chatRoomsSlice = createSlice({
  name: 'chatroom',
  initialState: "",
  reducers: {
    setRoom: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
    resetRoom: () => {
      return "";
    },
  },
});

export const { setRoom, resetRoom } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;