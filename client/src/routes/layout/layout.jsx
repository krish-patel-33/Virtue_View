import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="loading">Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user is trying to access seller-only routes
  if (location.pathname === "/add" && currentUser.userType !== "seller") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout, RequireAuth };
