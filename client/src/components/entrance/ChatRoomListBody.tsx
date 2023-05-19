import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ChatRoomCard from './ChatRoomCard';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../slices/hooks';

function ChatRoomListBody() {
  const chatrooms = useAppSelector(state => state.chatrooms);

  return (
    <Box sx={{ m:2 }}>
      <Grid container spacing={2}>
      {chatrooms && chatrooms.length > 0 ? (
        chatrooms.map((chatroom, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ChatRoomCard key={chatroom.name} chatroom={chatroom} />
          </Grid>
        ))
      ) : (
        <Typography component="div" variant="body1">
          No Chat Room
        </Typography>
      )}
    </Grid>
    </Box>
  )
}

export default ChatRoomListBody;
