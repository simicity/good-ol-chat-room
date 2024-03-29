import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../slices/hooks';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import ChatRoomCard from '../chatroom/ChatRoomCard';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';

export default function LobbyBody() {
  const chatrooms = useAppSelector(state => state.chatrooms);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chatroom/create');  
  }

  return (
    <Box sx={{ overflow: "scroll", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card variant="elevation" elevation={0}>
            <CardActionArea onClick={handleClick} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 6, backgroundColor: "background.default" }}>
              <AddIcon sx={{ color: "text.primary" }} />
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
