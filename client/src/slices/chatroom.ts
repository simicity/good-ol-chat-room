import { ChatRoomData, UserData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: ChatRoomData = {
  name: undefined,
  members: [] as UserData[],
}

const chatRoomsSlice = createSlice({
  name: 'chatroom',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    resetRoom: (state) => {
      state = initialState;
    },
    updateMember: (state, action: PayloadAction<UserData[]>) => {
      state.members = action.payload;
    },
  },
});

export const { setRoom, resetRoom } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;