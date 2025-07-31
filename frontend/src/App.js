import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Import all your components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import ActivityLog from "./pages/Activity_Log";
import Tickets from "./pages/Tickets";
import UserDashboard from "./pages/UserDashboard";
import TicketBooking from "./pages/TicketBooking";

// Role-based route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuthContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 1 ? "/admin_dashboard" : "/user_dashboard"} replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authentication" element={<Authentication />} />
          
          {/* Admin-only routes */}
          <Route path="/admin_dashboard" element={
            <ProtectedRoute requiredRole={1}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/logs" element={
            <ProtectedRoute requiredRole={1}>
              <ActivityLog />
            </ProtectedRoute>
          } />
          
          {/* User-only routes */}
          <Route path="/user_dashboard" element={
            <ProtectedRoute requiredRole={2}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Shared authenticated routes */}
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/venues" element={
            <ProtectedRoute>
              <Venues />
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          } />
          <Route path="/book_tickets" element={
            <ProtectedRoute>
              <TicketBooking />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Root route redirects based on role */}
          <Route path="/" element={
            <ProtectedRoute>
              {user => user.role === 1 ? (
                <Navigate to="/admin_dashboard" replace />
              ) : (
                <Navigate to="/user_dashboard" replace />
              )}
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;