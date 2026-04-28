import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, RefreshCw } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const fetchCaptcha = async () => {
        try {
            const res = await api.get('/auth/captcha');
            setCaptchaId(res.data.captchaId);
            setCaptchaImage(res.data.captchaImage);
            setCaptchaInput('');
        } catch (err) {
            console.error("Failed to load captcha", err);
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaInput) {
            setError('Please enter the CAPTCHA code.');
            return;
        }
        try {
            const res = await api.post('/auth/login', { email, password, captchaId, captchaInput });
            login(res.data);
            
            // Redirect to unified dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check credentials.');
            fetchCaptcha(); // Reload CAPTCHA on failure
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {captchaImage && (
                            <div className="flex items-center gap-3 justify-center bg-gray-100 p-2 rounded border border-gray-300 relative">
                                <img src={captchaImage} alt="CAPTCHA" className="max-h-12 rounded" />
                                <button type="button" onClick={fetchCaptcha} className="text-gray-500 hover:text-blue-600 transition" title="Refresh CAPTCHA">
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter CAPTCHA code"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
