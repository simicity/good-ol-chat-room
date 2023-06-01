import AppHeader from '../AppHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { connect } from '../../utils/socketHelper';
import { connectUser } from '../../slices/user';

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

function ChatRoomJoinForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [isUsernameTaken, setUsernameTaken] = useState(false);
  const usersPerRoom = useAppSelector(state => state.users);
  const chatroom = useAppSelector(state => state.chatroom);

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedUsername = event.target.value;
    setUsername(selectedUsername);
    setUsernameTaken(false);
    usersPerRoom.forEach(data => {
      if(data.chatroom == chatroom) {
        setUsernameTaken(data.users.includes(selectedUsername));
      }
    })
  };

  const isButtonDisabled = username === "" || isUsernameTaken;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    connect(username);
    dispatch(connectUser(username));
    navigate('/room/' + chatroom);
  };

  return (
    <Box sx={style}>
      <AppHeader type={"join-chatroom"} />
      <Box sx={{ p: 3 }}>  
      <form onSubmit={handleSubmit}>
        <FormHelperText sx={{ color: "black", ml: 1 }}>Username</FormHelperText>
        <InputBase
          id="username"
          placeholder="What's your username?"
          size="small"
          value={username}
          onChange={handleTextFieldChange}
          sx={{ 
            backgroundColor: "#EBEDEF",
            borderRadius: "10px",
            width: "100%",
            p: 1,
            }}
          />
        {isUsernameTaken && (
          <FormHelperText sx={{ color: "red", ml: 1 }}>The chat room name is already taken.</FormHelperText>
        )}
        <Stack spacing={1} direction="row" sx={{display: "flex", justifyContent: "center", mt: 3}}>
          <Button onClick={() => navigate("/rooms")}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isButtonDisabled}>Join</Button>
        </Stack>
      </form>
      </Box>
    </Box>
  );
}

export default ChatRoomJoinForm;
