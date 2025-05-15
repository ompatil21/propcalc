"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API } from "@/lib/api";
import Loader from "@/components/Loader";
import RequireAdmin from "@/components/RequireAdmin";

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/admin/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch details");
            const data = await res.json();
            setProperty(data);
        } catch (err) {
            console.error("Error loading property:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    if (loading) return <Loader />;
    if (!property) return <div className="text-red-500">Property not found.</div>;

    return (
        <RequireAdmin>
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Property Details</h1>
                <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-500 text-sm">Title</label>
                            <p className="text-lg font-medium">{property.title}</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Location</label>
                            <p className="text-lg font-medium">{property.location}</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Type</label>
                            <p className="text-lg font-medium capitalize">{property.type}</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Created At</label>
                            <p className="text-lg font-medium">
                                {new Date(property.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Purchase Price</label>
                            <p className="text-lg font-medium">${property.purchase_price?.toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Loan Term</label>
                            <p className="text-lg font-medium">{property.loan_term} years</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Interest Rate</label>
                            <p className="text-lg font-medium">{property.interest_rate}%</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Rent</label>
                            <p className="text-lg font-medium">${property.rent?.toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Vacancy Rate</label>
                            <p className="text-lg font-medium">{property.vacancy_rate}%</p>
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Expenses</label>
                            <p className="text-lg font-medium">${property.expenses?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAdmin>
    );
}
