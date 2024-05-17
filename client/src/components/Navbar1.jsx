import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userSignOut } from "../redux/Users";
import logos from "../images/logo.png";


function Navbar1() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.usersReducer.user);

  const handleLogout = () => {
    dispatch(userSignOut());
  };

  const handleChnagePassword = () => {
    navigate("#");
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
          {/* Left side buttons */}
          <div className="flex items-center space-x-4">
            
            <Link to="/UploadFile">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded">
                Upload
              </button>
            </Link>
            <Link to="/get_docs">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded">
                Get Docs
              </button>
            </Link>
            <Link to="/share_docs">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded">
                Share Docs
              </button>
            </Link>
          </div>

          {user && (
            <div className="text-white font-bold pl-10 pr-10">
              Welcome {user.fullName} !!
            </div>
          )}
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/changepassword">
              <button
                className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded"
                onClick={handleChnagePassword}
              >
                Change Password
              </button>
            </Link>
            <Link to="/">
              <button
                className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="backdrop-blur-md p-2 absolute top-full left-0 right-0 flex flex-col">
          {/* Mobile Menu Buttons */}
          <div className="backdrop-blur-md p-4 flex flex-col items-center">
            {user && (
              <div className="text-white font-bold mb-4">
                Welcome {user.fullName} !!
              </div>
            )}

            <Link to="/UploadFile">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded mb-2 w-[150px]">
                Upload
              </button>
            </Link>

            <Link to="/get_docs">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded mb-2 w-[150px]">
                Get Docs
              </button>
            </Link>

            <Link to="/share_docs">
              <button className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded mb-2 w-[150px]">
                Share Docs
              </button>
            </Link>

            <Link to="/">
              <button
                className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-[#EEEEEE] font-bold px-4 py-2 rounded w-[150px]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar1;
