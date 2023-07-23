import { messageData } from '../../interfaces';
import ChatMessage from './ChatMessage';
import Box from '@mui/material/Box';
import { useAppSelector } from '../../slices/hooks';
import Typography from '@mui/material/Typography';

function ChatMessageArea() {
  const messages = useAppSelector(state => state.messages);
  let currentTimestamp: Date = new Date();
  let currentYear = 2010//currentTimestamp.getFullYear();
  let currentMonth = currentTimestamp.getMonth();
  let currentDate = currentTimestamp.getDate();

  return (
    <Box sx={{ m:1, justifyContent: "center" }}>
      {messages && messages.length > 0 && (
        messages.map((message: messageData, index: number) => {
          const messageTimestamp = new Date(message.timestamp);
          const messageYear = messageTimestamp.getFullYear();
          const messageMonth = messageTimestamp.getMonth();
          const messageDate = messageTimestamp.getDate();
          let showDate = false;
          if (messageYear != currentYear || messageMonth != currentMonth || messageDate != currentDate) {
            showDate = true;
          }
          currentYear = messageYear;
          currentMonth = messageMonth;
          currentDate = messageDate;
        
          return (
            <Box key={index}>
              {showDate && (
                <Typography variant="caption" component="p" sx={{ textAlign: "center", color:"text.disabled", mb: -0.5 }} >
                  {messageMonth}/{messageDate}/{messageYear}
                </Typography>
              )}
              <ChatMessage message={message} />
            </Box>
          );
        })
      )}
    </Box>
  )
}

export default ChatMessageArea;
