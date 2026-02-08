import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HRDataProvider } from './contexts/HRDataContext';
import { Toaster } from './components/ui/sonner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeAttendance } from './pages/employee/EmployeeAttendance';
import { EmployeeLeave } from './pages/employee/EmployeeLeave';
import { EmployeePayroll } from './pages/employee/EmployeePayroll';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminLeaveRequests } from './pages/admin/AdminLeaveRequests';
import { AdminPayroll } from './pages/admin/AdminPayroll';
import { AdminReports } from './pages/admin/AdminReports';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'employee' | 'admin' | 'hr' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin' && user?.role !== 'hr') {
    // Admins and HR can access all routes
    if (requiredRole === 'employee' && (user?.role === 'admin' || user?.role === 'hr')) {
      return <>{children}</>;
    }
    return <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to={user?.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} /> : <SignupPage />} />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeePayroll />
          </ProtectedRoute>
        }
      />

      {/* Admin/HR Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <AdminEmployees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <AdminAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leave-requests"
        element={
          <ProtectedRoute>
            <AdminLeaveRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute>
            <AdminPayroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <HRDataProvider>
          <AppRoutes />
          <Toaster />
        </HRDataProvider>
      </AuthProvider>
    </Router>
  );
}