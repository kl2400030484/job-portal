import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SupportDashboard from './pages/SupportDashboard';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardWrapper from './pages/DashboardWrapper';
import PostedJobs from './pages/PostedJobs';
import HiredCandidates from './pages/HiredCandidates';
import PlaceholderPage from './pages/PlaceholderPage';

import AppliedCandidates from './pages/AppliedCandidates';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<div className="p-10 text-center text-red-500 font-bold">Unauthorized Access</div>} />

              {/* Protected Routes with DashboardLayout */}
              <Route element={<ProtectedRoute allowedRoles={['CANDIDATE', 'EMPLOYER', 'ADMIN', 'SUPPORT']}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardWrapper />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Employer specific */}
                <Route path="/posted-jobs" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PostedJobs /></ProtectedRoute>} />
                <Route path="/applied-candidates" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><AppliedCandidates /></ProtectedRoute>} />
                <Route path="/hired-candidates" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><HiredCandidates /></ProtectedRoute>} />
                
                {/* Candidate specific */}
                
                {/* Admin/Support specific */}
                <Route path="/tickets" element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPPORT']}><PlaceholderPage title="Tickets" /></ProtectedRoute>} />
              </Route>
              
              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
