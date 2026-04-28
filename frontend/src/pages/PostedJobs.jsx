import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, AlertCircle, RefreshCw } from 'lucide-react';

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/jobs/employer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load posted jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      setUpdating(jobId);
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
      
      await axios.put(`http://localhost:8080/api/jobs/${jobId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state instantly
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to update job status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <RefreshCw className="animate-spin mr-2" size={24} />
        Loading your jobs...
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
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Briefcase size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Posted Jobs</h2>
        </div>
        <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border">
          Total: {jobs.length}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You haven't posted any jobs yet. Check your dashboard to create one.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleJobStatus(job.id, job.status)}
                  disabled={updating === job.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex items-center ${
                    job.status === 'OPEN' 
                      ? 'border-gray-200 text-gray-700 hover:bg-gray-100' 
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  } disabled:opacity-50`}
                >
                  {updating === job.id && <RefreshCw size={14} className="animate-spin mr-2" />}
                  {job.status === 'OPEN' ? 'Close Job' : 'Reopen Job'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
