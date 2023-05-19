import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user'
import usersReducer from './users'
import messagesReducer from './messages'
import chatRoomReducer from './chatroom'
import chatRoomsReducer from './chatrooms'

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    messages: messagesReducer,
    chatroom: chatRoomReducer,
    chatrooms: chatRoomsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch