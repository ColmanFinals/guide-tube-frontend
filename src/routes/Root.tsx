import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom'; // Ensure Outlet is imported
import ContextProvider from "../providers/ContextProvider";
import MuiProvider from "../providers/MuiProvider";

interface RootProps {
    children?: ReactNode;  // This defines the type for children elements
}

class Root extends React.Component<RootProps> {
    render() {
        return (
            <ContextProvider>
                <MuiProvider>
                    {/* Using Outlet here to render child routes */}
                    <Outlet />
                </MuiProvider>
            </ContextProvider>
        );
    }
}

export default Root;
