import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Root from "./routes/Root.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import SignupPage from "./components/pages/SignupPage.tsx"
import DashboardPage from './components/pages/DashboardPage.tsx';
import LoginPage from './components/pages/LoginPage/LoginPage.tsx';
import HomePage from './components/pages/HomePage.tsx';
import UploadGuidePage from './components/pages/UploadGuide.tsx/UploadGuide.tsx';
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
                element: <DashboardPage/>,
            },
            {
                path: 'login',
                element: <LoginPage/>,
            },
            {
                path: 'signup',
                element: <SignupPage/>,
            },
            {
                path: 'home',
                element: <HomePage/>,
            },
            {
                path: 'add-guide',
                element: <UploadGuidePage/>,
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
