import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import StockNeeds from "./pages/StockNeeds";
import StockOverview from "./pages/StockOverview";
import LeaveRequest from "./pages/LeaveRequest";
import LeaveManagement from "./pages/LeaveManagement";
import AttendanceView from "./pages/AttendanceView";
import AttendanceManagement from "./pages/AttendanceManagement";

import { initializeAppData } from "./services/storageService";

function ProtectedRoute({ children, allowedRole }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    initializeAppData();
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* First page */}
          <Route path="/" element={<Landing />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Common settings page */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRole={getCurrentUserRole()}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stocks"
            element={
              <ProtectedRoute allowedRole="admin">
                <StockOverview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRole="admin">
                <AttendanceManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRole="admin">
                <LeaveManagement />
              </ProtectedRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/stocks"
            element={
              <ProtectedRoute allowedRole="employee">
                <StockNeeds />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute allowedRole="employee">
                <LeaveRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRole="employee">
                <AttendanceView />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

function getCurrentUserRole() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser?.role || "guest";
}

export default App;