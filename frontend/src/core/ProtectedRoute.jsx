// import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = () => {
        if(typeof window == 'undefined')
            return false;
        if(localStorage.getItem('token'))
            return JSON.parse(localStorage.getItem('token'));
        else
            return false;
    }
    
    return isAuthenticated() ? <Outlet/> : <Navigate to = '/' replace />
};

export default ProtectedRoute;