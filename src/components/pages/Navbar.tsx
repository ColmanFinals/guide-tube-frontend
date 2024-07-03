import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, width: '100%', maxWidth: '100%'}}>
      <Toolbar className="flex justify-around">
        <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/home">
          <HomeRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/home">
          <AddCircleRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="data-saver" component={Link} to="/data-saver">
          <DataSaverOffRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="data-saver" component={Link} to="/data-saver">
          <SettingsRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
