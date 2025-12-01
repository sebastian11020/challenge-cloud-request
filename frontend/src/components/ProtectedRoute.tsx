import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
