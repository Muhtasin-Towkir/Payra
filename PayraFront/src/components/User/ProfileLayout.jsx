import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx'; // <-- Corrected import path
import { User, ShoppingCart, FileText, Heart, Loader2 } from 'lucide-react';

// This is a helper component to keep the navigation links clean and manageable
const ProfileNavLink = ({ to, label, icon: Icon }) => {
  // This function provides styling for the active link
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <NavLink to={to} className={navLinkClasses}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

// This is the main layout component
const ProfileLayout = () => {
  // --- Security Airlock ---

  const { user, loading: authLoading } = useAuth();

  // If authentication is still loading, show a spinner
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/user" replace />;
  }

  // --- Main Dashboard Layout ---
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- Sidebar Navigation --- */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h2>
            <nav className="flex flex-col space-y-2">
              <ProfileNavLink to="profile" label="My Profile" icon={User} />
              <ProfileNavLink to="my-orders" label="My Orders" icon={ShoppingCart} />
              <ProfileNavLink to="my-requests" label="My Requests" icon={FileText} />
              <ProfileNavLink to="wishlist" label="My Wishlist" icon={Heart} />
            </nav>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 bg-white p-8 rounded-lg shadow-md min-h-[40vh]">

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;

