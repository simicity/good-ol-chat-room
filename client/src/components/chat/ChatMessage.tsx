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

const createTimeStamp = (date: Date) => {
  const timestamp = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  };

  return timestamp.toLocaleString('en-US', options);
}

function ChatMessage({ message }: { message: messageData }) {

  return (
    <>
      {message.from ? (
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" component="span" sx={{ color: generateRandomColor(message.from), fontWeight: "bold" }}>
              {message.from}
            </Typography>
            <Typography variant="caption" component="span">
              {createTimeStamp(message.timestamp)}
            </Typography>
          </Box>
          <Typography variant="body2" component="p">
            {message.message}
          </Typography>
        </Box>
      ) : (
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" component="p">
              {message.message}
            </Typography>
            <Typography variant="caption" component="span">
              {createTimeStamp(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ChatMessage;
