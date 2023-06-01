import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:3000/users');
  return response.data;
});

interface usersPerRoomData {
  chatroom: string,
  users: string[],
}

const usersSlice = createSlice({
  name: 'users',
  initialState: [] as usersPerRoomData[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const data = action.payload;
      return data.map((d: usersPerRoomData) => ({
        chatroom: d.chatroom,
        users: d.users,
      }));
    });
  },
});

export default usersSlice.reducer;