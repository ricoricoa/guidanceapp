import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const response = await register(formData);
      setMessage(response.data.message);
      navigate("/login");   
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Register</h1>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded w-full px-3 py-2 mb-3 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          required
          aria-label="Name"
        />

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`border rounded w-full px-3 py-2 mb-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="you@example.com"
          aria-label="Email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 text-left">{errors.email[0]}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={`border rounded w-full px-3 py-2 mb-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="Create a password (min 8 chars)"
          aria-label="Password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 text-left">{errors.password[0]}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3 mb-1">Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Re-type your password"
          value={formData.password_confirmation}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-700 rounded w-full px-3 py-2 mb-4 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          required
          aria-label="Confirm password"
        />

        <div className="mt-2 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">I am a</p>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Student</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="guidance"
                checked={formData.role === 'guidance'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">Guidance / Counselor</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-95 font-semibold"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
};
