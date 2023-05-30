import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import { useState } from 'react';
import socket from '../../utils/socket';

const gridContainerStyle = {
  backgroundColor: "#EDE7F6",
  padding: "10px 15px",
}

const textFieldStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "5px 10px 3px 10px",
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
      <Grid container sx={gridContainerStyle}>
        <Grid item xs={10} sx={textFieldStyle}>
          <InputBase
            id="messageToSend"
            placeholder="Write Message..."
            size="small"
            value={textFieldValue}
            onChange={handleTextFieldChange}
            sx={textFieldStyle}
            />
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button type="submit" variant="contained" color="secondary" disabled={isButtonDisabled}>Send</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ChatMessageForm;
