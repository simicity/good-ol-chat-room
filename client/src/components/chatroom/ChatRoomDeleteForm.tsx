import AppHeader from '../AppHeader';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '350px',
  height: '400px',
  borderRadius: '15px',
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  backgroundColor: 'background.default',
}

function ChatRoomDeleteForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isInvalidPassword, setInvalidPassword] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const { chatroom } = useParams();

  const deleteChatRoom = async (chatroom: string, password: string) => {
    try {
      await axios.delete(`http://localhost:3000/room/delete/${chatroom}/${password}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if(error.response && error.response.status === 406) {
          setOpenToast(true);
        }
      }
      return;
    }
    navigate('/lobby');
  }

  const handleToastClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenToast(false);
  };

  const handlePasswordTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPassword = event.target.value;
    setPassword(selectedPassword);
    setInvalidPassword(selectedPassword.length < 4);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(chatroom) {
      deleteChatRoom(chatroom, password);
    }
  };

  return (
    <>
      <Box sx={style}>
        <AppHeader type={"delete-chatroom"} />
        <Box sx={{ p: 3 }}>  
        <form onSubmit={handleSubmit}>
          <FormHelperText sx={{ color: "text.primary", ml: 1 }}>Password</FormHelperText>
          <InputBase
            id="password"
            placeholder="What's the password?"
            size="small"
            value={password}
            onChange={handlePasswordTextFieldChange}
            sx={{ 
              backgroundColor: "background.paper",
              borderRadius: "10px",
              width: "100%",
              mb: 3,
              p: 1,
              }}
            />
          <Stack spacing={1} direction="row" sx={{display: "flex", justifyContent: "center"}}>
            <Button onClick={() => navigate("/lobby")}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isInvalidPassword}>Delete</Button>
          </Stack>
        </form>
        </Box>
      </Box>
      <Snackbar open={openToast} autoHideDuration={3000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity="error">
          Password did not match!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ChatRoomDeleteForm;
