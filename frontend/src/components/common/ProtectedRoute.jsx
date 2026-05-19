// Route guard for authenticated or role-restricted views.
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";

// Route guard that blocks unauthenticated or unauthorized users.
const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireStockManager = false,
}) => {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (
    requireStockManager &&
    !["stock", "stock-manager", "admin"].includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
