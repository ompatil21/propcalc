"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import RequireAdmin from "@/components/RequireAdmin";
import { API } from "@/lib/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [typeData, setTypeData] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API}/api/admin/analytics/monthly-additions`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setMonthlyData(Array.isArray(data) ? data : []))
            .catch(console.error);

        fetch(`${API}/api/admin/analytics/property-type-distribution`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setTypeData(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, []);

    const totalTypes = Array.isArray(typeData) ? typeData.reduce((acc, curr) => acc + curr.count, 0) : 0;
    const totalMonthly = Array.isArray(monthlyData) ? monthlyData.reduce((acc, curr) => acc + curr.count, 0) : 0;

    const barChartData = {
        labels: monthlyData.map((m: any) => m.month),
        datasets: [
            {
                label: "Properties Added",
                data: monthlyData.map((m: any) => m.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const pieChartData = {
        labels: typeData.map((t: any) => t.type),
        datasets: [
            {
                data: typeData.map((t: any) => t.count),
                backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
                borderWidth: 1,
            },
        ],
    };

    const barOptions: ChartOptions<"bar"> = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || "";
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: "bottom",
            },
        },
    };

    const pieOptions: ChartOptions<"pie"> = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || "";
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: "bottom",
            },
        },
    };

    return (
        <RequireAdmin>
            <div className="space-y-10">
                <h2 className="text-2xl font-semibold">Portfolio Analytics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded">
                        <h3 className="text-lg font-semibold mb-4">Monthly Additions</h3>
                        <Bar data={barChartData} options={barOptions} />
                        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Helps track acquisition activity over time.</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded ">
                        <h3 className="text-lg font-semibold mb-4">Property Type Distribution</h3>
                        <Pie data={pieChartData} options={pieOptions} />
                        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Hover to see the exact count and percentage share.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </RequireAdmin>
    );
}
