'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'tenant',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
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

        const { name, email, password, role } = formData;
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role,
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 px-4">
            <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    {formData.role === 'admin' ? 'Admin Registration' : 'Create Account'}
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    {formData.role === 'admin'
                        ? 'Register a new PropCalc admin'
                        : 'Sign up as a tenant'}
                </p>

                {error && (
                    <div className="text-red-500 text-sm mb-4 bg-red-100 px-2 py-1 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-sm mb-4 bg-green-100 px-2 py-1 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {formData.role !== 'admin' && (
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            title="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            title="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <label className="flex items-center mt-1 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>
                        <small className="text-muted text-xs">
                            Must be at least 8 characters
                        </small>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            title="Confirm your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="role-select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="tenant">Tenant</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-60"
                    >
                        {loading ? <Loader /> : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-700 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
