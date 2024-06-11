import ContextProvider from "../providers/ContextProvider.tsx";
import {Outlet} from "react-router-dom";
import MuiProvider from "../providers/MuiProvider.tsx";

export default function Root() {
    return (
        <ContextProvider>
            <MuiProvider>
                        <Outlet/>
            </MuiProvider>
        </ContextProvider>
    );
}