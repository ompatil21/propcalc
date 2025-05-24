'use client';

import React, { useEffect, useState } from 'react';
import { getProperties, getPortfolioOverview } from '@/services/api';
import {
  Wallet, TrendingUp, Building, DollarSign,
  HelpCircle, Plus, Loader
} from 'lucide-react';
import Link from 'next/link';
import {
  ComposedChart, LineChart, Bar, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

type GrowthPoint = { year: number; start: number; end: number; gain: number };
type CashPoint = { year: number; income: number; expenses: number; net: number };

let cachedGrowthData: GrowthPoint[] = [];
let cachedCashFlowData: CashPoint[] = [];

const generateYears = () => {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => thisYear - 9 + i);
};

function generatePortfolioGrowth(): GrowthPoint[] {
  if (cachedGrowthData.length > 0) return cachedGrowthData;
  const years = generateYears();
  cachedGrowthData = years.map((year) => {
    const start = Math.floor(Math.random() * 100000 + 100000);
    const end = start + Math.floor(Math.random() * 50000 + 10000);
    return { year, start, end, gain: end - start };
  });
  return cachedGrowthData;
}

function generateCashFlow(): CashPoint[] {
  if (cachedCashFlowData.length > 0) return cachedCashFlowData;
  const years = generateYears();
  cachedCashFlowData = years.map((year) => {
    const income = Math.floor(Math.random() * 30000 + 20000);
    const expenses = Math.floor(Math.random() * 15000 + 8000);
    return { year, income, expenses, net: income - expenses };
  });
  return cachedCashFlowData;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [growthData, setGrowthData] = useState<GrowthPoint[]>([]);
  const [cashData, setCashData] = useState<CashPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProperties, setHasProperties] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        const properties = await getProperties(email);
        if (!Array.isArray(properties) || properties.length === 0) {
          setHasProperties(false);
          return;
        }

        const summaryRes = await getPortfolioOverview({ email });
        setSummary(summaryRes.summary);
        setHasProperties(true);
        setGrowthData(generatePortfolioGrowth());
        setCashData(generateCashFlow());
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-lg text-gray-600">Loading your portfolio data...</p>
      </div>
    );
  }

  if (!hasProperties) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center px-4">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-6 mb-6">
          <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No Properties Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add your first property to begin tracking your investments.
        </p>
        <Link
          href="/property/add"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-3xl shadow-xl mb-14">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-6">
          <div className="bg-white/10 p-5 rounded-2xl mb-6 shadow-md">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            My Property Portfolio
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:scale-105 transition">
              <Wallet className="h-4 w-4 mr-2" /> Investment Summary
            </span>
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:scale-105 transition">
              <LineChart className="h-4 w-4 mr-2" /> Portfolio Insights
            </span>
            <span className="flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:scale-105 transition">
              <TrendingUp className="h-4 w-4 mr-2" /> Market Trends
            </span>
          </div>
        </div>
      </div>

      {/* Header & Add Property Button */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Portfolio Dashboard
        </h2>
        <Link
          href="/property/add"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow transition duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <SummaryCard
          title="Portfolio Value"
          value={formatCurrency(summary.portfolio_value)}
          icon={<Wallet className="h-6 w-6" />}
          trend="up"
          color="blue"
        />
        <SummaryCard
          title="Monthly Cash Flow"
          value={formatCurrency(Math.floor(Math.random() * 5000 + 2000))}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          color="green"
        />
        <SummaryCard
          title="Total Properties"
          value={summary.total_properties}
          icon={<Building className="h-6 w-6" />}
          color="purple"
        />
        <SummaryCard
          title="Average Cap Rate"
          value={`${(Math.random() * 6 + 2).toFixed(1)}%`}
          icon={<DollarSign className="h-6 w-6" />}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ChartCard title="📈 Portfolio Growth" description="Start vs End Value vs Gain">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="start" fill="#3b82f6" name="Start" />
              <Bar dataKey="end" fill="#10b981" name="End" />
              <Line type="monotone" dataKey="gain" stroke="#6366f1" strokeWidth={3} name="Gain" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="💵 Cash Flow Analysis" description="Income vs Expenses vs Net">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#34d399" name="Income" />
              <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
              <Line dataKey="net" stroke="#8b5cf6" name="Net Flow" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );

}

// Summary Card Component
function SummaryCard({
  title, value, icon, trend, color = "blue"
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  color?: "blue" | "green" | "red" | "purple" | "amber";
}) {
  const colorMap = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600"
  }[color];

  const trendMap = trend === "up"
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className={`p-3 rounded-lg ${colorMap}`}>{icon}</div>
          {trend && (
            <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${trendMap}`}>
              {trend === "up" ? "↑ Up" : "↓ Down"}
            </span>
          )}
        </div>
        <dl>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
          <dd className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</dd>
        </dl>
      </div>
    </div>
  );
}

// Chart Card Container
function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="p-6 h-80">{children}</div>
    </div>
  );
}
