import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { setRoom } from '../../slices/chatroom';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

function ChatRoomListBody() {
  const chatrooms = useAppSelector(state => state.chatrooms);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = (chatroom: string | undefined) => {
    if(chatroom) {
      dispatch(setRoom(chatroom));
      navigate('/room/join/' + chatroom);  
    } else {
      navigate('/room/create');  
    }
  }

  return (
    <List sx={{ width: "100%", height: "100%", overflow: "scroll" }}>
      <Link to="/room/create" style={{ textDecoration: "none", color: "white" }}>
        <ListItemButton sx={{ mr: 1, ml: 1, backgroundColor: "#7FB3D5", borderRadius: "5px" }}>
          <AddIcon />
          <ListItemText primary={"New Room"} />
        </ListItemButton>
      </Link>
      <Divider variant="middle" component="li" />
      {chatrooms && chatrooms.length > 0 && (
        chatrooms.map((chatroom, index) => (
          <>
            <ListItemButton key={index} alignItems="flex-start" onClick={() => {handleClick(chatroom.name);}} sx={{ mr: 1, ml: 1 }}>
              <ListItemText
                primary={chatroom.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {chatroom.members.length + (chatroom.members.length >= 2 ? " people are " : " person is " + "here right now." )}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItemButton>
            <Divider variant="middle" component="li" />
          </>
        ))
      )}
    </List>
  )
}

export default ChatRoomListBody;
