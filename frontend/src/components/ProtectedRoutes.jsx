import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoutes({ children }) {
  const { user, token, initializing } = useContext(AuthContext);
  const location = useLocation();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f9fc] pt-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-500" />
      </div>
    );
  }

  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoutes;