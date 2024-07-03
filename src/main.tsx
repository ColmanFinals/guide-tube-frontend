import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Root from "./routes/Root.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import {SignupRoute} from "./routes/SignupRoute.tsx";
import {LoginRoute} from "./routes/LoginRoute.tsx";
import {DashboardRoute} from "./routes/DashboardRoute.tsx";
import {HomePageRoute} from './routes/HomePageRoute.tsx';
import LandingPage from './components/pages/LandingPage/LandingPage.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '/',
                element: <LandingPage/>,
            },
            {
                path: 'dashboard',
                element: <DashboardRoute/>,
            },
            {
                path: 'login',
                element: <LoginRoute/>,
            },
            {
                path: 'signup',
                element: <SignupRoute/>,
            },
            {
                path: 'home',
                element: <HomePageRoute/>,
            },
            {
                path: 'error',
                element: <ErrorPage/>,
            },
            {
                path: '*',
                element: <Navigate to='login'/>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
