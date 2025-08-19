import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, USER_ROLES } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';
import AdminPortal from './components/portals/AdminPortal';
import BoardPortal from './components/portals/BoardPortal';
import MemberPortal from './components/portals/MemberPortal';

const PortalRouter = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/portal" replace />;
  }

  // Route users to appropriate portal based on role
  switch (user?.role) {
    case USER_ROLES.ADMIN:
      return <AdminPortal />;
    case USER_ROLES.BOARD:
      return <BoardPortal />;
    case USER_ROLES.MEMBER:
      return <MemberPortal />;
    default:
      return <Navigate to="/portal" replace />;
  }
};

const MapPlaceholder = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Community Map</h2>
      <p className="text-blue-200 mb-6">Interactive community map coming soon...</p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back to Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/map" element={<MapPlaceholder />} />
            
            {/* Portal Authentication Route */}
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute>
                  <PortalRouter />
                </ProtectedRoute>
              } 
            />
            
            {/* Role-specific Portal Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/board" 
              element={
                <ProtectedRoute requiredRole={USER_ROLES.BOARD}>
                  <BoardPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member" 
              element={
                <ProtectedRoute requiredRole={USER_ROLES.MEMBER}>
                  <MemberPortal />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;