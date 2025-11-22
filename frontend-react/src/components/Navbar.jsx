import React, { useState } from "react";
import { Star, Info, Mail, Rocket, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";
import AuthChoiceModal from "./AuthChoiceModal";

export const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Floating leaf decorator component
  const FloatingLeaf = ({ delay, position }) => (
    <div
      className="absolute text-green-300 dark:text-green-600 opacity-20 pointer-events-none"
      style={{
        animation: `float 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        [position]: '10px'
      }}
    >
      <Leaf size={24} />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 25px rgba(34, 197, 94, 0.5); }
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 hidden md:flex w-full items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 shadow-lg overflow-hidden">
        {/* Floating leaves background */}
        <FloatingLeaf delay={0} position="left" />
        <FloatingLeaf delay={2} position="right" />

        {/* Left - Logo with branding */}
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full pulse-glow">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">MSU Bongabong</h1>
            <p className="text-green-100 text-xs font-semibold">Guidance Office</p>
          </div>
        </NavLink>

        {/* Center - Navigation Links */}
        <div className="flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-bold transition-all duration-300 ${
                isActive
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-green-100 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/#services"
            className={({ isActive }) =>
              `font-bold transition-all duration-300 ${
                isActive
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-green-100 hover:text-white"
              }`
            }
          >
            Services
          </NavLink>
        </div>

        {/* Right - Button */}
        <div className="flex items-center space-x-4 relative z-10">
          <NavLink to="/about" className="text-green-100 hover:text-white transition-colors font-bold">
            About
          </NavLink>
          <NavLink to="/contact" className="text-green-100 hover:text-white transition-colors font-bold">
            Contact
          </NavLink>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-white text-green-600 dark:text-green-700 px-6 py-2 rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300 font-bold hover:bg-green-50"
          >
            Get Started ✨
          </button>
        </div>
      </nav>

      {/* Mobile Navbar (bottom) */}
      <nav className="w-full flex justify-around items-center px-4 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 shadow-lg md:hidden fixed bottom-0 left-0 z-50 border-t-2 border-green-500">
        <NavLink
          to="/"
          className="flex flex-col items-center text-green-100 hover:text-white transition-all duration-300 font-bold"
        >
          <Star className="w-6 h-6 mb-0.5" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col items-center text-green-100 hover:text-white transition-all duration-300 font-bold"
        >
          <Info className="w-6 h-6 mb-0.5" />
          <span className="text-xs">About</span>
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center text-green-100 hover:text-white transition-all duration-300 font-bold"
        >
          <Mail className="w-6 h-6 mb-0.5" />
          <span className="text-xs">Contact</span>
        </NavLink>
        <button onClick={() => setModalOpen(true)} className="flex flex-col items-center">
          <span className="bg-white text-green-600 dark:text-green-700 rounded-full p-2.5 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300">
            <Rocket className="w-5 h-5" />
          </span>
          <span className="text-xs text-white font-bold mt-0.5">
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
