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

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatRoomList />
  },
  {
    path: "/room",
    element: <ChatRoomList />
  },
  {
    path: "/room/join/:id",
    element: <ChatRoomJoinForm />,
  },
  {
    path: "/room/create",
    element: <ChatRoomCreationForm />,
  },
  {
    path: "/room/:id",
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