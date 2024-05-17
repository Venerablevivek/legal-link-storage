import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserInfo } from "../redux/Users";
import logos from "../images/logo.png";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aadharNumber, setAadharNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        Aadhar: aadharNumber,
        Password: password,
      });

      if (response.data.success) {
        alert("Login Successful");
        dispatch(setUserInfo(response.data.user));
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1E1E1E]">
      <div className="w-3/4 m-auto rounded-lg bg-[#393E46] drop-shadow-md">
      <h2 className="flex flex-col md:flex-row justify-center p-6 text-[#00ADB5] font-bold text-2xl">
          <div className="md:mr-4 mb-2 md:mb-0 ">
          <div className='flex gap-3 items-center ' >
                            <img src={logos} width="50px" />
                            <p className='text-[#DC1F27] text-[25px] font-semibold ' >Legal-Link Storage</p>
          </div>
          </div>
        </h2>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid md:grid-cols-2 md:gap-16">
            <div className="mb-4">
              <input
                className="border-2 border-black w-full p-2 placeholder-black"
                type="text"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                required
                placeholder="AADHAR NUMBER"
              />
            </div>
            <div className="mb-4">
              <input
                className="border-2 border-black w-full p-2 placeholder-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="PASSWORD"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-red-500 hover:bg-red-600 duration-200 transition-all text-[#FFFFFF] font-bold text-xl rounded-b-lg"
          >
            Login
          </button>
        </form>
      </div>
      <p className="text-center text-[#FFFFFF] font-bold mb-2">
        Forgot password?
      </p>
    </div>
  );
}

export default Login;
