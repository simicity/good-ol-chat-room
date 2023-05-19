import AppHeader from './AppHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../slices/hooks';
import { onConnect } from '../utils/socketHelper';
import { connectUser } from '../slices/user';

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
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonDisabled(event.target.value === "");
  };
  const navigate = useNavigate();
  const chatroom = useAppSelector(state => state.chatroom.name);
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const selectedUsername = target.username.value;
    if(selectedUsername && selectedUsername.length >= 3) {
      onConnect(selectedUsername);
      dispatch(connectUser(selectedUsername));
      navigate('/room/' + chatroom);
    }
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
          onChange={handleTextFieldChange}
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

export default ChatRoomJoinForm;
