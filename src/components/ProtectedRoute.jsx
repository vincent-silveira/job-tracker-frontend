// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { authAPI } from "../services/api";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!authAPI.isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireAdmin && !authAPI.isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
