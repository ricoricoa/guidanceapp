import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import CarForm from "./pages/CarForm";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-20 pb-16 md:pt-0 md:pb-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listing" element={<div>Listing Page</div>} />
          <Route path="/car-form" element={<CarForm />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
