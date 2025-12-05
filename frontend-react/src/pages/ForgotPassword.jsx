import React, { useState } from 'react';
import { sendPasswordReset } from '../api/Auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      await sendPasswordReset(email);
      setMessage('If the email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {message && <div className="mb-3 text-green-600">{message}</div>}
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@minsu.edu.ph" required className="w-full p-3 border rounded mb-3" />
          <button className="w-full bg-green-600 text-white p-3 rounded" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
      </div>
    </div>
  );
}
