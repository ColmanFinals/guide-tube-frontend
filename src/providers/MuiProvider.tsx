import {createTheme, ThemeProvider} from "@mui/material";
import {ReactElement} from "react";
import { CssBaseline } from "@mui/material";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark', // This sets the color mode of the theme
    primary: {
      main: '#FFB3A6', // equivalent to --md-sys-color-primary
      contrastText: '#561F0F', // equivalent to --md-sys-color-on-primary
    },
    secondary: {
      main: '#E7BDB2', // equivalent to --md-sys-color-secondary
      contrastText: '#442A22', // equivalent to --md-sys-color-on-secondary
    },
    error: {
      main: '#FFB4AB', // equivalent to --md-sys-color-error
      contrastText: '#690005', // equivalent to --md-sys-color-on-error
    },
    background: {
      default: '#212121', // equivalent to --md-sys-color-background
      paper: '#212121', // equivalent to --md-sys-color-surface
    },
    text: {
      primary: '#F1DFDE', // equivalent to --md-sys-color-on-background
      secondary: '#DBC0C0', // equivalent to --md-sys-color-on-surface-variant
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