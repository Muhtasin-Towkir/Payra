import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartIcon from './Cart/CartIcon';
import { useCart } from './Cart/CartLogic';
import { useAuth } from '../context/authContext'; 
import { Search, X } from 'lucide-react';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { openCart } = useCart();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleSearch = () => {
    setIsSearchActive(prev => !prev);
    if (isSearchActive) {
      setSearchText('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchText = searchText.trim();
    if (trimmedSearchText) {
      navigate(`/search/${trimmedSearchText}`);
      setIsSearchActive(false);
      setSearchText('');
    }
  };

  const handleUserClick = () => {
    if (!user) {
      navigate('/user');
    }
  };

  // --- MODIFICATION: Updated Navigation Coordinates ---
  const handleProfileClick = (path) => {
    if (path === 'profile') {
      // Navigate to the nested profile route
      navigate('/dashboard/profile'); 
    } else if (path === 'orders') {
      // Navigate to the nested orders route
      navigate('/dashboard/my-orders'); 
    } else if (path === 'logout') {
      logout();
      navigate('/'); 
    }
  };
  // --- END OF MODIFICATION ---

  return (
    <div className='flex pr-2 pl-6 rounded-full items-center justify-between py-5 font-medium bg-[#e5f5e7]'>
      <Link to='/'>
        <img
          src={assets.payra_logo}
          alt="Payra Logo"
          style={{ width: "144px", height: "auto" }}
          className='cursor-pointer'
        />
      </Link>

      <ul className='hidden pl-2 sm:flex gap-7 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'><p>HOME</p><hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" /></NavLink>
        <NavLink to='/shop' className='flex flex-col items-center gap-1'><p>SHOP</p><hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" /></NavLink>
        <NavLink to='/request' className='flex flex-col text-center items-center gap-1'><p>REQUEST</p><hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" /></NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'><p>ABOUT</p><hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" /></NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'><p>CONTACT</p><hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" /></NavLink>
      </ul>

      <div className='flex items-center gap-6'>

        <div
          className={`flex items-center bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out
                        ${isSearchActive ? 'w-64' : 'w-auto'}`}
        >
          <button
            onClick={toggleSearch}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors active:scale-95 flex items-center"
            data-testid="search-toggle-button" 
          >
            {isSearchActive ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {isSearchActive && (
            <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center pr-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none px-2 py-1"
              />
              <button
                type="submit"
                className="p-1 rounded-full text-gray-600 hover:bg-gray-200"
                aria-label="Submit Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
        
        <div className='group relative'>
          <button onClick={handleUserClick} className='cursor-pointer'>
            <img className='w-5' src={assets.profile_icon} alt="Profile" />
          </button>
          {user && (
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20'>
              <div className='flex flex-col gap-2 w-max py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
                <p className='font-semibold text-black truncate'>Hello, {user.username}</p>
                <hr className='my-1' />
                {/* --- The onClick handlers now call the updated handleProfileClick --- */}
                <p className='cursor-pointer hover:text-black font-medium' onClick={() => handleProfileClick('profile')}>My Profile</p>
                <p className='cursor-pointer hover:text-black font-medium' onClick={() => handleProfileClick('orders')}>Orders</p>
                
                {user.role === 'admin' && (
                  <>
                    <hr className='my-1' />
                    <p 
                      className='cursor-pointer hover:text-blue-600 font-medium' 
                      onClick={() => navigate('/admin')}
                    >
                      Admin Panel
                    </p>
                  </>
                )}
                
                <hr className='my-1' />
                <p className='cursor-pointer hover:text-red-600 font-medium' onClick={() => handleProfileClick('logout')}>Logout</p>
              </div>
            </div>
          )}
        </div>

        <div className='relative cursor-pointer' onClick={openCart}>
          <CartIcon />
        </div>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt=''
        />
      </div>

      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} z-30`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='phone menu' />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/shop'>SHOP</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/request'>REQUEST PRODUCT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar;

