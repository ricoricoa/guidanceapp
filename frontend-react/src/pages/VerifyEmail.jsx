import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../api/Auth';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await verifyEmail(email, code);
      // token stored by API helper if present
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await resendVerification(email);
      alert('Verification code resent to ' + email);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Verify your email</h2>
        <p className="text-sm mb-4">A 6-digit verification code was sent to <strong>{email}</strong>. Enter it below.</p>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={handleVerify}>
          <input type="hidden" name="email" value={email} />
          <div className="mb-3">
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full p-3 border rounded" placeholder="Enter verification code" required />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={handleResend}>Resend Code</button>
          </div>
        </form>
      </div>
    </div>
  );
}
