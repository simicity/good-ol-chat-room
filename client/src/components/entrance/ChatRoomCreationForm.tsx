import AppHeader from './../AppHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch } from '../../slices/hooks';
import { onConnect } from '../../utils/socketHelper';
import { connectUser } from '../../slices/user';
import { addChatRoom } from '../../slices/chatrooms';
import { setRoom } from '../../slices/chatroom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '350px',
  height: '400px',
  borderRadius: '15px',
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  backgroundColor: 'white',
}

function ChatRoomCreationForm() {
  const [isChatRoomNameEmpty, setChatRoomNameEmpty] = useState(true);
  const [isUsernameEmpty, setUsernameEmpty] = useState(true);
  const handleChatRoomTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatRoomNameEmpty(event.target.value === "");
  };
  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameEmpty(event.target.value === "");
  };
  const isButtonDisabled = isChatRoomNameEmpty || isUsernameEmpty;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const selectedChatRoom = target.chatroom.value;
    const selectedUsername = target.username.value;
    if((selectedChatRoom && selectedChatRoom.length >= 3) && (selectedUsername && selectedUsername.length >= 3)) {
      dispatch(addChatRoom(selectedChatRoom));
      dispatch(setRoom(selectedChatRoom));
      onConnect(selectedUsername);
      dispatch(connectUser(selectedUsername));
      navigate('/room/' + selectedChatRoom);
    }
  };

  return (
    <Box sx={style}>
      <AppHeader type={"join-chatroom"} />
      <Box sx={{ p: 3 }}>  
      <form onSubmit={handleSubmit}>
        <FormHelperText sx={{ color: "black", ml: 1 }}>Chat Room Name</FormHelperText>
        <InputBase
          id="chatroom"
          placeholder="What's the room name?"
          size="small"
          onChange={handleChatRoomTextFieldChange}
          sx={{ 
            backgroundColor: "#EBEDEF",
            borderRadius: "10px",
            width: "100%",
            mb: 3,
            p: 1,
            }}
          />
        <FormHelperText sx={{ color: "black", ml: 1 }}>Username</FormHelperText>
        <InputBase
          id="username"
          placeholder="What's your username?"
          size="small"
          onChange={handleUsernameTextFieldChange}
          sx={{ 
            backgroundColor: "#EBEDEF",
            borderRadius: "10px",
            width: "100%",
            mb: 3,
            p: 1,
            }}
          />
        <Stack spacing={1} direction="row" sx={{display: "flex", justifyContent: "center"}}>
          <Button onClick={() => navigate("/room")}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isButtonDisabled}>Join</Button>
        </Stack>
      </form>
      </Box>
    </Box>
  );
}

export default ChatRoomCreationForm;
