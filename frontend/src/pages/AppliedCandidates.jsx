import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertCircle, RefreshCw, FileText, CheckCircle, XCircle } from 'lucide-react';

const AppliedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hiring, setHiring] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/applications/employer/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load applied candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleHire = async (applicationId) => {
    try {
      setHiring(applicationId);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/applications/${applicationId}/status?status=HIRED`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update UI instantly
      setCandidates(candidates.filter(c => c.id !== applicationId));
      if (selectedCandidate && selectedCandidate.id === applicationId) {
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to hire candidate. Please try again.');
    } finally {
      setHiring(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <RefreshCw className="animate-spin mr-2" size={24} />
        Loading applied candidates...
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Applied Candidates</h2>
        </div>
        <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border">
          Total: {candidates.length}
        </span>
      </div>

      {candidates.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No active applications found for your jobs right now.
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
                  <p className="text-gray-700 text-sm font-medium">Applied for: {candidate.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleHire(candidate.id)}
                  disabled={hiring === candidate.id}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-green-600 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {hiring === candidate.id && <RefreshCw size={14} className="animate-spin mr-2" />}
                  Hire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Candidate Profile</h3>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Full Name</span>
                  <span className="font-semibold text-gray-900">{selectedCandidate.candidateName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Email Address</span>
                  <span className="font-semibold text-gray-900">{selectedCandidate.candidateEmail}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Gender</span>
                  <span className="font-semibold text-gray-900">{selectedCandidate.candidateGender || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Position</span>
                  <span className="font-semibold text-gray-900">{selectedCandidate.candidatePosition || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Years of Experience</span>
                  <span className="font-semibold text-gray-900">{selectedCandidate.candidateYearsOfExperience !== null ? selectedCandidate.candidateYearsOfExperience : 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Applied For</span>
                  <span className="font-semibold text-blue-600">{selectedCandidate.jobTitle}</span>
                </div>
              </div>

              {selectedCandidate.candidateProfileFileUrl && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center text-blue-800">
                    <FileText size={20} className="mr-2" />
                    <span className="font-medium">Resume / Document</span>
                  </div>
                  <a 
                    href={`http://localhost:8080${selectedCandidate.candidateProfileFileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg border shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    View / Download
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleHire(selectedCandidate.id)}
                disabled={hiring === selectedCandidate.id}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center transition-colors"
              >
                {hiring === selectedCandidate.id && <RefreshCw size={14} className="animate-spin mr-2" />}
                Hire Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedCandidates;
