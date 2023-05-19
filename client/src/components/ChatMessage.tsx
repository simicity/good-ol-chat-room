import { messageData } from './../interfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  backgroundColor: '#EAF2F8', 
  margin: '10px 5px', 
  p: '5px 15px', 
  borderRadius: '10px',
}

function ChatMessage({ message }: { message: messageData }) {

  return (
    <Box sx={style}>
      <Typography variant="caption" component="p" sx={{ color: "#BA68C8" }}>
        {message.from}
      </Typography>
      <Typography variant="body2" component="p">
        {message.message}
      </Typography>
    </Box>
  )
}

export default ChatMessage;
