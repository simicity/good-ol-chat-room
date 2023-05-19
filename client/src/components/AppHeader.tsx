import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../slices/hooks';

function AppHeader({ type }: { type: string }) {
  let title: string | undefined;
  switch(type) {
    case "select-chatroom":
      title = "Select Chat Room to Join";
      break;
    case "join-chatroom":
      title = "Joining " + useAppSelector(state => state.chatroom.name);
      break;
    case "inside-chatroom":
      title = useAppSelector(state => state.chatroom.name);
      break;
  }

  return (
    <Box sx={{ borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default AppHeader;