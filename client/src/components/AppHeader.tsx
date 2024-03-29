import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../slices/hooks';
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { leaveChatRoom } from '../utils/socketHelper';
import { resetColorPerUserCache } from './chat/ChatMessage';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect } from 'react';
import { setRoom } from '../slices/chatroom';
import { setUserData } from '../slices/user';
import { joinChatRoom } from '../utils/socketHelper';

function AppHeader({ type }: { type: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chatroom } = useParams();

  let title: string | undefined;
  switch(type) {
    case "select-chatroom":
      title = "Select Chat Room to Join";
      break;
    case "create-chatroom":
      title = "Create Chat Room and Join";
      break;
    case "join-chatroom":
      title = "Joining " + chatroom;
      break;
    case "delete-chatroom":
      title = "Delete " + chatroom;
      break;
    case "inside-chatroom":
      title = chatroom;
      break;
  }

  const handleLeave = () => {
    resetColorPerUserCache();
    if(chatroom) {
      leaveChatRoom(chatroom);
    }
  }

  useEffect(() => {
    function handleConnection() {
      if(type === "inside-chatroom") {
        const username = localStorage.getItem("username");
        if(!chatroom || !username) {
          navigate('/lobby');
          return;
        }
        dispatch(setRoom(chatroom));
        dispatch(setUserData(username));
        joinChatRoom(chatroom, username);
      }
    }

    handleConnection();
  }, [dispatch]);

  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", borderBottom: "1px solid #eee", color: "text.primary" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {title}
      </Typography>
      {type === "inside-chatroom" && (
        <Button component={RouterLink} to="/lobby" onClick={handleLeave} sx={{ mr: 2 }}>
          <ExitToAppIcon sx={{ color: "primary", mr: 0.4 }} />
          Leave
        </Button>   
      )}
    </Stack>
  );
}

export default AppHeader;