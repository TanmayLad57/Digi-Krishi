import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OfficerRouteGuard() {
  const { isAuthenticated, isOfficer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?role=officer&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isOfficer) {
    return <Navigate to="/farmer-dashboard" replace />;
  }

  return <Outlet />;
}
