import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminPage from "./pages/AdminPage";
import DemoInstructions from "./pages/DemoInstructions";

function App() {
  return (
    <Router>
<Routes>
  {/* ===== Public Pages ===== */}
  <Route path="/" element={<HomePage />} />
  <Route path="/instructions" element={<DemoInstructions />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/admin" element={<AdminLogin />} />

  {/* ===== Protected User Dashboard ===== */}
  <Route
    path="/user-dashboard"
    element={
      <ProtectedUserRoute>
        <UserDashboard />
      </ProtectedUserRoute>
    }
  />

  {/* ===== Protected Admin Dashboard ===== */}
  <Route
    path="/admin-dashboard"
    element={
      <ProtectedAdminRoute>
        <AdminPage />
      </ProtectedAdminRoute>
    }
  />

  {/* ===== Fallback ===== */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
    </Router>
  );
}

// Protected route component for users
function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.log('No user token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Protected route component for admin
function ProtectedAdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  
  if (!adminToken) {
    console.log('No admin token found, redirecting to admin login');
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

export default App;