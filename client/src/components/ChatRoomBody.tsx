import Box from '@mui/material/Box';
import ChatMessageArea from './ChatMessageArea';
import ChatMessageForm from './ChatMessageForm';
import { useAppSelector } from './../slices/hooks';

function ChatRoomBody() {
  const messages = useAppSelector(state => state.messages);

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