import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { canAccess } from '../data/permissions.js';

export default function ProtectedRoute({ permission, children }) {
  const { user, loadingSession } = useAuth();

  if (loadingSession) {
    return (
      <main className="loading-page">
        <div className="loading-card">
          <div className="brand-mark">
            <div className="brand-cross">+</div>
            <div className="brand-pulse" />
          </div>

          <p>Carregando sessão...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}