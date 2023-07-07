import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import { ColorModeContext } from '../App';

export default function ColorMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        color: 'text.primary',
        borderRadius: 1,
        p: 1,
      }}
    >
      <IconButton sx={{ backgroundColor: "background.default" }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <NightlightRoundIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
}