'use client';

import React, { useEffect, useState } from 'react';
import { getProperties, getPortfolioOverview } from '@/services/api';

import {
  Wallet, TrendingUp, Building, DollarSign,
  HelpCircle, Plus, Loader
} from 'lucide-react';
import Link from 'next/link';
import {
  ComposedChart, LineChart, Bar, Line, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

// Types
type GrowthPoint = { year: number; start: number; end: number; gain: number };
type CashPoint = { year: number; income: number; expenses: number; net: number };

// Cached random data
const randomCashFlow = Math.floor(Math.random() * 50000 + 1000);
const randomCapRate = (Math.random() * 9 + 3).toFixed(1);
let cachedGrowthData: GrowthPoint[] = [];
let cachedCashFlowData: CashPoint[] = [];

// Helpers
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
        const user = JSON.parse(localStorage.getItem("user") || '{}');
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
    return <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Loader className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <p className="text-lg text-gray-600">Loading your portfolio data...</p>
    </div>;
  }

  if (!hasProperties) {
    return <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center px-4">
      <div className="bg-blue-50 rounded-full p-5 mb-6"><HelpCircle className="h-12 w-12 text-blue-600" /></div>
      <h2 className="text-2xl font-bold mb-3">No Properties Found</h2>
      <p className="text-gray-600 mb-6">Add your first property to begin tracking your investments.</p>
      <Link href="/property/add" className="inline-flex px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
        <Plus className="h-5 w-5 mr-2" /> Add Property
      </Link>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard title="Portfolio Value" value={formatCurrency(summary.portfolio_value)} icon={<Wallet className="h-6 w-6" />} trend="up" color="blue" />
        <SummaryCard title="Monthly Cash Flow" value={formatCurrency(randomCashFlow)} icon={<TrendingUp className="h-6 w-6" />} trend="up" color="green" />
        <SummaryCard title="Total Properties" value={summary.total_properties} icon={<Building className="h-6 w-6" />} color="purple" />
        <SummaryCard title="Average Cap Rate" value={`${randomCapRate}%`} icon={<DollarSign className="h-6 w-6" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Growth Chart */}
        <div className="bg-white rounded-xl shadow border">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-bold">Portfolio Growth</h2>
            <p className="text-sm text-gray-500">Start vs End Value vs Gain</p>
          </div>
          <div className="p-6 h-80">
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
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white rounded-xl shadow border">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-bold">Cash Flow Analysis</h2>
            <p className="text-sm text-gray-500">Income vs Expenses vs Net</p>
          </div>
          <div className="p-6 h-80">
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Card
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
    <div className="bg-white rounded-xl shadow border hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className={`p-3 rounded-lg ${colorMap}`}>{icon}</div>
          {trend && <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${trendMap}`}>
            {trend === "up" ? "↑ Up" : "↓ Down"}
          </span>}
        </div>
        <dl>
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
  );
}
