import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* 64px is approx height of Navbar, assuming Navbar is at the top of the app */}
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
