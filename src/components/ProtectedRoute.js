import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, currentUser, ...rest }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return <Component {...rest} currentUser={currentUser} />;
};

export default ProtectedRoute;