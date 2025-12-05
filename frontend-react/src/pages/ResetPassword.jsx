import React, { useState, useEffect } from 'react';
import { resetPassword } from '../api/Auth';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tokenFromQuery = params.get('token') || '';
  const emailFromState = location.state?.email || '';

  const [token, setToken] = useState(tokenFromQuery);
  const [email, setEmail] = useState(emailFromState);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (!token && !emailFromState) {
      // inform user they need the link or token
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await resetPassword({ token, email, password, password_confirmation: passwordConfirmation });
      alert('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" value={token} onChange={(e)=>setToken(e.target.value)} placeholder="Reset token (from email link)" className="w-full p-3 border rounded mb-3" required />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@minsu.edu.ph" className="w-full p-3 border rounded mb-3" required />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" className="w-full p-3 border rounded mb-3" required />
          <input type="password" value={passwordConfirmation} onChange={(e)=>setPasswordConfirmation(e.target.value)} placeholder="Confirm password" className="w-full p-3 border rounded mb-3" required />
          <button className="w-full bg-green-600 text-white p-3 rounded" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}
