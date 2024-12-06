//import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './user/Login.jsx';
import Signup from './user/Signup.jsx';
import Forgot from './user/Forgot.jsx';
import Home from './user/Home.jsx';
import Profile from './user/Profile.jsx';
import './App.css'
import ProtectedRoute from './core/ProtectedRoute.jsx';

const router = createBrowserRouter([
    {
        path:'/',
        element:<Login />,
    },
    {
        path:'/signup',
        element:<Signup />
    },
    {
        path:'/forgot',
        element:<Forgot />
    },
    {
        path:'/home',
        element:<ProtectedRoute />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'profile',
                element: <Profile />
            },
        ],
    }
])

export default router;