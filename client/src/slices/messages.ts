import { messageData } from './../interfaces';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [] as messageData[],
  reducers: {
    addMessage: (state, action: PayloadAction<messageData>) => {
      state.push(action.payload);
    },
    clearMessage: () => {
      return [];
    }
  },
});

export const { addMessage, clearMessage } = messagesSlice.actions;
export default messagesSlice.reducer;