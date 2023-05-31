import { configureStore } from '@reduxjs/toolkit'

import userReducer from './user'
import usersReducer, { fetchUsers } from './users'
import messagesReducer from './messages'
import chatRoomReducer from './chatroom'
import chatRoomsReducer, { fetchChatRooms } from './chatrooms'

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    messages: messagesReducer,
    chatroom: chatRoomReducer,
    chatrooms: chatRoomsReducer,
  }
})

store.dispatch(fetchChatRooms());
store.dispatch(fetchUsers());

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch