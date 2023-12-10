import React from 'react';
import { useAuth } from 'AuthContext/AuthContext';

const WithOutAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { user } = useAuth();
  

    // If user is not logged in, redirect to login page
    if (user) {
      return window.location.href= "/admin/"
    }

    // If user is logged in, render the wrapped component (e.g., the Subscription component)
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default WithOutAuth;
