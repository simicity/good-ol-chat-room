import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatRooms = createAsyncThunk('chatrooms/fetchChatRooms', async () => {
  const response = await axios.get('http://localhost:3001/rooms');
  return response.data;
});

interface chatRoomsData {
  chatrooms: string[],
  isLoading: boolean,
  error: string | null,
}

const chatRoomsSlice = createSlice({
  name: 'chatrooms',
  initialState: { chatrooms: [], isLoading: false, error: null } as chatRoomsData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChatRooms.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChatRooms.fulfilled, (state, action) => {
      const data = action.payload;
      if(data) {
        state.chatrooms = data.map(({chatroom}: {chatroom: string}) => chatroom);
      }
      state.isLoading = false;
    });
    builder.addCase(fetchChatRooms.rejected, (state, action) => {
      state.isLoading = false;
      const errorMessage = action.error.message;
      state.error = (errorMessage === undefined ? null : errorMessage);
    });
  },
});

export default chatRoomsSlice.reducer;