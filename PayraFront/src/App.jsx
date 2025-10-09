import Navbar from './components/Navbar'
import Footer from '../src/components/footer'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Shop from './pages/shop'
import About from './pages/about'
import Contact from './pages/contact'
import Product from './pages/product'
import User from './pages/user'
import PlaceOrder from './pages/placeOrder'
import Orders from './pages/orders'
import Request from './pages/request'
import { assets } from './assets/assets'
import CartContainer from './pages/cart'

const App = () => {
  return (
    <div
      className='relative bg-cover bg-center min-h-screen'
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Background Overlay */}
      <div className='absolute inset-0 bg-white opacity-10'></div>

      {/* Main Content Wrapper */}
      <div className='relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/user' element={<User />} />
          <Route path='/placeOrder' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/request' element={<Request />} />
        </Routes>
        <CartContainer/>
        <Footer/>
      </div>
    </div>
  )
}

export default App