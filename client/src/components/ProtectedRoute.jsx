import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element: Component, type }) => {
  const authToken = Cookies.get('authToken');
  const userToken = Cookies.get("userToken")

  if (!authToken && type == "B") {
    return <Navigate to="/adminSignin" />;
  }
  if (!userToken && type == "A") {
    return <Navigate to="/signin" />
  }
  
  return <Component />;
};

export default ProtectedRoute;
