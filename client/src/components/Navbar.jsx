import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logos from "../images/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    navigate("/Login");
  };

  const handleSignUp = () => {
    navigate("/Register");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <nav className="flex items-center justify-between bg-[#393E46] p-2">
        <div className="flex items-center">
          <Link to="/">
          <div className='flex gap-3 items-center ' >
                      <img src={logos} width="70px" />
                      <p className='text-[#DC1F27] text-[25px] font-semibold ' >Legal-Link Storage</p>
                  </div>
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            className="text-[#EEEEEE] focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <div className="hamburger-icon">
              <span className="block h-0.5 w-8 bg-white mb-2"></span>
              <span className="block h-0.5 w-8 bg-white mb-2"></span>
              <span className="block h-0.5 w-8 bg-white"></span>
            </div>
          </button>
        </div>

        {/* Desktop View Buttons */}
        <div className="hidden lg:flex items-center">
          <button
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] p-2 rounded-md font-bold mr-8"
            onClick={handleSignIn}
          >
            Sign In
          </button>

          <button
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] p-2 rounded-md font-bold mr-4"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="backdrop-blur-md p-2 absolute top-full left-0 right-0 flex flex-col">
          {/* Mobile Menu Buttons */}
          <div className="backdrop-blur-md p-4 flex flex-col items-center">
            <button
              className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE]  px-4 py-2 rounded mb-2 font-bold  w-[150px]"
              onClick={handleSignIn}
            >
              Sign In
            </button>

            <button
              className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE]  px-4 py-2 rounded mb-2 font-bold  w-[150px]"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
