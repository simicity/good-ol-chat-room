import { ChatRoomData } from '../../interfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../slices/hooks';
import { setRoom } from '../../slices/chatroom';
import { ButtonBase } from '@mui/material';


const style = {
  backgroundColor: '#EAF2F8',
  p: '5px 15px', 
  borderRadius: '10px',
}

function ChatRoomCard({ chatroom }: { chatroom: ChatRoomData }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roomsize = chatroom.members.length;

  const handleClick = () => {
    if(chatroom.name) {
      dispatch(setRoom(chatroom.name));
      navigate('/room/join/' + chatroom.name);  
    }
  }

  return (
    <ButtonBase sx={{ display: "block", width: "100%" }}>
      <Box sx={style} onClick={handleClick}>
        <Typography variant="body1" component="p">
          {chatroom.name}
        </Typography>
        <Typography variant="caption" component="p">
          {roomsize + " member" + (roomsize > 1 ? "s" : "")}
        </Typography>
      </Box>
    </ButtonBase>
  )
}

export default ChatRoomCard;
