import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import { disconnect } from '../utils/socketHelper';
import { resetColorPerUserCache } from './chat/ChatMessage';

function AppHeader({ type }: { type: string }) {
  const chatroom = useAppSelector(state => state.chatroom);
  const user = useAppSelector(state => state.user);  

  let title: string | undefined;
  switch(type) {
    case "select-chatroom":
      title = "Select Chat Room to Join";
      break;
    case "join-chatroom":
      title = "Joining " + chatroom;
      break;
    case "inside-chatroom":
      title = chatroom;
      break;
  }

  const handleLeave = () => {
    resetColorPerUserCache();
    disconnect();
  }

  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {title}
      </Typography>
      {type === "inside-chatroom" && (
        <Button component={RouterLink} to="/room" onClick={handleLeave} sx={{ mr: 3 }}>
          Leave
        </Button>      
      )}
    </Stack>
  );
}

export default AppHeader;