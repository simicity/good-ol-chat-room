import { MessageData } from './../interfaces';
import ChatMessage from './ChatMessage';
import Box from '@mui/material/Box';

function ChatMessageArea({ messages }: { messages: MessageData[] }) {

  return (
    <Box sx={{ m:1 }}>
      {messages && messages.length > 0 && (
        messages.map((message: MessageData) => (
          <ChatMessage message={message} />
        ))
      )}
    </Box>
  )
}

export default ChatMessageArea;
