import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoutes({ children }) {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f9fc] pt-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;
