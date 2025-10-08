import React from 'react'
import { assets } from '../assets/assets'
const Footer = () => {
  return (
    <div className='backdrop-blur-sm px-16'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.payra_logo} className='mb-5 w-32' alt=''/>
                <p className='w-full md:w-2/3 text-gray-400'>
                    Bringing the authentic taste and craft of Bangladesh straight to your doorstep.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>PAYRA</p>
                <ul className='flex flex-col gap-1 text-gray-400'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-400'>
                    <li>8801886520928</li>
                    <li>contact@payra.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ Payra.Inc</p>
            <p className='py-5 text-sm text-center'>All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer