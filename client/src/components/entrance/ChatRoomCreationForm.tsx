import AppHeader from './../AppHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { connect } from '../../utils/socketHelper';
import { setRoom } from '../../slices/chatroom';
import { connectUser } from '../../slices/user';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';

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

const createChatRoom = async (chatroom: string, password: string) => {
  await axios.post('http://localhost:3000/room', {
      "name": chatroom,
      "password": password,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .catch((error) => {
    throw new Error(`HTTP error: ${error}`);
  });
  
}

function ChatRoomCreationForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [chatRoomName, setChatRoomName] = useState("");
  const [isChatRoomNameTaken, setChatRoomNameTaken] = useState(false);
  const [password, setPassword] = useState("");
  const [isInvalidPassword, setInvalidPassword] = useState(false);
  const [username, setUsername] = useState("");
  const chatrooms = useAppSelector(state => state.chatrooms);

  const handleChatRoomTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedChatroomName = event.target.value;
    setChatRoomName(selectedChatroomName);
    setChatRoomNameTaken(chatrooms.chatrooms.includes(selectedChatroomName));
  };

  const handlePasswordTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPassword = event.target.value;
    setPassword(selectedPassword);
    setInvalidPassword(selectedPassword.length < 4);
  };

  const handleUsernameTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUsername = event.target.value;
    setUsername(selectedUsername);
  };

  const isButtonDisabled = chatRoomName === "" || username === "" || isChatRoomNameTaken || isInvalidPassword;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createChatRoom(chatRoomName, password);
    connect(username);
    dispatch(connectUser(username));
    dispatch(setRoom(chatRoomName));
    navigate('/room/' + chatRoomName);
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
          value={chatRoomName}
          onChange={handleChatRoomTextFieldChange}
          sx={{ 
            backgroundColor: "#EBEDEF",
            borderRadius: "10px",
            width: "100%",
            p: 1,
            }}
          />
        {isChatRoomNameTaken && (
          <FormHelperText sx={{ color: "red", ml: 1 }}>The chat room name is already taken.</FormHelperText>
        )}

        <Tooltip title="You need this password when deleting this chatroom." placement="right-end" arrow>
          <FormHelperText sx={{ color: "black", ml: 1, mt: 1 }}>Password</FormHelperText>
        </Tooltip>
        <InputBase
          id="password"
          placeholder="What's your password?"
          size="small"
          value={password}
          onChange={handlePasswordTextFieldChange}
          sx={{ 
            backgroundColor: "#EBEDEF",
            borderRadius: "10px",
            width: "100%",
            p: 1,
            }}
          />
        {isInvalidPassword && (
          <FormHelperText sx={{ color: "red", ml: 1 }}>Password has to be longer than 4 characters.</FormHelperText>
        )}

        <FormHelperText sx={{ color: "black", ml: 1, mt: 1 }}>Username</FormHelperText>
        <InputBase
          id="username"
          placeholder="What's your username?"
          size="small"
          value={username}
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
          <Button onClick={() => navigate("/rooms")}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isButtonDisabled}>Join</Button>
        </Stack>
      </form>
      </Box>
    </Box>
  );
}

export default ChatRoomCreationForm;
