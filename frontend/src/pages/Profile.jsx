import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Briefcase, FileText } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
        gender: '',
        position: '',
        yearsOfExperience: '',
        profileFileUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile');
            setProfile({
                name: res.data.name || '',
                email: res.data.email || '',
                role: res.data.role || '',
                gender: res.data.gender || '',
                position: res.data.position || '',
                yearsOfExperience: res.data.yearsOfExperience || '',
                profileFileUrl: res.data.profileFileUrl || ''
            });
            setFileUrl(res.data.profileFileUrl || '');
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.put('/profile', {
                name: profile.name,
                gender: profile.gender,
                position: profile.position,
                yearsOfExperience: profile.yearsOfExperience
            });
            setSuccess('Profile updated successfully.');
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const fileInput = document.getElementById('file-upload');
        if (!fileInput.files[0]) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const res = await api.post('/profile/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(res.data.message);
            setFileUrl(res.data.fileUrl);
            setProfile({ ...profile, profileFileUrl: res.data.fileUrl });
        } catch (err) {
            setError(err.response?.data || 'Failed to upload file.');
        }
    };

    if (loading) return <div className="text-center p-10">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            {error && <div className="mb-4 text-red-500 bg-red-50 p-4 rounded-md">{error}</div>}
            {success && <div className="mb-4 text-green-500 bg-green-50 p-4 rounded-md">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Form */}
                <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center border-b pb-2">
                        <User className="mr-2" /> Personal Information
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded border p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    className="mt-1 block w-full bg-gray-100 shadow-sm sm:text-sm border-gray-300 rounded border p-2 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={profile.role}
                                    disabled
                                    className="mt-1 block w-full bg-gray-100 shadow-sm sm:text-sm border-gray-300 rounded border p-2 text-gray-500 uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded border p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mt-8 mb-6 flex items-center border-b pb-2">
                            <Briefcase className="mr-2" /> Professional Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Position / Title</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={profile.position}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded border p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={profile.yearsOfExperience}
                                    onChange={handleChange}
                                    min="0"
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded border p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. 5"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* File Upload Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center border-b pb-2">
                        <FileText className="mr-2" /> Resume / Avatar
                    </h2>
                    
                    {fileUrl ? (
                        <div className="mb-6 p-4 bg-gray-50 border rounded text-center">
                            <p className="text-sm text-gray-600 mb-2">Current File Attached:</p>
                            <a href={`http://localhost:8080${fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium break-all">
                                View Current File
                            </a>
                        </div>
                    ) : (
                        <div className="mb-6 text-sm text-gray-500 text-center p-4 bg-gray-50 border rounded">
                            No file currently uploaded.
                        </div>
                    )}

                    <form onSubmit={handleFileUpload} className="space-y-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload New File</label>
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-2">Allowed: PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            Upload File
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
