import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Root from "./Root.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import SignupPage from "./components/pages/SignupPage.tsx"
import LoginPage from './components/pages/LoginPage/LoginPage.tsx';
import VideoPage from './components/pages/VideoPage.tsx';
import UploadGuidePage from './components/pages/UploadGuide/UploadGuide.tsx';
import LandingPage from './components/pages/LandingPage/LandingPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import CompanyManager from './components/pages/systemPage/Company.tsx';
import AdminPage from './components/pages/AdminPage.tsx';
import UserProfile from './components/pages/UserProfilePage.tsx';
import CompaniesPage from "./components/pages/CompaniesPage.tsx";
import FeedPage from "./components/pages/FeedPage.tsx";

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
                path: 'company',
                element: <ProtectedRoute> <CompaniesPage/> </ProtectedRoute>,
            },
            {
                path: '/feed/:companyName',
                element: <ProtectedRoute> <FeedPage/> </ProtectedRoute>,
            },
            {
                path: '/video/:guideId',
                element: <ProtectedRoute> <VideoPage/> </ProtectedRoute>,
            },
            {
                path: 'system',
                element: <ProtectedRoute> <CompanyManager/> </ProtectedRoute>,
            },
            {
                path: 'add-guide',
                element: <ProtectedRoute> <UploadGuidePage/> </ProtectedRoute>,
            },
            {
                path: 'admin',
                element: <ProtectedRoute> <AdminPage/> </ProtectedRoute>,
            },
            {
                path: 'profile',
                element: <ProtectedRoute> <UserProfile/> </ProtectedRoute>,
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
