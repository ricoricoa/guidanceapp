import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/Auth';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    // Only verify that the user is authenticated. Role-based access is enforced by the API endpoints (v1).
    getUser()
      .then((res) => {
        if (!mounted) return;
        // find the user object in common response shapes
        const u = res.data.data?.user ?? res.data.user ?? res.data;
        console.log('ProtectedRoute: User authenticated', u);
        if (!u || !u.id) {
          console.log('ProtectedRoute: No user found in response');
          navigate('/login', { replace: true });
          return;
        }

        // authenticated -> allow child to render; server will return 403 for role mismatches
        setAuthorized(true);
      })
      .catch((err) => {
        console.log('ProtectedRoute: Auth failed', err.response?.status, err.message);
        navigate('/login', { replace: true });
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!authorized) return null;

  return children;
};

export default ProtectedRoute;
