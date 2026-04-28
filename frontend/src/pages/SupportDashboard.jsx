import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SupportDashboard = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClaim = async (id) => {
        try {
            await api.put(`/tickets/${id}/claim`);
            fetchTickets();
        } catch (err) {
            alert(err.response?.data || 'Failed to claim');
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/tickets/${id}/resolve`);
            fetchTickets();
        } catch (err) {
            alert(err.response?.data || 'Failed to resolve');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Dashboard</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{ticket.id}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.raisedBy}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 
                                          ticket.status === 'CLAIMED' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-green-100 text-green-800'}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assignedTo || 'Unassigned'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {ticket.status === 'OPEN' && (
                                        <button onClick={() => handleClaim(ticket.id)} className="text-blue-600 hover:text-blue-900 mr-3">Claim</button>
                                    )}
                                    {ticket.status === 'CLAIMED' && (
                                        <button onClick={() => handleResolve(ticket.id)} className="text-green-600 hover:text-green-900">Resolve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && <div className="p-6 text-center text-gray-500">No support tickets found.</div>}
            </div>
        </div>
    );
};

export default SupportDashboard;
