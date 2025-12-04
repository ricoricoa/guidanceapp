import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/Auth";
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await register(formData);
      navigate("/login", { state: { message: "Registration successful! Please login." } });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.status === 422) {
        // Validation errors from Laravel
        setErrors(error.response.data.errors || error.response.data);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || error.message || "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900 px-4 relative overflow-hidden">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fly-bird {
          0% { transform: translateX(-100px) translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-30px); opacity: 0; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-fly-bird {
          animation: fly-bird linear infinite;
        }
      `}</style>

      {/* Decorative animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Leaves */}
        <div className="absolute top-10 left-5 text-4xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🍃</div>
        <div className="absolute top-20 left-20 text-3xl opacity-15 animate-float" style={{animationDelay: '2s'}}>🌿</div>
        <div className="absolute top-32 right-10 text-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}>🍂</div>
        <div className="absolute top-16 right-32 text-2xl opacity-15 animate-float" style={{animationDelay: '1s'}}>🍃</div>
        
        {/* Flying Birds */}
        <div className="absolute top-20 left-0 text-2xl" style={{animation: 'fly-bird 8s linear infinite'}}>🕊️</div>
        <div className="absolute top-40 left-0 text-xl" style={{animation: 'fly-bird 10s linear infinite 2s'}}>🦅</div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-100 dark:border-green-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 px-6 py-10">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full mb-3 pulse-glow transform hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-5xl">🌿</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">Create Account</h1>
            <p className="text-green-100 text-center text-sm mt-1 font-semibold">MinSU Bongabong Guidance Office</p>
            <p className="text-green-50 text-center text-xs mt-2 flex items-center justify-center gap-1">
              <span>🕊️</span> Join our student support system <span>🦅</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8" autoComplete="off">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 animate-slide-up">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-200 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                👤 Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-green-200 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400 hover:border-green-300 group-hover:shadow-md"
                  }`}
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">❌ {errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                📧 Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-green-200 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400 hover:border-green-300 group-hover:shadow-md"
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">❌ {errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                🔐 Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-green-200 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400 hover:border-green-300 group-hover:shadow-md"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors transform hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < passwordStrength ? getStrengthColor() : "bg-gray-300 dark:bg-gray-600"}`}></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Strength: <span className={`font-bold ${getStrengthColor().replace('bg-', 'text-')}`}>{getStrengthText()}</span>
                  </p>
                </div>
              )}
              
              {errors.password && <p className="mt-1 text-sm text-red-600">❌ {errors.password[0]}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                🔐 Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-green-500 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-300 ${
                    errors.password_confirmation
                      ? "border-red-500 focus:ring-red-500"
                      : "border-green-200 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400 hover:border-green-300 group-hover:shadow-md"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors transform hover:scale-110"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">❌ {errors.password_confirmation[0]}</p>}
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                👥 I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  formData.role === "student"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                    : "border-green-200 dark:border-green-700 hover:border-green-300 hover:shadow-md"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center">
                    <span className="font-medium text-green-700 dark:text-green-300">👨‍🎓 Student</span>
                  </div>
                </label>

                <label className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  formData.role === "guidance"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
                    : "border-green-200 dark:border-green-700 hover:border-green-300 hover:shadow-md"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="guidance"
                    checked={formData.role === "guidance"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center">
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">💼 Counselor</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-lg hover:scale-105 transform pulse-glow"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  ✨ Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-200 dark:border-green-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 font-semibold">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full py-3 px-4 border-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 font-bold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 text-center block hover:border-green-500 dark:hover:border-green-500 hover:scale-105 transform hover:shadow-md"
            >
              Sign In 🌿
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
