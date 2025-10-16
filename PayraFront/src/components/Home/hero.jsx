import React, { useState } from 'react' 
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react'; 

const Hero = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate(); //Initialize the navigate function

    const toggleSearch = () => {
        setIsSearchActive(prev => !prev);
        if (isSearchActive) {
            setSearchText(''); 
        }
    };

    //Calibrate the search submission handler
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedSearchText = searchText.trim();
        if (trimmedSearchText) {
            // Redirect to Search page
            navigate(`/search/${trimmedSearchText}`);
            
            // Reset the search bar after submission
            setIsSearchActive(false); 
            setSearchText('');
        }
    };

  return (
    <div
      className='relative flex flex-col sm:flex-row rounded-3xl pt-10'
    >
        {/* Left Image */}
        <div className='flex items-center justify-start z-10'>
            <img className='h-100 object-contain' src={assets.hero2} alt='Hero Left' />
        </div>

        {/* Center Text */}
        <div className='flex flex-col items-center justify-center py-10 sm:py-0 z-10 flex-grow'>
            <div className='text-[#414141] flex flex-col items-center justify-center'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className='hind-siliguri-medium font-medium text-sm md:text-2xl text-[#024805]'> পায়রায় আপনাকে স্বাগতম </p>                
                </div>
                <h1 className='hind-siliguri-bold text-5xl sm:py-3 lg:text-5xl leading-relaxed'>ঘরে বসে দেশি পণ্য</h1>

                {/* Container for the Request Button */}
                <div className='flex items-center gap-2'>
                    <Link to="/request">
                        <button className='group font-semibold text-sm md:text-base text-[#024805] hover:text-white transition-colors active:scale-95 bg-[#FFD414] py-2 px-4 rounded-full'>
                        REQUEST PRODUCT
                        </button>
                    </Link>
                    <div className='w-8 md:w-11 h-[2px] bg-white group-hover:bg-[#024805] transition-colors'>
                    </div>
                </div>

                {/* DYNAMIC SEARCH BUTTON/BAR CONTAINER */}
                <div 
                    className={`mt-4 flex items-center bg-[#FFD414] rounded-full shadow-md transition-all duration-300 ease-in-out 
                                ${isSearchActive ? 'w-full max-w-md' : 'w-auto'}`}
                >
                    <button 
                        onClick={toggleSearch} 
                        className={`font-semibold text-sm md:text-base text-[#024805] transition-colors active:scale-95 py-2 px-4 rounded-full flex items-center 
                                ${isSearchActive ? 'bg-yellow-400' : 'hover:bg-yellow-400'}`}
                    >
                        {isSearchActive ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 mr-2" />}
                        {!isSearchActive && "SEARCH"}
                    </button>

                    {isSearchActive && (
                        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search for products..."
                                className="flex-grow bg-transparent text-[#024805] placeholder-gray-600 focus:outline-none px-3 py-1.5"
                            />
                            <button 
                                type="submit" 
                                className="p-2 mr-2 rounded-full text-[#024805] hover:bg-yellow-500/50"
                                aria-label="Submit Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>

        {/* Right Image */}
        <div className='flex items-center justify-end z-10'>
            <img className='h-100 object-contain' src={assets.hero} alt='Hero Right' />
        </div>
    </div>
  );
};

export default Hero;
