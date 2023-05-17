import { ChatRoomData } from './../typeInterfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AppHeader({ chatRoom }: { chatRoom: ChatRoomData }) {

  return (
    <Box sx={{ borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {chatRoom.roomName}
      </Typography>
    </Box>
  );
}

export default AppHeader;