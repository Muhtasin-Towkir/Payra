import React, { useState } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { User, Mail, Smartphone, Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// A small component for displaying a single profile data field
const InfoField = ({ icon: Icon, label, value }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-gray-400" />
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value || <span className="text-gray-400">Not Provided</span>}
    </dd>
  </div>
);

// This is the main Profile "Sector" component
export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  // This state will be used later when we implement profile editing
  const [isEditing, setIsEditing] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <p>Could not load user data.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        {/* We will wire this up after building the backend route for it */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        // --- EDITING FORM (Placeholder) ---
        // This form is a placeholder. It requires a new backend
        // route (e.g., PUT /api/v1/auth/me) to function.
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
           <h3 className="text-lg font-medium text-gray-700 mb-4">Update Your Details</h3>
           <form className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-600">Username</label>
                <input 
                  type="text" 
                  defaultValue={user.username} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-600">Mobile Phone</label>
                <input 
                  type="text" 
                  defaultValue={user.mobile || ''} 
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
             </div>
             <button 
                type="submit"
                disabled 
                className="bg-gray-400 cursor-not-allowed text-white px-4 py-2 rounded-lg"
              >
                Save Changes (Disabled)
              </button>
           </form>
        </div>

      ) : (
        // --- READ-ONLY DISPLAY ---
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <dl className="divide-y divide-gray-200">
            <InfoField icon={User} label="Username" value={user.username} />
            <InfoField icon={Mail} label="Email Address" value={user.email} />
            <InfoField icon={Smartphone} label="Mobile Phone" value={user.mobile} />
          </dl>
        </div>
      )}

      {/* --- LOGOUT BUTTON --- */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
