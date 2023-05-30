import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../slices/hooks';
import { setRoom } from '../../slices/chatroom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

function ChatRoomCard({ chatroom }: { chatroom: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if(chatroom) {
      dispatch(setRoom(chatroom));
      navigate('/room/join/' + chatroom);  
    }
  }

  return (
    <Card variant="elevation" elevation={0} sx={{ backgroundColor: "#F4FAFB" }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography gutterBottom variant="body1" component="div">
            {chatroom}
          </Typography>
        </CardContent>
        <CardContent sx={{ display: "flex", justifyContent: "end" }}>
          <Typography gutterBottom variant="body2" component="div">
            Join
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ChatRoomCard;
