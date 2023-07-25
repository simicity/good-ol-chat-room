import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/App.css';
import ChatRoom from './components/chat/ChatRoom';
import Lobby from './components/lobby/Lobby';
import ChatRoomJoinForm from './components/chatroom/ChatRoomJoinForm';
import ChatRoomCreationForm from './components/chatroom/ChatRoomCreationForm'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { connect, useSocket } from './utils/socketHelper';
import ChatRoomDeleteForm from './components/chatroom/ChatRoomDeleteForm';
import { createContext, useMemo, useState } from 'react';
import ColorMode from './components/ColorMode';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />
  },
  {
    path: "/lobby",
    element: <Lobby />
  },
  {
    path: "/chatroom/join/:chatroom",
    element: <ChatRoomJoinForm />,
  },
  {
    path: "/chatroom/create",
    element: <ChatRoomCreationForm />,
  },
  {
    path: "/chatroom/delete/:chatroom",
    element: <ChatRoomDeleteForm />,
  },
  {
    path: "/chatroom/:chatroom",
    element: <ChatRoom />
  }
]);

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light') ? {
            background: {
              paper: "#F4FAFB"
            }
          } : {
            background: {
              paper: "#424242"
            }
          }
        },
        typography: {
          button: {
            textTransform: 'none'
          }
        },
      }),
    [mode],
  );

  connect();
  useSocket();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <ColorMode />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}