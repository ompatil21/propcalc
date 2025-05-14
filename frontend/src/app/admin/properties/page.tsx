"use client";

import { useEffect, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { API } from "@/lib/api";

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/admin/properties?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProperties(data.properties);
            setTotal(data.total);
        } catch (err) {
            console.error("Error loading properties:", err);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Delete this property?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/properties/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            alert("Deleted");
            fetchData();
        } else {
            alert("Delete failed");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <RequireAdmin>
            <div>
                <h2 className="text-xl font-semibold mb-4">Properties</h2>
                <table className="w-full bg-white dark:bg-gray-800 shadow rounded overflow-hidden text-left">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((p: any) => (
                            <tr
                                key={p._id}
                                className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                <td className="px-4 py-2 max-w-xs truncate" title={p.title}>
                                    🏠 {p.title?.slice(0, 6) + "••••"}
                                </td>
                                <td className="px-4 py-2 truncate" title={p.location}>
                                    {p.location?.slice(0, 3) + "•••"}
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${p.type === "House"
                                                ? "bg-blue-100 text-blue-800"
                                                : p.type === "Duplex"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {p.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="text-red-500 hover:text-red-700 transition font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                <div className="flex justify-between items-center mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>Page {page}</span>
                    <button disabled={(page * limit) >= total} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            </div>
        </RequireAdmin>
    );
}
