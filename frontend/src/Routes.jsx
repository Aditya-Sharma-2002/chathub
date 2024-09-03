//import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from './user/Login.jsx';
import Signup from './user/Signup.jsx';
import Forgot from './user/Forgot.jsx';
import './App.css'

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
    }
])

export default router;