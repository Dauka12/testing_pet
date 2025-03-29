import React, { createContext, ReactNode, useContext } from 'react';
import { Provider, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { olympiadStore, RootState } from '../store/index.ts';

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

interface OlympiadAuthProviderProps {
  children: ReactNode;
}

export const OlympiadAuthProvider: React.FC<OlympiadAuthProviderProps> = ({ children }) => {
  return (
    <Provider store={olympiadStore}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Provider>
  );
};

const AuthProviderInner: React.FC<OlympiadAuthProviderProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const value = {
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Protected route wrapper
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/olympiad/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public route - redirects to dashboard if already authenticated
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/olympiad/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};