import {AppBar, Fade, IconButton, Menu, MenuItem, Toolbar} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../context/user-context';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';

const Navbar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate('/login');
    logout();
  };

  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, width: '100vw', maxWidth: '100vw' }}>
      <Toolbar className="flex justify-around">
        <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/company">
          <HomeRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="add-guide" component={Link} to="/add-guide">
          <AddCircleRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="data-saver" component={Link} to="/data-saver">
          <DataSaverOffRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="settings" onClick={handleSettingsClick}>
          <SettingsRoundedIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="logout" component={Link} to="/login" onClick={handleLogout}>
          <LogoutRounded />
        </IconButton>
      </Toolbar>

      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}><PersonRoundedIcon/> Profile</MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}><ManageAccountsRoundedIcon/> Roles</MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/system'); }}><StoreRoundedIcon/> Companies</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
