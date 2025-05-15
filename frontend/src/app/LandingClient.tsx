'use client';

import { BarChart2, Building, Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";


export default function LandingPage() {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <h1>
                                <span className="block text-sm font-semibold uppercase tracking-wide text-white">PropCalc</span>
                                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                                    <span className="block text-white">Smart Property</span>
                                    <span className="block text-blue-200">Investment Analytics</span>
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                Make data-driven real estate investment decisions with comprehensive analytics, cash flow projections, and tax optimization tools.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                                >
                                    Get Started
                                </Link>
                                <p className="mt-4 text-sm text-blue-100">
                                    Admin?{" "}
                                    <Link
                                        href="/admin/login"
                                        className="underline hover:text-white"
                                    >
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                        <BarChart2 className="h-24 w-24 text-blue-500" />
                                    </div>
                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                        <div className="opacity-80 rounded-lg overflow-hidden">
                                            <div className="relative h-64">
                                                <div className="absolute p-5 flex flex-col gap-2 w-full h-full justify-center items-center backdrop-blur-sm bg-black/30">
                                                    <p className="text-xl font-semibold text-white">Property Investment Calculator</p>
                                                    <p className="text-sm text-white">Analyze returns, optimize taxes, and track portfolio growth</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Features</h2>
                        <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight">
                            Everything you need to manage your investments
                        </p>
                        <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
                            Our comprehensive suite of tools helps you make smarter real estate investment decisions.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <Feature
                                icon={<Calculator className="h-6 w-6" />}
                                title="Cash Flow Analysis"
                                description="Calculate monthly and annual cash flow with detailed income and expense breakdowns to ensure profitability."
                            />
                            <Feature
                                icon={<TrendingUp className="h-6 w-6" />}
                                title="Investment Simulator"
                                description="Model different investment scenarios and see their long-term impact on your portfolio and wealth."
                            />
                            <Feature
                                icon={<Building className="h-6 w-6" />}
                                title="Property Management"
                                description="Track all your properties in one place with detailed metrics, documentation, and maintenance history."
                            />
                            <Feature
                                icon={<BarChart2 className="h-6 w-6" />}
                                title="Tax Optimization"
                                description="Maximize tax advantages with our property tax calculator and deduction tracker for improved returns."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from "react";

function Feature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="relative">
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                {icon}
            </div>
            <div className="ml-16">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}
