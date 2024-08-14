import {AppBar, Button, IconButton, Toolbar} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../context/user-context'

const Navbar = () => {
    const {logout} = useUser();
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/login');
        logout();
    }
    return (
        <AppBar position="fixed" sx={{top: 'auto', bottom: 0, width: '100vw', maxWidth: '100vw'}}>
            <Toolbar className="flex justify-around">
                <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/feed">
                    <HomeRoundedIcon/>
                </IconButton>
                <IconButton edge="start" color="inherit" aria-label="add-guide" component={Link} to="/add-guide">
                    <AddCircleRoundedIcon/>
                </IconButton>
                <IconButton edge="start" color="inherit" aria-label="data-saver" component={Link} to="/data-saver">
                    <DataSaverOffRoundedIcon/>
                </IconButton>
                <IconButton edge="start" color="inherit" aria-label="settings" component={Link} to="/settings">
                    <SettingsRoundedIcon/>
                </IconButton>
                <IconButton edge="start" color="inherit" aria-label="logout" component={Button} onClick={handleLogout}>
                    <LogoutRounded/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
