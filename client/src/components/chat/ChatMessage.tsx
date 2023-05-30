import { messageData } from '../../interfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  backgroundColor: '#EAF2F8', 
  margin: '10px 5px', 
  p: '5px 15px', 
  borderRadius: '10px',
}

const colorPerUserCache = new Map<string, string>();

export const resetColorPerUserCache = () => {
  colorPerUserCache.clear();
};

const generateRandomColor = (username: string) => {
  if(colorPerUserCache.has(username)) {
    return colorPerUserCache.get(username);
  }

  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 16);
    color += letters[randomIndex];
  }

  colorPerUserCache.set(username, color);
  return color;
}

function ChatMessage({ message }: { message: messageData }) {

  return (
    <Box sx={style}>
      <Typography variant="caption" component="p" sx={{ color: generateRandomColor(message.from), fontWeight: "bold" }}>
        {message.from}
      </Typography>
      <Typography variant="body2" component="p">
        {message.message}
      </Typography>
    </Box>
  )
}

export default ChatMessage;
