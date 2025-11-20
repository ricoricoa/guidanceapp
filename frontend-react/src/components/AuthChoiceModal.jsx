import React from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const AuthChoiceModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const goLogin = () => {
    onClose();
    navigate("/login");
  };

  const goRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Modal open={open} onClose={onClose} title="Welcome">
      <p className="text-gray-600 dark:text-gray-300 mb-4">Choose how you'd like to continue:</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={goLogin}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-95 transition"
        >
          Login
        </button>
        <button
          onClick={goRegister}
          className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Register
        </button>
      </div>
    </Modal>
  );
};

export default AuthChoiceModal;
