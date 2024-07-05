import ContextProvider from "../providers/ContextProvider.tsx";
import {Outlet, useLocation} from "react-router-dom";
import MuiProvider from "../providers/MuiProvider.tsx";
import Navbar from '../components/Navbar.tsx'; // Adjust the path as needed

export default function Root() {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/signup', '/'];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
    return (
        <ContextProvider>
            <MuiProvider>
                <div className="flex flex-column flex-wrap justify-center items-center w-full h-full">
                    {!shouldHideNavbar && <Navbar />}
                    <div className={!shouldHideNavbar ? "main-content" : "hidden-navbar-content"}>
                        <Outlet />
                    </div>
                </div>
            </MuiProvider>
        </ContextProvider>
    );
}
