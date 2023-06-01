import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { reconnect, disconnect } from '../utils/socketHelper';
import { resetColorPerUserCache } from './chat/ChatMessage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect } from 'react';
import { setRoom } from '../slices/chatroom';

function AppHeader({ type }: { type: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chatroom } = useParams();

  let currentChatroom = "";
  if(type === "join-chatroom" || type === "inside-chatroom") {
    currentChatroom = useAppSelector(state => state.chatroom);
  } else if(type === "delete-chatroom") {
    if(chatroom) {
      currentChatroom = chatroom;
    }
  }

  let title: string | undefined;
  switch(type) {
    case "select-chatroom":
      title = "Select Chat Room to Join";
      break;
    case "join-chatroom":
      title = "Joining " + currentChatroom;
      break;
    case "delete-chatroom":
      title = "Delete " + currentChatroom;
      break;
    case "inside-chatroom":
      title = currentChatroom;
      break;
  }

  const handleLeave = () => {
    resetColorPerUserCache();
    disconnect();
  }

  useEffect(() => {
    if(!currentChatroom) {
      if(!chatroom) {
        navigate('/rooms');
        return;
      }
      dispatch(setRoom(chatroom));
      reconnect();
    } 
  }, [currentChatroom]);

  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {title}
      </Typography>
      {type === "inside-chatroom" && (
        <Button component={RouterLink} to="/rooms" onClick={handleLeave} sx={{ mr: 3 }}>
          <ExitToAppIcon sx={{ color: "primary", mr: 1 }} />
          Leave
        </Button>   
      )}
    </Stack>
  );
}

export default AppHeader;