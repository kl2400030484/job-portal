import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

const HiredCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHiredCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/applications/hired', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load hired candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiredCandidates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <RefreshCw className="animate-spin mr-2" size={24} />
        Loading hired candidates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center">
        <AlertCircle className="mr-2" size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Hired Candidates</h2>
        </div>
        <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border">
          Total: {candidates.length}
        </span>
      </div>

      {candidates.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You haven't hired any candidates yet. Review applications to hire candidates.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {candidate.candidateName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{candidate.candidateName}</h3>
                  <p className="text-gray-500 text-sm mb-1">{candidate.candidateEmail}</p>
                  <p className="text-gray-700 text-sm font-medium">Hired for: {candidate.jobTitle}</p>
                </div>
              </div>
              <div>
                <span className="flex items-center text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle size={16} className="mr-1.5" />
                  Hired
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HiredCandidates;
