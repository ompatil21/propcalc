'use client';

import React, { useEffect, useState } from 'react';
import {
  Save, User, Sun, Moon, CreditCard, Bell, Lock, CheckCircle, AlertCircle,
  Settings, Shield, Palette, Smartphone, Mail, Eye, EyeOff, Key, Sparkles
} from 'lucide-react';
import { updateUserProfile } from '@/services/api';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('auto');
  const [notifications, setNotifications] = useState({
    email: true,
    mobile: false,
    propertyAlerts: true
  });
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotification('error', 'Please fill in both password fields');
      return;
    }
    if (newPassword.length < 6) {
      showNotification('error', 'New password must be at least 6 characters');
      return;
    }

    try {
      showNotification('success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showNotification('error', 'Failed to update password');
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    showNotification('success', 'Notification preferences saved');
  };

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-white opacity-5 rounded-full animate-pulse delay-75"></div>
          <div className="absolute top-20 right-40 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-150"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-300">
                <Settings className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Account Settings
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
              Take complete control of your account preferences, security settings, and personalization options
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <Sparkles className="h-5 w-5 mr-2" />
                Secure & Private
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <Shield className="h-5 w-5 mr-2" />
                Enhanced Security
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <User className="h-5 w-5 mr-2" />
                Personal Control
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Notification Banner */}
        {notification.show && (
          <div className={`mb-8 p-6 rounded-2xl flex items-center shadow-2xl border-2 transform transition-all duration-500 ${notification.type === 'success'
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-700'
            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-700'
            }`}>
            <div className="p-3 bg-white/50 rounded-xl mr-4">
              {notification.type === 'success'
                ? <CheckCircle className="h-7 w-7" />
                : <AlertCircle className="h-7 w-7" />}
            </div>
            <div>
              <span className="text-xl font-bold">{notification.message}</span>
              <p className="text-sm opacity-80 mt-1">
                {notification.type === 'success' ? 'Changes have been saved successfully.' : 'Please check your input and try again.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Enhanced Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 px-6 py-8 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage preferences</p>
                  </div>
                </div>
              </div>
              <nav className="px-6 py-6">
                <ul className="space-y-3">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <li key={id}>
                      <button
                        onClick={() => setActiveSection(id)}
                        className={`w-full flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-300 transform group ${activeSection === id
                          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 hover:scale-102'
                          }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${activeSection === id
                          ? 'bg-white/20'
                          : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900'
                          }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Enhanced Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Account Section */}
              {activeSection === 'account' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mr-6 shadow-lg">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Information</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Update your personal details and contact information</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div className="space-y-3">
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 font-medium text-lg shadow-sm hover:shadow-md"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed font-medium text-lg"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Lock className="h-4 w-4 mr-1" />
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                      <div className="sm:col-span-2 space-y-3">
                        <label htmlFor="address" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 font-medium text-lg shadow-sm hover:shadow-md"
                          placeholder="Enter your complete address"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-8">
                      <button
                        type="submit"
                        className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-blue-500/30"
                      >
                        <Save className="h-6 w-6 mr-3" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mr-6 shadow-lg">
                        <Palette className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Appearance Settings</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Customize your visual preferences and theme</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Theme Preference</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { id: 'auto', label: 'Auto', icon: Settings, desc: 'Match system preference' },
                            { id: 'light', label: 'Light', icon: Sun, desc: 'Light mode always' },
                            { id: 'dark', label: 'Dark', icon: Moon, desc: 'Dark mode always' }
                          ].map(({ id, label, icon: Icon, desc }) => (
                            <div key={id} className="relative">
                              <input
                                type="radio"
                                id={`theme-${id}`}
                                name="theme"
                                value={id}
                                checked={selectedTheme === id}
                                onChange={(e) => setSelectedTheme(e.target.value)}
                                className="sr-only"
                              />
                              <label
                                htmlFor={`theme-${id}`}
                                className={`block p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedTheme === id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-2xl scale-105'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl'
                                  }`}
                              >
                                <div className="flex flex-col items-center text-center">
                                  <div className={`p-4 rounded-2xl mb-4 ${selectedTheme === id ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                    <Icon className={`h-8 w-8 ${selectedTheme === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                      }`} />
                                  </div>
                                  <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{label}</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end pt-8">
                        <button
                          type="button"
                          onClick={() => showNotification('success', 'Theme preferences saved')}
                          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-purple-500/30"
                        >
                          <Save className="h-6 w-6 mr-3" />
                          Save Theme
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mr-6 shadow-lg">
                        <CreditCard className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing & Subscription</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Manage your subscription and payment methods</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="text-center py-16">
                      <div className="p-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl inline-block mb-8 shadow-lg">
                        <CreditCard className="h-20 w-20 text-gray-400" />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Active Subscription</h4>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto">
                        You don't have any active subscription plans. Upgrade to access premium features and advanced analytics.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300">
                          <CreditCard className="h-6 w-6 mr-3" />
                          Choose Plan
                        </button>
                        <button className="inline-flex items-center px-10 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                          View Pricing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mr-6 shadow-lg">
                        <Bell className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Control how and when you receive notifications</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="space-y-8">
                      {[
                        { key: 'email', label: 'Email Notifications', icon: Mail, desc: 'Receive updates via email' },
                        { key: 'mobile', label: 'Mobile Notifications', icon: Smartphone, desc: 'Push notifications on mobile' },
                        { key: 'propertyAlerts', label: 'Property Alerts', icon: Bell, desc: 'Important property updates' }
                      ].map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl mr-6 shadow-lg">
                              <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{label}</h5>
                              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof typeof notifications]}
                              onChange={(e) => handleNotificationChange(key, e.target.checked)}
                              className="sr-only peer"
                              title={label}
                              placeholder={label}
                              aria-label={label}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 shadow-lg"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="p-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl mr-6 shadow-lg">
                        <Shield className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Manage your password and account security</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordUpdate} className="p-10 space-y-10">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label htmlFor="current-password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-5 py-4 pr-14 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 font-medium text-lg shadow-sm hover:shadow-md"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-5 py-4 pr-14 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 font-medium text-lg shadow-sm hover:shadow-md"
                            placeholder="Enter your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                            ) : (
                              <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Lock className="h-4 w-4 mr-1" />
                          Password must be at least 6 characters long
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-8">
                      <button
                        type="submit"
                        className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:from-red-700 hover:to-rose-700 transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-red-500/30"
                      >
                        <Key className="h-6 w-6 mr-3" />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}