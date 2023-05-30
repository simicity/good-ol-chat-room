import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppThunkDispatch } from '../../slices/hooks';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import ChatRoomCard from './ChatRoomCard';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { fetchChatRooms } from '../../slices/chatrooms';
import { useEffect } from 'react';

function ChatRoomListBody() {
  const chatrooms = useAppSelector(state => state.chatrooms);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/room/create');  
  }

  useAppThunkDispatch(fetchChatRooms());
  
  return (
    <Box sx={{ overflow: "scroll", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card variant="elevation" elevation={0}>
            <CardActionArea onClick={handleClick} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 5 }}>
              <AddIcon sx={{ color: "black" }} />
            </CardActionArea>
          </Card>
        </Grid>
        {chatrooms.chatrooms && chatrooms.chatrooms.length > 0 && (
          chatrooms.chatrooms.map((chatroom) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={chatroom}>
              <ChatRoomCard key={chatroom} chatroom={chatroom} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default ChatRoomListBody;
