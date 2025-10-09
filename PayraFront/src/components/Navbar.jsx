import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import CartIcon from './Cart/CartIcon' 
import { useCart } from './Cart/CartLogic'

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  // Destructure the function to open the cart
  const { openCart } = useCart();

  // Add navigate for redirect
  const navigate = useNavigate();

  // Function to handle clicking the profile icon
  const handleUserClick = () => {
    // Redirects to the unified authentication page (which displays Login first)
    navigate('/user');
  };
  
  // Navigation handlers for the dropdown menu
  const handleProfileClick = (path) => {
    if (path === 'profile' || path === 'orders') {
        // Redirects to the profile/orders page
        navigate(path === 'profile' ? '/user' : '/orders');
    } else if (path === 'logout') {
        // Placeholder for actual logout logic (clearing tokens, etc.)
        console.log("User logged out.");
        navigate('/'); // Redirect to home after logout
    }
  };


  return (
    <div className='flex px-20 rounded-full items-center justify-between py-5 font-medium bg-[#e5f5e7]'>
      <Link to='/'>
        <img 
          src={assets.payra_logo} 
          alt="Payra Logo" 
          style={{ width: "144px", height: "auto" }}
          className='cursor-pointer'
        />
      </Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to='/shop' className='flex flex-col items-center gap-1'>
          <p>SHOP</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to='/request' className='flex flex-col items-center gap-1'>
          <p>REQUEST A PRODUCT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img className='w-5 cursor-pointer' src={assets.search_icon} alt=""/>

        {/* PROFILE ICON AS BUTTON */}
        <div className='group relative'>
          {/* 1. ON CLICK: Redirects to /user (Login Page) */}
          <button onClick={handleUserClick} className='cursor-pointer'>
            <img className='w-5' src={assets.profile_icon} alt="Profile" />
          </button>

          {/* 2. ON HOVER: Shows Dropdown Menu (Added z-20 to ensure it's on top) */}
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
              <p 
                className='cursor-pointer hover:text-black font-medium'
                onClick={() => handleProfileClick('profile')}
              >
                My Profile
              </p>
              <p 
                className='cursor-pointer hover:text-black font-medium'
                onClick={() => handleProfileClick('orders')}
              >
                Orders
              </p>
              <p 
                className='cursor-pointer hover:text-black font-medium'
                onClick={() => handleProfileClick('logout')}
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* CART SECTION */}
        <div 
          className='relative cursor-pointer' 
          onClick={() => { console.log("Calling openCart"); openCart(); }}
        >
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
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='phone menu'/>
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

export default Navbar
