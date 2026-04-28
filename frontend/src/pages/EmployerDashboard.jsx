import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const EmployerDashboard = () => {
    const [myJobs, setMyJobs] = useState([]);
    const [newJob, setNewJob] = useState({ title: '', description: '' });
    const [applications, setApplications] = useState({});
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchMyJobs();
        fetchTickets();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await api.get('/jobs/employer');
            setMyJobs(res.data);
            // Fetch applications for each job
            res.data.forEach(job => fetchApplicationsForJob(job.id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchApplicationsForJob = async (jobId) => {
        try {
            const res = await api.get(`/applications/job/${jobId}`);
            setApplications(prev => ({ ...prev, [jobId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets/my');
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const postJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', newJob);
            setNewJob({ title: '', description: '' });
            fetchMyJobs();
            alert('Job posted successfully');
        } catch (err) {
            console.error(err);
        }
    };

    const raiseTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', newTicket);
            setNewTicket({ title: '', description: '' });
            fetchTickets();
            alert('Ticket raised successfully');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Employer Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Post Job Form */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">Post a New Job</h2>
                        <form onSubmit={postJob}>
                            <input
                                type="text"
                                placeholder="Job Title"
                                className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={newJob.title}
                                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Job Description"
                                className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                                value={newJob.description}
                                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Post Job</button>
                        </form>
                    </div>

                    {/* My Jobs List */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">My Posted Jobs</h2>
                        <div className="space-y-6">
                            {myJobs.map(job => (
                                <div key={job.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 block">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                    <p className="text-gray-700 mb-4">{job.description}</p>
                                    
                                    <div className="bg-gray-50 p-4 rounded border">
                                        <h4 className="font-semibold text-gray-800 mb-2">Applicants</h4>
                                        {applications[job.id]?.length > 0 ? (
                                            <ul className="divide-y divide-gray-200">
                                                {applications[job.id].map(app => (
                                                    <li key={app.id} className="py-2 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">{app.candidateName}</p>
                                                            <p className="text-sm text-gray-500">{app.candidateEmail}</p>
                                                        </div>
                                                        <span className="px-2 py-1 text-xs rounded bg-gray-200 font-semibold">{app.status}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No applications yet.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support Tickets Column */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">Support Tickets</h2>
                    <form onSubmit={raiseTicket} className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-100">
                        <h3 className="font-bold mb-4">Raise a Ticket</h3>
                        <input
                            type="text"
                            placeholder="Brief Title"
                            className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={newTicket.title}
                            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition">Submit</button>
                    </form>

                    <div className="space-y-4">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-white p-4 rounded shadow border border-gray-100">
                                <h4 className="font-bold">{ticket.title}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`px-2 py-1 text-xs rounded font-semibold
                                        ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 
                                          ticket.status === 'CLAIMED' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-green-100 text-green-800'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
