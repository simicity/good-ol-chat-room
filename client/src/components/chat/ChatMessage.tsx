import { messageData } from '../../interfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatTimeStamp } from '../../utils/formatter';

const style = {
  color: "text.primary",
  backgroundColor: "background.paper",
  m: 1,
  px: 1,
  py: 0.5,
  borderRadius: '8px',
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
  return formatTimeStamp(date);
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
            <Typography variant="caption" component="span" sx={{ color: "text.disabled", ml: 1 }}>
              {createTimeStamp(message.timestamp)}
            </Typography>
          </Box>
          <Typography variant="body2" component="p" sx={{ mt: -0.8 }}>
            {message.message}
          </Typography>
        </Box>
      ) : (
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.disabled" }}>
            <Typography variant="caption" component="p">
              {message.message}
            </Typography>
            <Typography variant="caption" component="span" sx={{ color: "text.disabled", ml: 1 }}>
              {createTimeStamp(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ChatMessage;
