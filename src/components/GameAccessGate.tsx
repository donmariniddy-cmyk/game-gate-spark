import { Navigate, useLocation } from "react-router-dom";
import { useGameAccess } from "@/hooks/useGameAccess";

/**
 * Wrap any game route with this component to enforce:
 *  - Must be logged in (else → /auth)
 *  - Must have admin-granted access (else → /pricing)
 */
const GameAccessGate = ({ children }: { children: React.ReactNode }) => {
  const { hasAccess, loading, user } = useGameAccess();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/pricing" state={{ locked: true }} replace />;
  }

  return <>{children}</>;
};

export default GameAccessGate;
