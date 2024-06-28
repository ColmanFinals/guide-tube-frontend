import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./components/pages/ErrorPage";
import {SignupRoute} from "./routes/SignupRoute";
import {LoginRoute} from "./routes/LoginRoute";
import {DashboardRoute} from "./routes/DashboardRoute";
import {VideoRoute} from './routes/VideoRoute';
import LandingPage from './components/pages/LandingPage';
import AnalyticsPage from './components/pages/AnalyticsPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <LandingPage /> },
            { path: 'dashboard', element: <DashboardRoute /> },
            { path: 'login', element: <LoginRoute /> },
            { path: 'signup', element: <SignupRoute /> },
            { path: 'video', element: <VideoRoute /> },
            { path: 'analytics', element: <AnalyticsPage /> },  // New route for AnalyticsPage
            { path: 'error', element: <ErrorPage /> },
            { path: '*', element: <Navigate to='/error' /> },  // Redirect to error page instead of login for better UX
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
