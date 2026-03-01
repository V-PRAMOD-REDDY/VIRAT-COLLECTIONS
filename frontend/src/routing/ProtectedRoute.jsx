import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext);
    
    // If user is not authenticated, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;