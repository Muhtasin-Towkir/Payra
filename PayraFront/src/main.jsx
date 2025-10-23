import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

// Import BOTH providers here
import { AuthProvider } from './context/authContext.jsx';
import { CartProvider } from './components/Cart/CartLogic.jsx';
import { WishlistProvider } from './context/wishListContext.jsx';
import { ToastProvider } from './components/ToastSystem.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
          <WishlistProvider>
          <App />
          </WishlistProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);