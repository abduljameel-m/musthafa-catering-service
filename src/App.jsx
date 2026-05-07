import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeManagement from "./pages/EmployeeManagement";

import NotificationManagement from "./pages/NotificationManagement";
import Notifications from "./pages/Notifications";

import StockNeeds from "./pages/StockNeeds";
import StockOverview from "./pages/StockOverview";
import LeaveRequest from "./pages/LeaveRequest";
import LeaveManagement from "./pages/LeaveManagement";
import AttendanceView from "./pages/AttendanceView";
import AttendanceManagement from "./pages/AttendanceManagement";

import { initializeAppData } from "./services/storageService";

function getCurrentUser() {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

function ProtectedRoute({ children, allowedRole }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.status !== "active") {
    localStorage.removeItem("currentUser");
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function CommonProtectedRoute({ children }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.status !== "active") {
    localStorage.removeItem("currentUser");
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
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/settings"
            element={
              <CommonProtectedRoute>
                <Settings />
              </CommonProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <CommonProtectedRoute>
                <Notifications />
              </CommonProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRole="admin">
                <EmployeeManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRole="admin">
                <NotificationManagement />
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

export default App;