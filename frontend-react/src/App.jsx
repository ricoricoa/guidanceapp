import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/dashboard-animations.css";
import CarForm from "./pages/CarForm";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cars from "./pages/CarListing";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./api/axios";
import { initializeAuth } from "./api/Auth";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  useEffect(() => {
    // Initialize auth from stored token
    initializeAuth();
    api.get('/sanctum/csrf-cookie').catch(() => {});
    
    // Ensure body gets dark class if needed
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.body.classList.add('dark');
    }
  }, []);
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-20 pb-16 md:pt-0 md:pb-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/car-form" element={<CarForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/counselor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guidance", "counselor"]}>
                <CounselorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/guidance/dashboard" element={<Navigate to="/counselor/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </ThemeProvider>
  );
};

export default App;
