import ContextProvider from "./providers/ContextProvider.tsx";
import {Outlet, useLocation} from "react-router-dom";
import MuiProvider from "./providers/MuiProvider.tsx";
import Navbar from './components/Navbar.tsx'; // Adjust the path as needed
import { Grid } from "@mui/material";

export default function Root() {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/signup', '/'];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
    return (
        <ContextProvider>
            <MuiProvider>
                <div className="flex flex-column flex-wrap justify-center items-center w-full h-full">
                    {!shouldHideNavbar && <Navbar />}
                    <Grid className={!shouldHideNavbar ? "main-content" : "hidden-navbar-content"}>
                        <Outlet/>
                    </Grid>
                </div>
            </MuiProvider>
        </ContextProvider>
    );
}
