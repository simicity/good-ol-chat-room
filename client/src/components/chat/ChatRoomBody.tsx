import Box from '@mui/material/Box';
import ChatMessageArea from './ChatMessageArea';
import ChatMessageForm from './ChatMessageForm';

function ChatRoomBody() {

  return (
    <>
      <Box sx={{ height: "100%", overflow: "scroll" }}>
        <ChatMessageArea />
      </Box>
      <Box>
        <ChatMessageForm />
      </Box>
    </>
  );
}

export default ChatRoomBody;