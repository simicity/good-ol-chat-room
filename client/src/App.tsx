import ChatRoom from './components/ChatRoom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/App.css';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ['Wix Madefor Text', 'sans-serif'].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ChatRoom />
    </ThemeProvider>
  )
}

export default App;