import React from 'react';
import { Navigate } from 'react-router-dom';

const PlaceholderPage = ({ title }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-500">This feature is currently available on your main dashboard or under development.</p>
  </div>
);

export default PlaceholderPage;
