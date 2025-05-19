'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Loader from '@/components/Loader';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validateForm()) return;
        setLoading(true);

        const { name, email, password } = formData;
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
            });

            const data = res.data;
            localStorage.setItem('accessToken', data.tokens.access);
            localStorage.setItem('refreshToken', data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSuccess('Registered successfully. Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-6 py-12">
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl w-full max-w-xl p-10 animate-fade-in transition-all">
                <h2 className="text-4xl font-extrabold text-center text-black mb-2">Create an Account</h2>
                <p className="text-center text-black mb-6 text-sm">Start managing your property investments smartly.</p>

                {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-100 px-4 py-2 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-sm mb-4 bg-green-100 px-4 py-2 rounded-lg border border-green-300">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-black">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-semibold mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                        <span
                            className="absolute top-9 right-4 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                        <small className="text-gray-500 text-xs mt-1 block">At least 8 characters</small>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter your password"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-300 disabled:opacity-50"
                    >
                        {loading ? <Loader /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-black">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );

};

export default Register;
