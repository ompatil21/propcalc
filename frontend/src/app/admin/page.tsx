"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Property = {
    _id: string;
    title: string;
    type: string;
    location: string;
    // add other fields as needed
};

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
    const [typeStats, setTypeStats] = useState<any[]>([]);
    const [recentProps, setRecentProps] = useState<Property[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [summaryRes, monthlyRes, typeRes, recentRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/analytics/summary", { headers }),
                    fetch("http://localhost:5000/api/admin/analytics/monthly-additions", { headers }),
                    fetch("http://localhost:5000/api/admin/analytics/property-type-distribution", { headers }),
                    fetch("http://localhost:5000/api/admin/properties?page=1&limit=5", { headers }),
                ]);

                const [summaryData, monthlyData, typeData, recentData] = await Promise.all([
                    summaryRes.json(),
                    monthlyRes.json(),
                    typeRes.json(),
                    recentRes.json(),
                ]);

                setSummary(summaryData);
                setMonthlyStats(Array.isArray(monthlyData) ? monthlyData : []);
                setTypeStats(Array.isArray(typeData) ? typeData : []);
                setRecentProps(recentData.properties || []);
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
        }),
    };

    return (
        <RequireAdmin>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[{
                                label: "Total Properties",
                                value: summary.total_properties,
                                color: "text-blue-600 dark:text-blue-400"
                            }, {
                                label: "Average Purchase Price",
                                value: summary.average_purchase_price
                                    ? `$${summary.average_purchase_price.toLocaleString()}`
                                    : "N/A",
                                color: "text-green-600 dark:text-green-400"
                            }].map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow"
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                    custom={i}
                                >
                                    <h3 className="text-lg font-semibold mb-2">{card.label}</h3>
                                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                                <h3 className="text-lg font-semibold mb-4">Monthly Additions</h3>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: monthlyStats.map((m) => m.month),
                                            datasets: [
                                                {
                                                    label: "Properties Added",
                                                    data: monthlyStats.map((m) => m.count),
                                                    backgroundColor: "rgba(59,130,246,0.6)",
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: "bottom" },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: "Month",
                                                        color: "#9ca3af",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                                <h3 className="text-lg font-semibold mb-4">Property Types</h3>
                                <div className="h-64">
                                    <Pie
                                        data={{
                                            labels: ["House", "Apartment", "Townhouse", "Duplex"],
                                            datasets: [
                                                {
                                                    data: ["House", "Apartment", "Townhouse", "Duplex"].map((type) => {
                                                        const found = typeStats.find((t) => t.type === type);
                                                        return found ? found.count : 0;
                                                    }),
                                                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                    align: "center",
                                                    labels: {
                                                        boxWidth: 12,
                                                        padding: 10,
                                                        usePointStyle: true,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Properties */}
                        <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                            <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
                            {recentProps.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentProps.map((p) => (
                                        <li key={p._id} className="py-3">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{p.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{p.type} in {p.location}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No recent properties</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </RequireAdmin>
    );
}
