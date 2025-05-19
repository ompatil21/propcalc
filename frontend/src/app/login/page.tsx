'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Loader from '@/components/Loader';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            const data = response.data;

            localStorage.setItem('accessToken', data.tokens.access);
            localStorage.setItem('refreshToken', data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify({
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
            }));

            console.log("✅ User stored:", JSON.parse(localStorage.getItem('user')!));

            if (data.user.role === 'property_manager') {
                router.push('/property-manager');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err?.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-6 py-12">
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl w-full max-w-xl p-10 animate-fade-in transition-all">
                <h2 className="text-4xl font-extrabold text-center text-black mb-2">Welcome Back 👋</h2>
                <p className="text-center text-black mb-6 text-sm">Sign in to your account</p>

                {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-100 px-4 py-2 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-300 disabled:opacity-50"
                    >
                        {loading ? <Loader /> : 'Sign In'}
                    </button>
                </form>

                {/* OR and Register section */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">or</p>
                    <Link
                        href="/register"
                        className="mt-2 inline-block text-indigo-600 font-medium hover:underline text-sm"
                    >
                        Create New Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
