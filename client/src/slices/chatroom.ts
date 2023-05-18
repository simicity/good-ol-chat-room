import { ChatRoomData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: ChatRoomData = {
  name: "test room",//undefined,
}

const chatRoomsSlice = createSlice({
  name: 'chatroom',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<ChatRoomData>) => {
      state = action.payload;
    },
    resetRoom: (state) => {
      state = initialState;
    },
  },
});

export const { setRoom, resetRoom } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;