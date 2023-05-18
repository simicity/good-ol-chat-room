import { createSlice } from '@reduxjs/toolkit';
import socket from '../utils/socket';

const socketConnectionSlice = createSlice({
  name: 'socketIsConnected',
  initialState: socket.connected,
  reducers: {
    setSocketConnect: (state) => {
      state = true;
    },
    setSocketDisconnect: (state) => {
      state = false;
    },
  },
});

export const { setSocketConnect, setSocketDisconnect } = socketConnectionSlice.actions;
export default socketConnectionSlice.reducer;