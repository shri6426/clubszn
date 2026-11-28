import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wraps routes that require a logged-in user.
 * If no user session exists, it redirects to /login and remembers
 * the page the user was trying to reach (via location.state).
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // No session at all -> send to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Admin-only routes -> reject non-admins
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to="/my-tickets"
        replace
        state={{ from: location, error: 'Admin access required' }}
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
