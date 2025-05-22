'use client';

import React, { useEffect, useState } from 'react';
import {
  Save, User, Sun, Moon, CreditCard,
  Bell, Lock, CheckCircle, AlertCircle
} from 'lucide-react';
import { updateUserProfile } from '@/services/api';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser) {
      setName(storedUser.name || '');
      setEmail(storedUser.email || '');
      setAddress(storedUser.address || '');
    }
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile({ name, email, address });
      showNotification('success', 'Profile updated successfully');
      localStorage.setItem('user', JSON.stringify(updated.user));
    } catch (err) {
      console.error('Update failed:', err);
      showNotification('error', 'Something went wrong while updating profile');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>

        {notification.show && (
          <div className={`mt-4 p-4 rounded-lg flex items-center ${notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {notification.type === 'success'
              ? <CheckCircle className="h-5 w-5 mr-2" />
              : <AlertCircle className="h-5 w-5 mr-2" />}
            {notification.message}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <nav className="px-4 py-5">
                <ul className="space-y-2">
                  <li><a href="#account" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900 dark:bg-opacity-20 rounded-md"><User className="h-5 w-5 mr-3" /> Account</a></li>
                  <li><a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"><Sun className="h-5 w-5 mr-3" /> Appearance</a></li>
                  <li><a href="#billing" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"><CreditCard className="h-5 w-5 mr-3" /> Billing</a></li>
                  <li><a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"><Bell className="h-5 w-5 mr-3" /> Notifications</a></li>
                  <li><a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"><Lock className="h-5 w-5 mr-3" /> Security</a></li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Account */}
            <section id="account" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Account Information</h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" value={email} disabled className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md"><Save className="h-5 w-5 mr-2" /> Save Changes</button>
                </div>
              </form>
            </section>

            {/* Appearance */}
            <section id="appearance" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Appearance</h2>
              <div className="mt-6 space-y-4">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</legend>
                  <div className="mt-4 space-y-2">
                    {['Auto', 'Light', 'Dark'].map(option => (
                      <div key={option} className="flex items-center">
                        <input id={`theme-${option.toLowerCase()}`} name="theme" type="radio" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700" />
                        <label htmlFor={`theme-${option.toLowerCase()}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{option}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div className="flex justify-end">
                  <button type="button" className="inline-flex justify-center py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Save</button>
                </div>
              </div>
            </section>

            {/* Billing */}
            <section id="billing" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Billing</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">No active subscription plan found.</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Choose Plan</button>
            </section>

            {/* Notifications */}
            <section id="notifications" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Notifications</h2>
              <div className="mt-4 space-y-4">
                {['Email notifications', 'Mobile notifications', 'Property alerts'].map((label, i) => (
                  <div key={i} className="flex items-center">
                    <input type="checkbox" id={`notify-${i}`} className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded" />
                    <label htmlFor={`notify-${i}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">{label}</label>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section id="security" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Security</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                  <input type="password" id="current-password" className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <input type="password" id="new-password" className="mt-1 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2" />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">Update Password</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
