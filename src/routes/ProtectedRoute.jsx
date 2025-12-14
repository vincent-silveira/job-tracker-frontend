import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  // Check router state OR localStorage
  const userFromState = location.state;
  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  if (!userFromState && !userFromStorage) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
