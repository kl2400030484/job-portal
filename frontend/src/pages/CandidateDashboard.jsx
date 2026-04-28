import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchJobs();
        fetchTickets();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
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

    const applyToJob = async (jobId) => {
        try {
            await api.post(`/applications/${jobId}`);
            alert('Successfully applied!');
        } catch (err) {
            alert(err.response?.data || 'Error applying to job');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">Available Jobs</h2>
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition">
                                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                <p className="text-gray-500 mb-2">Posted by: {job.employerName}</p>
                                <p className="text-gray-700 mb-4">{job.description}</p>
                                <button
                                    onClick={() => applyToJob(job.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                        {jobs.length === 0 && <p className="text-gray-500 italic">No jobs available right now.</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">Support Tickets</h2>
                    <form onSubmit={raiseTicket} className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-100">
                        <h3 className="font-bold mb-4">Raise a new Ticket</h3>
                        <input
                            type="text"
                            placeholder="Title"
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
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Raise Ticket</button>
                    </form>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">My Tickets</h3>
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-white p-4 rounded shadow border border-gray-100">
                                <h4 className="font-bold">{ticket.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`px-2 py-1 text-xs rounded font-semibold
                                        ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 
                                          ticket.status === 'CLAIMED' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-green-100 text-green-800'}`}>
                                        {ticket.status}
                                    </span>
                                    {ticket.assignedTo && <span className="text-xs text-gray-500">Assigned: {ticket.assignedTo}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
