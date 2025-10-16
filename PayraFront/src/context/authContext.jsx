import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check prev token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userProfile = localStorage.getItem('userProfile');

    if (token && userProfile) {
      setUser(JSON.parse(userProfile));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  //from the Navbar
  const logout = () => {
    // Clear user data from state
    setUser(null);
    // Remove session data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    // Redirect to home page
    navigate('/');
  };

  //Provide the state and functions to the rest of the app
  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

//Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};