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
  const currentChatroom = useAppSelector(state => state.chatroom);
  const user = useAppSelector(state => state.user);

  let title: string | undefined;
  switch(type) {
    case "select-chatroom":
      title = "Select Chat Room to Join";
      break;
    case "create-chatroom":
      title = "Create Chat Room and Join";
      break;
    case "join-chatroom":
      title = "Joining " + currentChatroom;
      break;
    case "delete-chatroom":
      title = "Delete " + chatroom;
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
    function handleConnectionError() {
      if(type === "inside-chatroom" && !currentChatroom) {
        if(!chatroom || !user) {
          navigate('/rooms');
          return;
        }
        dispatch(setRoom(chatroom));
        reconnect();
      } 
    }

    handleConnectionError();
  }, [dispatch, currentChatroom]);

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