import { ChatRoomData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const chatRoomsSlice = createSlice({
  name: 'chatrooms',
  initialState: [] as ChatRoomData[],
  reducers: {
    addChatRoom: (state, action: PayloadAction<string>) => {
      state.push({name: action.payload, members: []});
    },
    removeChatRoom: (state, action: PayloadAction<string>) => {
      state.filter((room: ChatRoomData) => room.name !== action.payload);
    },
  },
});

export const { addChatRoom, removeChatRoom } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;