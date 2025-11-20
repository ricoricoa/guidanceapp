import React, { useState } from "react";
import { Star, Info, Mail, Rocket } from "lucide-react";
import { NavLink } from "react-router-dom";
import AuthChoiceModal from "./AuthChoiceModal";

export const Navbar = () => {
  const linkClasses =
    "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium";

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-5 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 hidden md:flex">
        {/* Left - Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
          MSU Bongabong
        </h1>

        {/* Center - Navigation Links */}
        <div className="flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/#services"
            className={({ isActive }) =>
              `font-medium transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`
            }
          >
            Services
          </NavLink>
        </div>

        {/* Right - Button */}
        <div className="flex items-center space-x-4">
          <NavLink to="/about" className={linkClasses}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClasses}>
            Contact
          </NavLink>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Mobile Navbar (bottom) */}
      <nav className="w-full flex justify-around items-center px-4 py-3 bg-white dark:bg-gray-900 shadow-t md:hidden fixed bottom-0 left-0 z-50 border-t border-gray-200 dark:border-gray-800">
        <NavLink
          to="/"
          className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <Star className="w-6 h-6 mb-0.5" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <Info className="w-6 h-6 mb-0.5" />
          <span className="text-xs">About</span>
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <Mail className="w-6 h-6 mb-0.5" />
          <span className="text-xs">Contact</span>
        </NavLink>
        <button onClick={() => setModalOpen(true)} className="flex flex-col items-center">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2 shadow-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold mt-0.5">
            Start
          </span>
        </button>
      </nav>

      {/* Auth choice modal */}
      <AuthChoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
