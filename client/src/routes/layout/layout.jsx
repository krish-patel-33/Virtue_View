import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-500">Loading...</div>;

  if (currentUser?.isAdmin && location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[100px] shrink-0">
        <Navbar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-500">Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Check if the user is trying to access seller-only routes
  if (location.pathname === "/add" && currentUser.userType !== "seller") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[100px] shrink-0">
        <Navbar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAdmin() {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-500">Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[100px] shrink-0">
        <Navbar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout, RequireAuth, RequireAdmin };
