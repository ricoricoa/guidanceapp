import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getUser } from "../api/Auth";
import { Mail, Lock, Eye, EyeOff, Loader, Leaf } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData.email, formData.password);
      
      // Extract role from the response
      const role = response.data.data?.user?.role;
      
      if (role) {
        if (role === "guidance" || role === "counselor") {
          navigate("/counselor/dashboard");
        } else if (role === "student") {
          navigate("/student/dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/cars");
        }
      } else {
        setError("Unable to determine user role. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.error || error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Floating decorative elements
  const FloatingLeaf = ({ delay, left, size }) => (
    <div
      className="absolute animate-float text-green-300 dark:text-green-600 opacity-30"
      style={{
        animationDelay: `${delay}s`,
        left: `${left}%`,
        top: "-10px"
      }}
    >
      <Leaf size={size} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(20px) translateY(-10px); }
          50% { transform: translateX(0px) translateY(-20px); }
          75% { transform: translateX(-20px) translateY(-10px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>

      {/* Decorative floating leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingLeaf delay={0} left={5} size={32} />
        <FloatingLeaf delay={2} left={15} size={28} />
        <FloatingLeaf delay={4} left={85} size={30} />
        <FloatingLeaf delay={1} left={90} size={26} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-100 dark:border-green-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 px-6 py-10">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full mb-3 pulse-glow">
                <span className="text-3xl">🌿</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">MSU Bongabong</h1>
            <p className="text-green-100 text-center text-sm mt-1 font-semibold">Guidance & Counseling</p>
            <p className="text-green-50 text-center text-xs mt-2">Student Portal Login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-6 py-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg animate-slide-up">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-green-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                🔐 Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-green-200 dark:border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-green-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-green-300 accent-green-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-green-600 hover:text-green-700 dark:hover:text-green-400 font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center pulse-glow transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "🌱 Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-200 dark:border-green-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Don't have an account yet?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full py-3 px-4 border-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-bold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 text-center block transform hover:scale-105"
            >
              ✨ Create Account
            </Link>
          </form>

          {/* Footer */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300 border-t border-green-200 dark:border-green-700">
            <p className="font-semibold">MSU Bongabong Guidance Office 💚</p>
            <p className="text-xs mt-1">Student Portal - Secure Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
