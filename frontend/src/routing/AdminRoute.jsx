import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

// Admin Route Component for admin users only
const AdminRoute = ({ children }) => {
    const { token } = useContext(ShopContext);
    
    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // You can add more admin-specific checks here
    // For example, decode the token to check if user is admin
    // const isAdmin = checkIfAdmin(token);
    // if (!isAdmin) {
    //     return <Navigate to="/" replace />;
    // }
    
    // If authenticated and admin, render the protected component
    return children;
};

export default AdminRoute;
