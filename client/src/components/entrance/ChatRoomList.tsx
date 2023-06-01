import AppHeader from '../AppHeader';
import ChatRoomListBody from './ChatRoomListBody';
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
  backgroundColor: 'white',
}

function ChatRoomEntrance() {
  return (
    <Stack direction="column" sx={style}>
      <AppHeader type={"select-chatroom"} />
      <ChatRoomListBody />
    </Stack>
  )
}

export default ChatRoomEntrance;