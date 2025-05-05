'use client';

import * as React from "react";
import { Save, Moon, Sun, User, CreditCard, Bell, Lock } from "lucide-react";

export default function SettingsPage() {
  const [hasSettings, setHasSettings] = React.useState(false);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <nav className="px-4 py-5">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#account"
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-md"
                    >
                      <User className="h-5 w-5 mr-3" />
                      Account
                    </a>
                  </li>
                  <li>
                    <a
                      href="#appearance"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"
                    >
                      <Sun className="h-5 w-5 mr-3" />
                      Appearance
                    </a>
                  </li>
                  <li>
                    <a
                      href="#billing"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      Billing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#notifications"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      Notifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="#security"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-md"
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      Security
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              {/* Account Settings */}
              <div id="account" className="px-4 py-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Update your account information and email preferences.
                </p>
                <div className="mt-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autoComplete="family-name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Photo
                        </label>
                        <div className="mt-2 flex items-center">
                          <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                          <button
                            type="button"
                            className="ml-5 bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Appearance Settings */}
              <div id="appearance" className="px-4 py-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Customize how PropCalc looks on your device.
                </p>
                <div className="mt-6">
                  <div className="space-y-4">
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="theme-auto"
                            name="theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700"
                          />
                          <label htmlFor="theme-auto" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Auto (follow system preference)
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="theme-light"
                            name="theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700"
                          />
                          <label htmlFor="theme-light" className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="theme-dark"
                            name="theme"
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700"
                          />
                          <label htmlFor="theme-dark" className="ml-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </label>
                        </div>
                      </div>
                    </fieldset>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency Format</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred currency display format</p>
                      </div>
                      <select
                        id="currency"
                        name="currency"
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select currency</option>
                        <option value="usd">$ (USD)</option>
                        <option value="eur">€ (EUR)</option>
                        <option value="gbp">£ (GBP)</option>
                        <option value="cad">$ (CAD)</option>
                        <option value="aud">$ (AUD)</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred date display format</p>
                      </div>
                      <select
                        id="date-format"
                        name="date-format"
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select date format</option>
                        <option value="mdy">MM/DD/YYYY</option>
                        <option value="dmy">DD/MM/YYYY</option>
                        <option value="ymd">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Settings */}
              <div id="billing" className="px-4 py-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage your subscription and payment methods.
                </p>
                <div className="mt-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Current Plan
                    </h3>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No active plan</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subscribe to access premium features</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Choose Plan
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Payment Methods
                    </h3>
                    <div className="mt-2 flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No payment methods added</p>
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Billing History
                    </h3>
                    <div className="mt-2 flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No billing history available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications Settings */}
              <div id="notifications" className="px-4 py-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage your notification preferences.
                </p>
                <div className="mt-6 space-y-6">
                  <fieldset>
                    <legend className="sr-only">Notification method</legend>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            name="notification-method"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                          <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email notifications
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="browser-notifications"
                            name="notification-method"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                          <label htmlFor="browser-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Browser notifications
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="mobile-notifications"
                            name="notification-method"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                          <label htmlFor="mobile-notifications" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mobile notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification types</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="payment-notifications"
                            name="payment-notifications"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="payment-notifications" className="font-medium text-gray-700 dark:text-gray-300">Payment notifications</label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about upcoming payments and receipts.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="property-updates"
                            name="property-updates"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="property-updates" className="font-medium text-gray-700 dark:text-gray-300">Property updates</label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about property market updates and changes.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="maintenance-alerts"
                            name="maintenance-alerts"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="maintenance-alerts" className="font-medium text-gray-700 dark:text-gray-300">Maintenance alerts</label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about maintenance requests and scheduled maintenance.</p>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div id="security" className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage your security settings and two-factor authentication.
                </p>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</h3>
                    <div className="mt-2 space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="current-password"
                            name="current-password"
                            type="password"
                            autoComplete="current-password"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            autoComplete="new-password"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Set up two-factor authentication
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your active sessions across different devices.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View active sessions
                        </button>
                        <button
                          type="button"
                          className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sign out all sessions
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}