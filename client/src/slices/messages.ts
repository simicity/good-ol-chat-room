import { MessageData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [
    {sender: "user1", message: "test message"}, 
    {sender: "user2", message: "test message"},
    {sender: "user3", message: "test message"},
  ] as MessageData[],
  reducers: {
    addMessage: (state, action: PayloadAction<MessageData>) => {
      state.push(action.payload)
    },
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;