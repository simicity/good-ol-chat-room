import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../slices/hooks';
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';

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
    <Stack direction="row" sx={{ justifyContent: "space-between", borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", m: 1, ml: 3 }}>
        {title}
      </Typography>
      {type === "inside-chatroom" && (
        <Button component={RouterLink} to="/room" sx={{ mr: 3 }}>
          Leave
        </Button>      
      )}
    </Stack>
  );
}

export default AppHeader;