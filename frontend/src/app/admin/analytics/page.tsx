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
} from "chart.js";
import RequireAdmin from "@/components/RequireAdmin";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [typeData, setTypeData] = useState([]);

    useEffect(() => {
        fetch("/api/admin/analytics/monthly-additions")
            .then(res => res.json())
            .then(setMonthlyData)
            .catch(console.error);

        fetch("/api/admin/analytics/property-type-distribution")
            .then(res => res.json())
            .then(setTypeData)
            .catch(console.error);
    }, []);

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
            },
        ],
    };

    return (
        <RequireAdmin>
            <div>
                <h2 className="text-2xl font-semibold mb-6">Portfolio Analytics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-6 shadow rounded">
                        <h3 className="text-lg font-semibold mb-4">Monthly Additions</h3>
                        <Bar data={barChartData} />
                    </div>

                    <div className="bg-white p-6 shadow rounded">
                        <h3 className="text-lg font-semibold mb-4">Property Type Distribution</h3>
                        <Pie data={pieChartData} />
                    </div>
                </div>
            </div>
        </RequireAdmin>
    );
}
