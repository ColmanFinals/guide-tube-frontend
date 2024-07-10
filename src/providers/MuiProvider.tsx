import {createTheme, ThemeProvider} from "@mui/material";
import {ReactElement} from "react";
import { CssBaseline } from "@mui/material";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#FFB3A6', 
      contrastText: '#561F0F', 
    },
    secondary: {
      main: '#E7BDB2',
      contrastText: '#442A22', 
    },
    error: {
      main: '#FFB4AB', 
      contrastText: '#690005', 
    },
    background: {
      default: '#212121', 
      paper: '#212121', 
    },
    text: {
      primary: '#F1DFDE', 
      secondary: '#dbb8b8', 
    }
  },
});


const MuiProvider = ({children}: { children: ReactElement }) => {
    return <ThemeProvider theme={theme}>
      <CssBaseline/>
        {children}
    </ThemeProvider>;
}

export default MuiProvider;