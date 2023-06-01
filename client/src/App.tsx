import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/App.css';
import ChatRoom from './components/chat/ChatRoom';
import ChatRoomList from './components/entrance/ChatRoomList';
import ChatRoomJoinForm from './components/entrance/ChatRoomJoinForm';
import ChatRoomCreationForm from './components/entrance/ChatRoomCreationForm'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useSocket } from './utils/socketHelper';
import ChatRoomDeleteForm from './components/entrance/ChatRoomDeleteForm';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatRoomList />
  },
  {
    path: "/rooms",
    element: <ChatRoomList />
  },
  {
    path: "/room/join/:chatroom",
    element: <ChatRoomJoinForm />,
  },
  {
    path: "/room/create",
    element: <ChatRoomCreationForm />,
  },
  {
    path: "/room/delete/:chatroom",
    element: <ChatRoomDeleteForm />,
  },
  {
    path: "/room/:chatroom",
    element: <ChatRoom />
  }
]);

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ['Wix Madefor Text', 'sans-serif'].join(","),
    },
  });

  useSocket();

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App;