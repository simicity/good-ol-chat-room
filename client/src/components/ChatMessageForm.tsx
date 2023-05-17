import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

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
  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container sx={gridContainerStyle}>
        <Grid item xs={10} sx={textFieldStyle}>
          <InputBase
            placeholder="Write Message..."
            size="small"
            sx={textFieldStyle}
            />
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button type="submit" variant="contained" color="secondary">Send</Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ChatMessageForm;
