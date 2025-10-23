import React from 'react';
import { useAuth } from '../../context/authContext'; 
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';



const AdminRoute = () => {
  // Assuming your useAuth hook provides the user and a loading state
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    // Wait until the user's auth status is confirmed
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is finished, check the user's role
  if (!user || user.role !== 'admin') {
    // User is not an admin or not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
