import { UserData, MessageData } from './../typeInterfaces';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ChatMessageArea from './ChatMessageArea';
import ChatMessageForm from './ChatMessageForm';

function ChatRoomBody() {
  const [users, setUsers] = useState<UserData[]>([]);
  const addUser = (user: UserData) => setUsers([user, ...users]);
  const removeUser = (user: UserData) => setUsers(users.filter((u: UserData) => u.username !== user.username));
  const [messages, setMessages] = useState<MessageData[]>([
    {sender: "user1", message: "test message"}, 
    {sender: "user2", message: "test message"},
    {sender: "user3", message: "test message"},
  ]);
  const addMessage = (message: MessageData) => setMessages([message, ...messages]);

  return (
    <>
      <Box sx={{ height: "100%", overflow: "scroll" }}>
        <ChatMessageArea messages={messages} />
      </Box>
      <Box>
        <ChatMessageForm />
      </Box>
    </>
  );
}

export default ChatRoomBody;