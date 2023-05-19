import { ChatRoomData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const chatRoomsSlice = createSlice({
  name: 'chatrooms',
  initialState: [
    {name: "chat room 1", members: []}, 
    {name: "chat room 2", members: []},
    {name: "chat room 3", members: []},
  ] as ChatRoomData[],
  reducers: {
    addChatRoom: (state, action: PayloadAction<ChatRoomData>) => {
      state.push(action.payload)
    },
    removeChatRoom: (state, action: PayloadAction<ChatRoomData>) => {
      state.filter((room: ChatRoomData) => room.name !== action.payload.name);
    },
  },
});

export const { addChatRoom, removeChatRoom } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;