import ChatRoom from './components/ChatRoom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/App.css';
import ChatRoomJoinForm from './components/ChatRoomJoinForm';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useSocket } from './utils/socketHelper';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatRoomJoinForm />,
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