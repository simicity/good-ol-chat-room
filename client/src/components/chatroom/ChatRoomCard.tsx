import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { setRoom } from '../../slices/chatroom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircleIcon from '@mui/icons-material/Circle';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';

const options = [
  'Delete',
];

const ITEM_HEIGHT = 48;

function ChatRoomMenu({ chatroom }: { chatroom: string }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);

    const eventId = event.currentTarget.id;
    switch (eventId) {
      case "Delete":
        if(chatroom) {
          navigate('/chatroom/delete/' + chatroom);
        }
        break;
    }
  };

  return (
    <Box sx={{ my: "auto" }}>
      <IconButton
        aria-label="more"
        id="chatroom-menu-button"
        component="span"
        aria-controls={open ? 'chatroom-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>
      <Menu
        id="chatroom-menu"
        MenuListProps={{
          'aria-labelledby': 'chatroom-menu-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenu}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} id={option} onClick={handleMenu}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

function ChatRoomCard({ chatroom }: { chatroom: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const usersInRoom = useAppSelector(state => state.users);
  const [numOfUsers, setNumOfUsers] = useState(0);

  const handleClick = () => {
    if(chatroom) {
      dispatch(setRoom(chatroom));
      navigate('/chatroom/join/' + chatroom);  
    }
  }

  useEffect(() => {
    function updateUsersInRoom() {
      setNumOfUsers(0);
      usersInRoom.forEach((data) => {
        if (data.chatroom === chatroom) {
          setNumOfUsers(data.users.length);
        }
      });
    }

    updateUsersInRoom();
  }, [usersInRoom]);

  return (
    <Stack direction={"column"}>
      <Card variant="elevation" elevation={0} sx={{ width: "100%", color: "black", borderRadius: "10px", backgroundColor: "background.paper" }}>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
              <Typography gutterBottom variant="body1" component="div" fontWeight={"bold"} sx={{ color:"text.primary" }}>
                {chatroom}
              </Typography>
              <ChatRoomMenu chatroom={chatroom} />
            </Stack>
          </CardContent>
          <CardContent sx={{ display: "flex", justifyContent: "end" }}>
            <CircleIcon sx={{ fontSize: 8, color: numOfUsers > 0 ? 'success.main' : 'text.disabled', my: 'auto' }} />
            <Typography gutterBottom variant="body2" component="div" sx={{ ml: 1, my: 'auto', color:"text.primary" }}>
              {numOfUsers + (numOfUsers >= 2 ? " people are" : " person is") + " here."}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Stack>
  )
}

export default ChatRoomCard;
