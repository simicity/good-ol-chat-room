import AppHeader from './AppHeader';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import FormHelperText from '@mui/material/FormHelperText';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  height: '80%',
  maxWidth: '1000px',
  borderRadius: '15px',
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  backgroundColor: 'white',
}

function ChatRoomJoinForm() {
  const handleSubmit = () => {};

  return (
    <Box sx={style}>
      <AppHeader type={"join-room"} />
      <form onSubmit={handleSubmit()}>
        <FormHelperText sx={{ color: "black", ml: 1 }}>Username</FormHelperText>
        <InputBase
          placeholder="What's your username?" 
          size="small"
          sx={{ 
            border: "2px solid black", 
            borderRadius: "10px", 
            mb: 2, 
            p: 1, 
            pb: 0 
            }}
          />
        <Stack spacing={1} direction="row" sx={{display: "flex", justifyContent: "right"}}>
          <Button onClick={() => {}}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ border: "2px solid black" }}>Join</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default ChatRoomJoinForm;
