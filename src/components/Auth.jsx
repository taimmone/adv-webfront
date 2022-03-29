/** @format */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Auth = ({ authRoles }) => {
  const { auth } = useSelector(state => state);
  const location = useLocation();

  if (!auth.role) return null;

  if (authRoles.includes(auth.role)) {
    return (
      <div data-testid="auth-success-component">
        <Outlet />
      </div>
    );
  } else if (auth.role === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default Auth;
