import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Root from "./Root.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import SignupPage from "./components/pages/SignupPage.tsx"
import LoginPage from './components/pages/LoginPage/LoginPage.tsx';
import HomePage from './components/pages/HomePage.tsx';
import UploadGuidePage from './components/pages/UploadGuide.tsx/UploadGuide.tsx';
import LandingPage from './components/pages/LandingPage/LandingPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

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
                path: 'login',
                element: <LoginPage/>,
            },
            {
                path: 'signup',
                element: <SignupPage/>,
            },
            {
                path: 'home',
                element: <ProtectedRoute> <HomePage/> </ProtectedRoute>,
            },
            {
                path: 'add-guide',
                element: <ProtectedRoute> <UploadGuidePage/> </ProtectedRoute>,
            },
            {
                path: 'error',
                element: <ProtectedRoute> <ErrorPage/> </ProtectedRoute>,
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
