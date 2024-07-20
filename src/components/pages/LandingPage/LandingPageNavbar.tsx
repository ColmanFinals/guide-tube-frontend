import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Logo from '../../../assets/white_guidetube.png'
import Grid from '@mui/material/Grid';

const LandingPageNavbar = () => {
    return(
    <Grid className="flex justify-between items-center p-2 w-full" style={{background: '#171717'}}>
        <Link to="/">
          <img src={Logo} style={{width: 100, height: 100}}/>
        </Link>
        <div>
          <Link to="/login" className="text-gray-400 hover:text-gray-200 mr-4">
            <Button>
              Login
            </Button>
          </Link> 
          <Link to="/signup" className="text-gray-400 hover:text-gray-200 mr-4">
          <Button variant="contained">
            Sign Up
          </Button>
          </Link> 
        </div>
      </Grid>
    );
}
export default LandingPageNavbar;