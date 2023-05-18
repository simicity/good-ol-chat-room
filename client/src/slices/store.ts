import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user'
import usersReducer from './users'
import messagesReducer from './messages'
import chatRoomReducer from './chatroom'
import chatRoomsReducer from './chatrooms'
import socketConnectionReducer from './socketIsConnected'

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    messages: messagesReducer,
    chatroom: chatRoomReducer,
    chatrooms: chatRoomsReducer,
    socketIsConnected: socketConnectionReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch