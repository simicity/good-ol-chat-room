import AppHeader from '../AppHeader';
import LobbyBody from './LobbyBody';
import Stack from '@mui/material/Stack';

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
  backgroundColor: 'background.default',
}

export default function Lobby() {
  return (
    <Stack direction="column" sx={style}>
      <AppHeader type={"select-chatroom"} />
      <LobbyBody />
    </Stack>
  )
}
