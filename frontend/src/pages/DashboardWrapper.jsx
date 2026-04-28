import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CandidateDashboard from './CandidateDashboard';
import EmployerDashboard from './EmployerDashboard';
import AdminDashboard from './AdminDashboard';
import SupportDashboard from './SupportDashboard';

const DashboardWrapper = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'CANDIDATE':
      return <CandidateDashboard />;
    case 'EMPLOYER':
      return <EmployerDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'SUPPORT':
      return <SupportDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default DashboardWrapper;
