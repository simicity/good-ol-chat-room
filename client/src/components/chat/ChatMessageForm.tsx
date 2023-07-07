import { useState } from 'react';
import socket from '../../utils/socket';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const messageAreaStyle = {
  border: 1,
  borderColor: "text.secondary",
  borderRadius: '10px',
  m: 1.5,
}

const textFieldStyle = {
  backgroundColor: "background.default",
  borderRadius: "10px",
  p: 1.5,
  pr: 4,
  width: "100%"
}

function ChatMessageForm() {
  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const messageToSend: string = target.messageToSend.value;
    if(messageToSend) {
      socket.emit("chatroomMessage", messageToSend);
    }
    setTextFieldValue("");
  };
  const isButtonDisabled = textFieldValue === "";

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={"row"} sx={messageAreaStyle}>
        <InputBase
          id="messageToSend"
          placeholder="Write Message..."
          size="small"
          fullWidth
          multiline
          value={textFieldValue}
          onChange={handleTextFieldChange}
          sx={textFieldStyle}
          />
        <Box sx={{ justifyContent: "end" }}>
          <IconButton type="submit" disabled={isButtonDisabled} sx={{ position: "absolute", bottom: 0, right: 0, m: 1.5, mb: 2, color: "text.primary" }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Stack>
    </form>
  )
}

export default ChatMessageForm;
