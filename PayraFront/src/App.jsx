import React from 'react'; 
import Navbar from './components/Navbar';
import Footer from '../src/components/footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home'; 
import Shop from './pages/shop';
import About from './pages/about';
import Contact from './pages/contact';
import Product from './pages/product';
import User from './pages/user'; 
import PlaceOrder from './pages/placeOrder';
import Request from './pages/request';
import { assets } from './assets/assets';
import CartContainer from './pages/cart';
import SearchResults from './components/Search';
import { ToastProvider } from './components/ToastSystem';
import AdminDashboard from './pages/admin';
import AdminRoute from './components/Admin/adminRoutes';
import ProfileLayout from './components/User/ProfileLayout';
import Profile from './components/User/profile';
import MyOrders from './components/User/Order';
import MyRequests from './components/User/Requests';
import Wishlist from './components/User/Wishlist';
import { WishlistProvider } from './context/wishListContext';

const App = () => {
  return (
    <ToastProvider> 
      <div
        className='relative bg-cover bg-center min-h-screen'
        style={{ backgroundImage: `url(${assets.background})` }}
      >
        <div className='absolute inset-0 bg-white opacity-10'></div>
        <div className='relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <Navbar />
          <Routes>
            {/* --- Public Routes --- */}
            <Route path='/' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/request' element={<Request />} /> 
            <Route path='/search/:keyword' element={<SearchResults />} />
            <Route path='/placeOrder' element={<PlaceOrder />} /> 

            <Route path='/user' element={<User />} /> {/* The "Airlock" */}

            {/* --- USER DASHBOARD ROUTES --- */}
            {/* This is the "Hub" or parent route */}
            <Route path="/dashboard" element={<ProfileLayout />}>
              {/* These are the "Sectors" that render inside the Hub */}
              <Route path="profile" element={<Profile />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="my-requests" element={<MyRequests />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route index element={<Profile />} />
            </Route>
            {/* --- Admin Protected Route --- */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <CartContainer />
          <Footer />
        </div>
      </div>
    </ToastProvider>
  )
}

export default App;



