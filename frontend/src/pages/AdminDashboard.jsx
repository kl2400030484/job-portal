import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Briefcase, FileText, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-8 text-center">Loading...</div>;

    const cards = [
        { title: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Total Employers', value: stats.totalEmployers, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { title: 'Total Jobs', value: stats.totalJobs, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center border border-gray-100 hover:shadow-lg transition">
                        <div className={`p-4 rounded-full ${card.bg} mb-4`}>
                            <card.icon className={`h-8 w-8 ${card.color}`} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">{card.title}</h2>
                        <p className="text-4xl font-bold text-gray-900">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
