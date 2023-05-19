import { messageData } from './../interfaces';
import ChatMessage from './ChatMessage';
import Box from '@mui/material/Box';
import { useAppSelector } from '../slices/hooks';


function ChatMessageArea() {
  const messages = useAppSelector(state => state.messages);

  return (
    <Box sx={{ m:1 }}>
      {messages && messages.length > 0 && (
        messages.map((message: messageData, index: number) => {
          return (
            <ChatMessage key={index} message={message} />
          );
        })
      )}
    </Box>
  )
}

export default ChatMessageArea;
