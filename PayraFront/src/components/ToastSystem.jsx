import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 1. Create the Context
const ToastContext = createContext(null);

// 2. Create the Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idCounter = React.useRef(0);

  // Function to add a new toast
  const addToast = useCallback((message, type = 'success') => {
    const id = idCounter.current++;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  }, []);

  // Function to remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

// 3. Custom Hook to access the context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// 4. The container that holds all toasts
const ToastContainer = ({ toasts }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      className="toast-container"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// 5. The individual Toast component
const Toast = ({ id, message, type }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    // Start animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      // Start exit animation
      setIsVisible(false);
      // Remove from DOM after animation finishes
      setTimeout(() => removeToast(id), 400); // Must match transition duration
    }, 2000); // 2-second visible duration

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  // Determine background color based on type
  const backgroundColor = type === 'success' ? '#4CAF50' : '#f44336'; // Green for success, Red for error

  return (
    <div
      style={{
        backgroundColor,
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        minWidth: '250px',
        maxWidth: '350px',
      }}
      className="toast-message"
    >
      {message}
    </div>
  );
};
